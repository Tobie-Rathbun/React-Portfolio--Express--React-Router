import React from 'react';
import ChordPlayer from '../components/ChordPlayer';
import '../styles.css';  // Adjusted path for all components

const Jazzbot = () => {
  return (
    <div className="-page">
      <h1>Play Any Piano Chords!</h1>
      <ChordPlayer />
    </div>
  );
};

export default Jazzbot;
