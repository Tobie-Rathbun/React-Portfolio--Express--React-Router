import React, { useState, useEffect } from 'react';
import '../styles.css';

const DebugPanel = ({ hands, community, deck }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [panelPosition, setPanelPosition] = useState({ x: '50%', y: '50%' });
  const [startDragOffset, setStartDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (event) => {
    setIsDragging(true);
    setStartDragOffset({
      x: event.clientX - event.currentTarget.getBoundingClientRect().left,
      y: event.clientY - event.currentTarget.getBoundingClientRect().top,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (event) => {
    if (isDragging) {
      const x = event.clientX - startDragOffset.x;
      const y = event.clientY - startDragOffset.y;
      setPanelPosition({ x: `${x}px`, y: `${y}px` });
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      className="card-display"
      style={{ left: panelPosition.x, top: panelPosition.y, position: 'absolute' }}
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
