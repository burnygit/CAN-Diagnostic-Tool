import { useEffect, useState, useRef } from 'react';
import './App.css';

import './components/CanReceived.jsx'
import CanReceived from './components/CanReceived.jsx';


const App = () => {

//    const wsRef = useRef(null);

//    const receiveWS = () => {
//        if (wsRef.current) return;

//        const ws = new WebSocket("wss://localhost:7199/ws/can");
//        wsRef.current = ws;

//        ws.onopen = () => {
//            console.log("WebSocket connection established (Połączono WebSocket)");
//        };

//        ws.onmessage = (event) => {
//            console.log("Received CAN message: ", JSON.parse(event.data));
//        };

//        ws.onclose = () => {
//            console.log("WebSocket connection closed (Zamknięto połączenie z WebSocket)");
//            wsRef.current = null;
//            setTimeout(receiveWS, 5000);
//        };

//        ws.onerror = (error) => {
//            console.error("Websocket error:", error);
//        };
//    }
          
//    //useEffect aby zapobiec duplikowaniu sie WS
//    useEffect(() => {
//        receiveWS();

//        return () => {
//            if (wsRef.current) {
//                console.log("receiveWebSocket state: ", wsRef.current.readyState); // 0 CONNECTING / 1 OPEN / 2 CLOSING / 3 CLOSED
//                if (wsRef.current.readyState === WebSocket.OPEN) {
//                    wsRef.current.close();
//                    wsRef.current = null;
//                }
//            }
//        };

//}, [])
    


    return (

        <div className="container">
            <div className = "header">
                <div className="headerTitle">

                    <h5>Adam Burny</h5>
                    <h1>CAN Diagnostic Tool</h1>

                </div>
            </div>
            <CanReceived/>
            </div>

    );
    

}

export default App;