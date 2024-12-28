//[!] Dodac ewentualnie walidację propTypes do komponentów

import './CanReceived.css'

import { WebSocketProvider } from './WebSocketContext';

import CanAnalogValue from './CanAnalogValue';
import CanLed from './CanLed';

const CanReceived = () => {



    return (
        <>
            <div className="receivedValues">
                <WebSocketProvider url="wss://localhost:7199/ws/can">

             
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

                    <CanLed
                        ledLabel="LED 1"
                        identifier={0x123}
                        byte={0}
                        bitMask={0x01}
                    />

                    <CanLed
                        ledLabel="LED 1"
                        identifier={0x123}
                        byte={0}
                        bitMask={0x02}
                    />

                    <CanLed
                        ledLabel="LED 1"
                        identifier={0x123}
                        byte={0}
                        bitMask={0x04}
                    />

                    <CanLed
                        ledLabel="LED 1"
                        identifier={0x123}
                        byte={0}
                        bitMask={0x08}
                    />

                </WebSocketProvider>
            </div>
        </>
    )

};

export default CanReceived