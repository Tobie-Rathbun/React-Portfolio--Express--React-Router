import React from 'react';
import ChordPlayer from '../components/ChordPlayer';
import '../styles.css';  // Adjusted path for all components

const Jazzbot = () => {
  return (
    <div className="jazzbot-page">
      <h1>Jazzbot</h1>
      <ChordPlayer />
    </div>
  );
};

export default Jazzbot;
