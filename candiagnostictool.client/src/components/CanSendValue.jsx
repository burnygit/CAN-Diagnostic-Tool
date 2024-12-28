import { useState, useEffect, useRef } from 'react';
import './CanSendValue.css';

const CanSendValue = ({ label, min, max, step, interval = 250, onSendValue }) => {
    const [currentValue, setCurrentValue] = useState(min);
    const [isClicked, setIsClicked] = useState(false);
    const [intervalId, setIntervalId] = useState(null);

    const currentValueRef = useRef(currentValue);

    useEffect(() => {
        currentValueRef.current = currentValue;
    }, [currentValue]);

    const handleValueChange = (e) => {
        const newValue = parseFloat(e.target.value);
        setCurrentValue(newValue);
    };

    const handleButtonClick = () => {
        const clicked = !isClicked;
        setIsClicked(clicked);

        if (clicked) {
            // Rozpocznij cykliczne wysyłanie danych
            const id = setInterval(() => {
                onSendValue(currentValueRef.current); // Używa funkcji przekazanej jako props
            }, interval);
            setIntervalId(id);
        } else {
            // Zatrzymaj wysyłanie
            if (intervalId) {
                clearInterval(intervalId);
                setIntervalId(null);
            }
        }
    };

    return (
        <div className="setValueContainer">
            <div className={`setValueHeader ${isClicked ? 'setValueButtonClicked' : ''}`}>
                {label}
            </div>
            <div className="setValueValue">
                <input
                    className="valueInput"
                    type="number"
                    step={step || "0.01"}
                    value={currentValue}
                    min={min}
                    max={max}
                    onChange={handleValueChange}
                />
            </div>
            <div className={`setValueFooter`}>
                <button className='setValueButton' onClick={handleButtonClick}>
                    {isClicked ? (<a style={{ color: '#870714' }}>STOP</a>) : "WYSYŁAJ"}
                </button>
            </div>
        </div>
    );
};

export default CanSendValue;