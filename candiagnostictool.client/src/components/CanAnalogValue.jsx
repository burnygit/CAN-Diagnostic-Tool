import React, { useState, useEffect, useRef } from 'react';
import "./CanAnalogValue.css"

import { useWebSocketContext } from './WebSocketContext';


const EniAnalogValue = ({ Identifier, startByte, length, factor = 1, decimalPlaces = 2, Label, Unit }) => {

    const {data} = useWebSocketContext();

    const extractValue = (frame, startByte, length, factor, decimalPlaces) => {
        if (!frame || !frame.Data) {
            console.error('Invalid frame data:', frame);
            return 0; // Zwracamy 0, jeśli nie ma danych
        }

        let value = 0;
        for (let i = 0; i < length; i++) {
            const byteValue = frame.Data[startByte + i];
            if (byteValue === undefined) {
                console.error('Byte value is undefined at index:', startByte + i);
                return 0; // Zwracamy 0, jeśli jest problem z bajtem
            }
            value = (value << 8) | byteValue; // Łączenie bajtów
        }

        // Zwracamy wartość po podzieleniu przez factor i zaokrągleniu do wymaganej liczby miejsc
        return (value / factor).toFixed(decimalPlaces);
    };

    let value = 0;
    const frame = data?.[Identifier]; // Pobierz dane tylko dla danego identyfikatora CAN
    if (frame && frame.Data) {
        value = extractValue(frame, startByte, length, factor, decimalPlaces);


    }

    return (
        <div className={`analogContainer`}>

            <div className={`analogHeader`}>
                <div className="analogLabel"> {Label} </div>
            </div>

            <div className="analogValue"> {value} </div>


            <div className="analogFooter">
                <div className="analogUnit">{Unit} </div>
            </div>
        </div>
    )
}

export default EniAnalogValue;