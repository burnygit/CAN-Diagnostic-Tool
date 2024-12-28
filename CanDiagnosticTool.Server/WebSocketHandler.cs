
using System.Net.WebSockets;
using System.Runtime.CompilerServices;
using System.Text.Json;
using Ixxat.Vci4.Bal.Can;

namespace CanDiagnosticTool.Server
{
    public class WebSocketHandler
    {
        private readonly ICanService _canService;

        public WebSocketHandler(ICanService canService)
        {
            _canService = canService;
        }

        //Obsługa odbierania danych z magistrali CAN i wysyłania do frontendu
        public async Task HandleReceive(WebSocket webSocket)
        {
            var messageReader = _canService.GetMessageReader();

            //debug
            int messageCount = 0;

            while (webSocket.State == WebSocketState.Open)
            {
                //Sprawdza, czy są nowe wiadomości z magistrali CAN
                if (messageReader.ReadMessage(out ICanMessage message))
                {
                    //Tworzy obiekt wiadomości do wysłania do frontendu
                    var canMessage = new
                    {
                        Identifier = message.Identifier,
                        Timestamp = message.TimeStamp,
                        Data = Enumerable.Range(0, message.DataLength)
                                         .Select(i => (int)message[i])
                                         .ToArray()
                    };

                    //Serializacja do JSOn
                    string jsonMessage = JsonSerializer.Serialize(canMessage);
                    var data = new ArraySegment<byte>(System.Text.Encoding.UTF8.GetBytes(jsonMessage));

                    //Wysył wiadomości w formacie JSON do fronta
                    await webSocket.SendAsync(data, WebSocketMessageType.Text, true, CancellationToken.None);

                    //debug
                    messageCount++;
                    if (messageCount % 100 == 0)
                    {
                        Console.WriteLine($"Sent {messageCount} messages.");
                    }
                    //debug end
                }

                //[!] Mozliwe ze do usunięcia (Delay)
                await Task.Delay(2);
            }
            await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing", CancellationToken.None);
        }

        public async Task HandleSend(WebSocket webSocket)
        { 
            var messageWriter = _canService.GetMessageWriter();
            var buffer = new byte[1024 * 4];

            while (webSocket.State == WebSocketState.Open)
            {
                var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
                if (result.MessageType == WebSocketMessageType.Close)
                {
                    break;
                }

                var receivedData = System.Text.Encoding.UTF8.GetString(buffer, 0, result.Count);

                try
                {
                    Console.WriteLine($"Received raw data: {receivedData}");

                    var messageFromClient = JsonSerializer.Deserialize<CanMessageFromClient>(receivedData);

                    Console.WriteLine($"Deserialized Message - Identifier: {messageFromClient?.Identifier}, Data: {string.Join(",", messageFromClient?.Data ?? new int[0])}, CurrentValue: {messageFromClient?.Value}");

                    if (messageFromClient != null)
                    {
                        byte[] dataAsBytes = messageFromClient.Data.Select(i => (byte)i).ToArray();

                        Console.WriteLine($"Data As bYTES: {BitConverter.ToString(dataAsBytes)}");

                        var canMessageToSend = _canService.CreateMessage(new CanMessage
                        {
                            // [!] Zmienic Identifier CanMessage na int (niepotrzebne rzutowanie na uint)
                            Identifier = (uint)messageFromClient.Identifier,
                            Data = new byte[8]
                        });

                        for (int i = 0; i <dataAsBytes.Length && i < 8; i++)
                        {
                            canMessageToSend[i] = dataAsBytes[i];
                        }

                        try
                        {
                            messageWriter.SendMessage(canMessageToSend);
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"Error sending CAN message: {ex.Message}");
                        }
                    }
                    else
                    {
                        Console.WriteLine("Invalid CAN Message received.");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error processing message: {ex.Message}");
                }
            }

            await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing", CancellationToken.None);
        
        }
         
    }

    
}
