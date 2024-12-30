import './CanErrorLed.css'

import { useState, useEffect, useRef } from 'react';
import { useWebSocketContext } from './WebSocketContext';

const CanErrorLed = ({ label , identifier, byte, bitMask }) => {

    const { data } = useWebSocketContext();

    const [ledState, setLedState] = useState('default');

    const analyzeErrorLed = (frame, byte, bitMask) => {

        let value = frame.Data[byte];

        switch (bitMask) {
            case 0x0C:
                value = value >> 2;
                break;
            case 0x30:
                value = value >> 4;
                break;
            case 0xC0:
                value = value >> 6;
                break;
            case 0x03:
                // Bez przesunięcia, najmłodsze bity są już prawidłowe
                break;

            default:
                console.warn(`Unexpected mask value: ${bit_mask}`);
        }

        value &= 0x03;

        switch (value) {
            case 1:
                return 'error';
            case 2:
                return 'warning';
            case 3:
                return 'info';
            default:
                return 'default';
        }

    };

    useEffect(() => {
        const frame = data[identifier];
        if (frame && frame.Data) {
            const ledErrorState = analyzeErrorLed(frame, byte, bitMask);
            setLedState(ledErrorState);
        }
        else {
            setLedState('undefined');
        }

    }, [data, identifier, byte, bitMask])

    return (

        <div className="led-container">

            <div className={`led ${ledState}`}></div>
            <div className="label">{label}</div>
                
        </div>

    )

}

export default CanErrorLed;