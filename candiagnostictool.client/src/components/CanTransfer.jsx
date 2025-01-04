import React, { useState, useRef, useEffect } from 'react';
import './CanTransfer.css';
import CanSendValue from './CanSendValue';

const CanTransfer = () => {

    const sendWebSocketRef = useRef(null);

    const connectSendWebSocket = () => {
        if (sendWebSocketRef.current) return;

        const ws = new WebSocket('wss://localhost:7199/ws/canSend');
        sendWebSocketRef.current = ws;

        ws.onopen = () => {
            console.log('WebSocket SEND connection established');
        };

        ws.onclose = () => {
            console.log('SEND WebSocket connection closed. Reconnecting...');
            sendWebSocketRef.current = null;
            setTimeout(connectSendWebSocket, 100);
        };

        ws.onerror = (error) => {
            console.error('WebSocket SEND error:', error);
            ws.close();
        };
    };

    useEffect(() => {
        connectSendWebSocket();

        return () => {
            if (sendWebSocketRef.current) {
                console.log("sendWebSocket state: ", sendWebSocketRef.current.readyState);
                if (sendWebSocketRef.current.readyState === WebSocket.OPEN) {
                    sendWebSocketRef.current.close();
                }
            }
        };
    }, []);



    /////FUNKCJE WYSYLAJACE RAMKI/////

    const sendCurrentValue = (current) => {

        if (sendWebSocketRef.current && sendWebSocketRef.current.readyState === WebSocket.OPEN) {
            // wartość prądu i ma być wysłana w 7 i 8 bajcie
            const currentInBytes = Math.round(current * 100);
            const byte7 = (currentInBytes >> 8) & 0xFF; // Wyciągamy wyższy bajt
            const byte8 = currentInBytes & 0xFF; // Wyciągamy niższy bajt

            const message = {
                Identifier: 0x3C4, // Identyfikator CAN
                Data: [0, 0, 0, 0, 0, 0, byte7, byte8] // Tworzymy ramkę CAN z prądem w 7 i 8 bajcie
            };

            sendWebSocketRef.current.send(JSON.stringify(message));


            console.log(`Sent CAN message with current: ${current} A`);
        } else {
            console.error('WebSocket is not open');
        }
    };

    const sendVoltageValue = (voltage) => {

        if (sendWebSocketRef.current && sendWebSocketRef.current.readyState === WebSocket.OPEN) {
            // wartość prądu i ma być wysłana w 7 i 8 bajcie
            const currentInBytes = Math.round(voltage * 100);
            const byte7 = (currentInBytes >> 8) & 0xFF; // Wyciągamy wyższy bajt
            const byte8 = currentInBytes & 0xFF; // Wyciągamy niższy bajt

            const message = {
                Identifier: 0x5D1, // Identyfikator CAN
                Data: [0, 0, 0, 0, 0, 0, byte7, byte8] // Tworzymy ramkę CAN z prądem w 7 i 8 bajcie
            };

            sendWebSocketRef.current.send(JSON.stringify(message));


            console.log(`Sent CAN message with current: ${voltage} A`);
        } else {
            console.error('WebSocket is not open');
        }
    };


    return (
        <div className="transferFormContainer">

            <CanSendValue
                label="Nastaw ICH"
                min={0}
                max={0.99}
                interval={1000}
                onSendValue={sendCurrentValue}
            />

        </div>
    );
};

export default CanTransfer;