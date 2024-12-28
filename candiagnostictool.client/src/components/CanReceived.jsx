//[!] Dodac ewentualnie walidację propTypes do komponentów

import './CanReceived.css'


import { useWebSocketContext } from './WebSocketContext'

import CanAnalogValue from './CanAnalogValue';
import CanLed from './CanLed';
import CanSendValue from './CanSendValue';

const CanReceived = () => {

    const { data, sendMessage } = useWebSocketContext();

    const sendCurrentValue = (current) => {
        const currentInBytes = Math.round(current * 100);
        const byte7 = (currentInBytes >> 8) & 0xFF;
        const byte8 = currentInBytes & 0xFF;

        const message = {
            Identifier: 0x3C4, // Identyfikator CAN
            Data: [0, 0, 0, 0, 0, 0, byte7, byte8]
        };

        sendMessage(message); // Wysyłanie przez WebSocketProvider
        console.log(`Sent CAN message with current: ${current} A`);
    };


    return (
        <>
            <div className="receivedValues">
                
            
                    <CanAnalogValue
                        Label="Analog Test 4"
                        Unit="A"
                        Identifier={0x3C5}
                        startByte={2}
                        length={2}
                        factor={10}
                        decimalPlaces={1}
                        maxValue={150}
                    />

                    <CanAnalogValue
                        Label="Analog Test 5"
                        Unit="A"
                        Identifier={0x3C6}
                        startByte={0}
                        length={2}
                        factor={100}
                        decimalPlaces={2}
                        maxValue={150}
                    />

                    <CanAnalogValue
                        Label="Analog Test 6"
                        Unit="A"
                        Identifier={0x3C7}
                        startByte={0}
                        length={2}
                        factor={1000}
                        decimalPlaces={1}
                        maxValue={150}
                    />

                    <CanSendValue
                        label="Nastaw ICH"
                        min={0}
                        max={0.99}
                        interval={1000}
                        onSendValue={sendCurrentValue}
                    />

                    <div className='ledContainer'>

                        <div className='ledHeader'> LOREM IPSUM LEDS</div>

                        <div className={`led-grid`}>
                         
                            <CanLed
                                ledLabel="LED 1"
                                identifier={0x123}
                                byte={0}
                                bitMask={0x01}
                            />

                            <CanLed
                                ledLabel="LED 2"
                                identifier={0x123}
                                byte={0}
                                bitMask={0x02}
                            />

                            <CanLed
                                ledLabel="LED 3"
                                identifier={0x123}
                                byte={0}
                                bitMask={0x04}
                            />

                            <CanLed
                                ledLabel="LED 4"
                                identifier={0x123}
                                byte={0}
                                bitMask={0x08}
                            />
                            <CanLed
                                ledLabel="LED 5"
                                identifier={0x123}
                                byte={0}
                                bitMask={0x10}
                            />

                            <CanLed
                                ledLabel="LED 6"
                                identifier={0x123}
                                byte={0}
                                bitMask={0x20}
                            />

                            <CanLed
                                ledLabel="LED 7"
                                identifier={0x123}
                                byte={0}
                                bitMask={0x40}
                            />

                            <CanLed
                                ledLabel="LED 8"
                                identifier={0x123}
                                byte={0}
                                bitMask={0x80}
                            />

                        </div>
                    </div>

                
            </div>
        </>
    )

};

export default CanReceived