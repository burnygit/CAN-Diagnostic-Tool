import { useEffect, useState } from 'react';
import './App.css';

function App() {

    const ws = new WebSocket("wss://localhost:7199/ws/can");

    ws.onopen = () => {
        console.log("WebSocket connection established (Połączono WebSocket)");
    };

    ws.onmessage = (event) => {
        console.log("Received CAN message: ", JSON.parse(event.data));
    };

    ws.onclose = () => {
        console.log("WebSocket connection closed (Zamknięto połączenie z WebSocket)");
    };

    ws.onerror = (error) => {
        console.error("Websocket error:", error);
    } 


    return (
        <div>
            <h1 id="tableLabel">Can Web Diagnostic Tool</h1>
        </div>
    );
    

}

export default App;