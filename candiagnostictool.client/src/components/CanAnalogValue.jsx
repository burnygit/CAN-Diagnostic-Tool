import React, { useState, useEffect, useRef } from 'react';
import "./CanAnalogValue.css"

import { useWebSocketContext } from './WebSocketContext';


const EniAnalogValue = ({ Identifier, startBit, length, factor = 1, decimalPlaces = 2, Label, Unit, isSigned = false }) => {

    const {data} = useWebSocketContext();

    const extractValue = (frame, startByte, length, factor, decimalPlaces, isSigned) => {
        if (!frame || !frame.Data) {
            console.error('Invalid frame data:', frame);
            return 0; // Zwracamy 0, jeśli nie ma danych
        }

        let value = 0;
        for (let i = 0; i < length; i++) {
            const bitIndex = startBit + i;
            const byteIndex = Math.floor(bitIndex / 8);
            const bitOffset = 7 - (bitIndex % 8);          
           
            if (frame.Data[byteIndex] === undefined) {
                console.error('Byte value is undefined at index:', startByte + i);
                return 0; // Zwracamy 0, jeśli jest problem z bajtem
            }
            const bit = (frame.Data[byteIndex] >> bitOffset) & 1;
            value = (value << 1) | bit; // Łączenie bajtów
        }

        // Jeśli wartość jest signed, uwzględniamy najbardziej znaczący bit
        if (isSigned && (value & (1 << (length -1)))) {
            value -= (1 << length); // Konwersja na liczbę ujemną
        }
        // Zwracamy wartość po podzieleniu przez factor i zaokrągleniu do wymaganej liczby miejsc
        return (value / factor).toFixed(decimalPlaces);
    };

    let value = 0;
    const frame = data?.[Identifier]; // Pobierz dane tylko dla danego identyfikatora CAN
    if (frame && frame.Data) {
        value = extractValue(frame, startBit, length, factor, decimalPlaces, isSigned);


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