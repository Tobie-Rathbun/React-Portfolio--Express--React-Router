import React, { useState, useEffect } from 'react';

const DebugPanel = ({ hands, community, deck }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [panelPosition, setPanelPosition] = useState({ x: '25%', y: '25%' });

    const handleMouseDown = (event) => {
        setIsDragging(true);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (event) => {
        if (isDragging) {
            const x = Math.max(0, Math.min(window.innerWidth - 400, event.clientX - 150)); // Adjusted for centering
            const y = Math.max(0, Math.min(window.innerHeight - 200, event.clientY - 100)); // Adjusted for centering
            setPanelPosition({ x: `${x}px`, y: `${y}px` });
        }
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
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
            className="debug-panel"
            style={{ left: panelPosition.x, top: panelPosition.y, position: 'absolute', width: '300px', height: '200px', backgroundColor: 'rgba(0,0,0,0.8)', color: 'white', padding: '10px' }}
            onMouseDown={handleMouseDown}
        >
            <p style={{ fontSize: '12px' }}>
                Player 0 Hand: {hands.p0 && hands.p0.join(', ')}<br />
                Player 1 Hand: {hands.p1 && hands.p1.join(', ')}<br />
                Player 2 Hand: {hands.p2 && hands.p2.join(', ')}<br />
                Player 3 Hand: {hands.p3 && hands.p3.join(', ')}<br />
                Player 4 Hand: {hands.p4 && hands.p4.join(', ')}<br />
                Community Cards: {community.join(', ')}<br />
                Deck: {deck.join(', ')}
            </p>
        </div>
    );
};

export default DebugPanel;
