//[!] Dodac ewentualnie walidację propTypes do komponentów

import './CanReceived.css'


import { useWebSocketContext } from './WebSocketContext'

import CanAnalogValue from './CanAnalogValue';
import CanLed from './CanLed';
import CanErrorLed from './CanErrorLed';

const CanReceived = () => {

    const { data, sendMessage } = useWebSocketContext();

    const sendCurrentValue = (current) => {
        const currentInBytes = Math.round(current * 100);
        const byte7 = (currentInBytes >> 8) & 0xFF;
        const byte8 = currentInBytes & 0xFF;

        const message = {
            Identifier: 0x3C4, // Identyfikator CAN
            Data: [0, 0, 0, 0, 0, 0, byte7, byte8],
        };

        try {
            if (typeof sendMessage !== 'function') {
                throw new Error("sendMessage is not a function. Check WebSocketContext setup.");
            }

            sendMessage(message); // Wysyłanie przez WebSocketProvider
            console.log(`Sent CAN message with current: ${current} A`);
        }
        catch (error) {
            console.error("Failed to send CAN message:", error);
            alert(`Błąd wysyłania wiadomości CAN: ${error.message}`);
        }
        
        
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

                        <CanErrorLed
                            label="HVAC"
                            identifier={0x124}
                            byte={0}
                            bitMask={0x03}
                        />

                        </div>
                    </div>

                
            </div>
        </>
    )

};

export default CanReceived