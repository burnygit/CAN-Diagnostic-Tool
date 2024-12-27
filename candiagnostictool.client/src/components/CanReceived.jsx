import { WebSocketProvider } from './WebSocketContext';

import CanAnalogValue from './CanAnalogValue';

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
                </WebSocketProvider>
            </div>
        </>
    )

};

export default CanReceived