import React, { useState, useEffect } from 'react';
import '../styles.css';

const PokerGUI = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [guiPosition, setGuiPosition] = useState({ x: '50%', y: '50%' });
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
      setGuiPosition({ x: `${x}px`, y: `${y}px` });
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
      className="gui-container purple-gui"
      style={{ left: guiPosition.x, top: guiPosition.y, position: 'absolute' }}
      onMouseDown={handleMouseDown}
    >
      {/* GUI Content */}
    </div>
  );
};

export default PokerGUI;
