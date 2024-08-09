import React, { useState, useEffect } from 'react';

const DebugPanel = ({ hands, community, deck }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [panelPosition, setPanelPosition] = useState({ x: '25%', y: '25%' });
    const [initialMousePosition, setInitialMousePosition] = useState({ x: 0, y: 0 });
    const [initialPanelPosition, setInitialPanelPosition] = useState({ x: 0, y: 0 });

    const handleMouseDown = (event) => {
        setIsDragging(true);
        setInitialMousePosition({ x: event.clientX, y: event.clientY });

        // Convert percentage values to pixel values if necessary
        const xValue = panelPosition.x.includes('%')
            ? (parseFloat(panelPosition.x) / 100) * window.innerWidth
            : parseFloat(panelPosition.x);

        const yValue = panelPosition.y.includes('%')
            ? (parseFloat(panelPosition.y) / 100) * window.innerHeight
            : parseFloat(panelPosition.y);

        setInitialPanelPosition({ x: xValue, y: yValue });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (event) => {
        if (isDragging) {
            const deltaX = event.clientX - initialMousePosition.x;
            const deltaY = event.clientY - initialMousePosition.y;
            const newX = Math.max(0, Math.min(window.innerWidth - 400, initialPanelPosition.x + deltaX)); // Adjusted for centering
            const newY = Math.max(0, Math.min(window.innerHeight - 200, initialPanelPosition.y + deltaY)); // Adjusted for centering
            setPanelPosition({ x: `${newX}px`, y: `${newY}px` });
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
    }, [isDragging, initialMousePosition, initialPanelPosition]);

    return (
        <div
            className="debug-panel"
            style={{ left: panelPosition.x, top: panelPosition.y, position: 'absolute', width: '300px', height: '200px', backgroundColor: 'rgba(0,0,0,0.8)', color: 'white', padding: '10px' }}
            onMouseDown={handleMouseDown}
        >
            <p style={{ fontSize: '12px' }}>
            Player 0 Hand: {hands[0] && hands[0].join(', ')}<br />
            Player 1 Hand: {hands[1] && hands[1].join(', ')}<br />
            Player 2 Hand: {hands[2] && hands[2].join(', ')}<br />
            Player 3 Hand: {hands[3] && hands[3].join(', ')}<br />
            Player 4 Hand: {hands[4] && hands[4].join(', ')}<br />
                Community Cards: {community.join(', ')}<br />
                Deck: {deck.join(', ')}
            </p>
        </div>
    );
};

export default DebugPanel;
