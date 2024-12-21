
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
         
    }

    
}
