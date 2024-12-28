import React, { createContext, useContext, useState, useEffect, useRef } from 'react';


// Stwórz kontekst
const WebSocketContext = createContext(null);

// Hook do dostępu do kontekstu
export const useWebSocketContext = () => useContext(WebSocketContext);

// Provider dla WebSocket
export const WebSocketProvider = ({ url, children }) => {
    const [data, setData] = useState({});
    const wsRef = useRef(null);

    // Funkcja do wysyłania wiadomości
    const sendMessage = (message) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            const jsonMessage = JSON.stringify(message);
            console.log('Sending:', jsonMessage);
            wsRef.current.send(jsonMessage); // Wysłanie wiadomości
        } else {
            console.error('WebSocket is not connected.');
        }
    };

    useEffect(() => {
        const connectWebSocket = () => {
            if (wsRef.current) return; // Unikaj wielokrotnych połączeń

            const ws = new WebSocket(url);
            wsRef.current = ws;

            ws.onopen = () => console.log('WebSocket connected');

            ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    console.log('Received message:', message);
                    //setData((prevData) => ({ ...prevData, ...message }))
                    if (message.Identifier && Array.isArray(message.Data)) {
                        setData((prevData) => {
                            // Aktualizuj tylko odpowiednią część danych dla tego identyfikatora
                            return {
                                ...prevData,
                                [message.Identifier]: message
                            };
                        });
                    }
                    else {
                        console.warn('Invalid message format:', message);
                    }
                    console.log(message);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            ws.onclose = () => {
                console.log('WebSocket closed. Reconnecting...');
                wsRef.current = null;
                setTimeout(connectWebSocket, 5000); // Ponowna próba połączenia
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                ws.close();
            };
        };

        connectWebSocket();

        return () => {
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, [url]);

    return (
        <WebSocketContext.Provider value={{ data, sendMessage }}>
            {children}
        </WebSocketContext.Provider>
    );
};
