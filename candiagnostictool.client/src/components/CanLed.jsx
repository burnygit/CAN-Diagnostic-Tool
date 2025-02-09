import './CanLed.css';

import { useState, useEffect } from 'react';

import { useWebSocketContext } from './WebSocketContext';

const CanLed = ({ledLabel, identifier, byte, bitMask }) => {

    const [color, setColor] = useState("led-on");

    const { data } = useWebSocketContext();

    useEffect(() => {
        const frame = data[identifier];
        if (frame && frame.Data) {
            const ledState = analyzeLed(frame, byte, bitMask);
            setColor(ledState ? 'led-on' : 'led-off');
        }
        else { setColor('undefined') };

    }, [data, identifier, byte, bitMask]);

    const analyzeLed = (frame, byte, bit_mask) => {

        const value = frame.Data[byte];
        const ledState = (value & bit_mask) !== 0;
        return ledState;
    };

    return (
        <div className={`led-container`}>

            <div className={`led  ${color} `}> </div>
            <div className="label"> {ledLabel} </div>

        </div>
    )
}

export default CanLed;