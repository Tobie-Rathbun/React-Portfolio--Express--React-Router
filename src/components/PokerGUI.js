import React, { useState, useEffect } from 'react';

const PokerGUI = ({ sliderValue, setSliderValue, blind }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [guiPosition, setGuiPosition] = useState({ x: '50%', y: '50%' });
    const [isMinimized, setIsMinimized] = useState(false);
    const handleMouseDown = (event) => {
        if (!event.target.classList.contains('slider') && !event.target.classList.contains('gui-button')) {
            setIsDragging(true);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (event) => {
        if (isDragging) {
            const x = Math.max(0, Math.min(window.innerWidth - (isMinimized ? 100 : 400), event.clientX));
            const y = Math.max(0, Math.min(window.innerHeight - (isMinimized ? 40 : 200), event.clientY));
            setGuiPosition({ x: `${x}px`, y: `${y}px` });
        }
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleSliderChange = (event) => {
        setSliderValue(parseInt(event.target.value));
    };

    const increaseBet = () => {
        setSliderValue(prevValue => Math.min(prevValue + 100, 1000));
    };

    const decreaseBet = () => {
        setSliderValue(prevValue => Math.max(prevValue - 100, blind));
    };

    const toggleGui = () => {
        setIsMinimized(prevState => !prevState);
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [isDragging]);

    return (
        <div
            className="gui-container purple-gui"
            style={{ left: guiPosition.x, top: guiPosition.y, position: 'absolute', height: isMinimized ? '40px' : '200px', width: isMinimized ? '100px' : '400px' }}
            onMouseDown={handleMouseDown}
        >
            <div className="button-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button className="gui-button" onClick={toggleGui} style={{ marginLeft: 'auto', marginRight: '5px' }}>{isMinimized ? '+' : '-'}</button>
            </div>
            {!isMinimized && (
                <>
                    <div className="slider-container">
                        <input
                            type="range"
                            min={blind}
                            max="1000"
                            value={sliderValue}
                            onChange={handleSliderChange}
                            className="slider"
                            id="myRange"
                        />
                        <p>Value: {sliderValue}</p>
                    </div>
                    <div className="button-container">
                        <button className="gui-button" onClick={() => { /* fold logic */ }}>Fold</button>
                        <button className="gui-button" onClick={() => { /* check logic */ }}>Check</button>
                        <button className="gui-button" onClick={() => { /* call logic */ }}>Call</button>
                        <button className="gui-button" onClick={() => { /* raise logic */ }}>Raise</button>
                        <button className="gui-button" onClick={decreaseBet}>-</button>
                        <button className="gui-button" onClick={increaseBet}>+</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default PokerGUI;
