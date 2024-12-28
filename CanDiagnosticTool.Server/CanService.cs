namespace CanDiagnosticTool.Server
{
    using Ixxat.Vci4;
    using Ixxat.Vci4.Bal;
    using Ixxat.Vci4.Bal.Can;
    using System;

    public interface ICanService : IDisposable
    {
        ICanMessageReader GetMessageReader();
        ICanMessageWriter GetMessageWriter();
        ICanMessage CreateMessage(CanMessage message);
        void SendMessage(CanMessage message);
    }
    public class CanService : ICanService
    {
        #region Zmienne CanService

        private readonly IVciDevice _device; //połączenie z ficzynym urządzeniem Ixxat
        private readonly ICanChannel _canChannel; //kanał CAN, przez który przesyłam dane
        private readonly ICanControl _canControl; //kontrola / konfiguracja parametrów kanału CAN
        private readonly IMessageFactory _messageFactory;
        private readonly ICanMessageWriter _messageWriter; //wysyłanie wiadomości CAN do urządzenia
        private ICanMessageReader _messageReader; //odbieranie wiadomości CAN
        private bool _disposed = false; //flaga (czy obiekt CanService został już zwolniony?) zapobiega duplikacji / błędom

        #endregion
        public CanService()
        {
            try {
                var assemblyLoadPath = AppDomain.CurrentDomain.BaseDirectory;

                //IVciServer jest typu "non-nullable", zadeklarowalem jako IVciServer?, więc sprawdzam czy nie jest null na wszelki.
                IVciServer? vciServer = VciServer.Instance(assemblyLoadPath)
                    ?? throw new Exception("Failed to create VCI server instance. (Sprawdz scieżkę assemblyLoadPath)");

                //Ustawienie fizycznego urządzenia Ixxat CAN to USB
                var deviceManager = vciServer.DeviceManager;
                var deviceList = deviceManager.GetDeviceList();

                _device = deviceList.OfType<IVciDevice>().FirstOrDefault(); // mozna dodac d => d.DeviceID == "Twoje_urządzenie_ID" jako argument FirstOrDefault
                if (_device == null)
                {
                    Console.WriteLine("No VCI devices found.");
                }
                else
                {
                    Console.WriteLine($"Device {_device.UniqueHardwareId} found.");
                }
                //?? throw new Exception("No VCI devices found. (Nie odnaleziono podłączonego urządzenia Ixxat)");

                //(Bus Access Layer) Obiekt odpowiedzialny za interakcje z fizycznym interfejsem CAN, otwiera on gniazdo CAN
                IBalObject bal = _device.OpenBusAccessLayer();
                _canChannel = bal.OpenSocket(0, typeof(ICanChannel)) as ICanChannel
                ?? throw new Exception("Failed to open CAN channel");

                _canControl = bal.OpenSocket(0, typeof(ICanControl)) as ICanControl
                    ?? throw new Exception("Failed to open CAN control");

                //Inicjalizacja linii CAN
                var bitrate = CanBitrate.Cia250KBit;
                _canControl.InitLine(CanOperatingModes.Standard, bitrate);
                _canControl.StartLine();
                Console.WriteLine("Can line initialized with 250 kbit/s");

                //Initialize(rozmiar receiveFIFO, rozmiar transmitFIFO,
                //bool false = wylaczony tryb buforowania overrun,
                //gdy bufor jest przepelniony moga wystapic bledy lub opoznienia w odbieraniu)
                //Po ustawieniu na true w przypadku przepełnienia: nadchodzące wiadomości mogą zostać odrzucone
                _canChannel.Initialize(2048, 256, false);
                _canChannel.Activate();


                _messageFactory = vciServer.MsgFactory;
                _messageWriter = _canChannel.GetMessageWriter();
                }

            catch(Exception ex)
            {
                Console.WriteLine($"Error initializing CAN interface: {ex.Message}");
            }

        }

        //[!] DODAJ TRY CATCH DO KONSTRUKTORA


        // Funkcja wrapująca zapobiegająca duplikowaniu się MessageReadera gdy jest już zaimplementowany

        //[!] NA RAZIE SPROBUJE ZROBIC NA POJEDYNCZEJ INSTACJI readonly _messageReader

        //public ICanMessageReader GetMessageReader() { return _messageReader; }
        private static readonly object _readerLock = new object();

        public ICanMessageReader GetMessageReader()
        {
            lock (_readerLock)
            {
                if (_messageReader == null)
                {
                    try
                    {
                        Console.WriteLine("[Can Message Reader] Initializing Reader...");
                        _messageReader = _canChannel.GetMessageReader();

                        if (_messageReader != null)
                        {
                            Console.WriteLine("[Can Message Reader] Initialized successfully.");
                        }
                        else
                        {
                            Console.WriteLine("[Can Message Reader] Failed to initialize.");
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error initializing CAN Message Reader: {ex.Message}");
                        throw;
                    }
                }
                else
                {
                    Console.WriteLine("[Can Message Reader] already initialized.");
                }

                return _messageReader;
            }
        }

        // Funkcja wrapująca by nie duplikwoał się Writer
        public ICanMessageWriter GetMessageWriter() { return _messageWriter; }

        public ICanMessage CreateMessage(CanMessage message)
        {
            ICanMessage canMessage = (ICanMessage)_messageFactory.CreateMsg(typeof(ICanMessage));
            canMessage.Identifier = message.Identifier;
            canMessage.TimeStamp = message.Timestamp;

            if (message.Data != null && message.Data.Length > 0)
            {
                canMessage.DataLength = (byte)message.Data.Length;

                byte[] dataBytes = message.Data.Select(i => (byte)i).ToArray();
                for (int i = 0; i < dataBytes.Length; i++)
                {
                    canMessage[i] = dataBytes[i];
                }
            }
            else
            {
                canMessage.DataLength = 0;
            }

            return canMessage;
        }

        public void SendMessage(CanMessage message)
        {
            try
            {
                // Tworzymy ICanMessage na podstawie niestandardowego CanMessage
                ICanMessage canMessageToSend = CreateMessage(message);

                // Wysłanie wiadomości CAN za pomocą ICanMessageWriter
                _messageWriter.SendMessage(canMessageToSend);
                Console.WriteLine("CAN message sent successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending CAN message: {ex.Message}");
                throw;
            }
        }

        public void Dispose()
        {
            if (!_disposed)
            {
                Console.WriteLine("Disposing CanChannel...");
                _canChannel?.Dispose();
                _device?.Dispose();
                _disposed = true;
            }
        }
    }


    //Pomocnicza klasa wiadomości, do przekształcenia z ICanMessage(która nie moze przejsc do frontu)
    public class CanMessage
    {
        public uint Identifier { get; set; }
        public byte[] Data { get; set; }
        public uint Timestamp { get; set; }
    }

    public class CanMessageFromClient // Data od klienta musi byc w postaci tablicy int (JSON ograniczenie)
    {
        public int Identifier { get; set; }
        public int[] Data { get; set; }
        public float Value { get; set; }
    }
}
