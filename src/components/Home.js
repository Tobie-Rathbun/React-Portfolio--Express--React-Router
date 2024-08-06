import React from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';  // Adjusted path for all components

const Home = () => {
  return (
    <div className="home-page">
      <h1>Howdy</h1>
      <p><Link to="/about">About page</Link> contains my qualifications and skillsets</p>
      <p><Link to="/jazzbot">Chord Player</Link> showcases file loading and JavaScript logic as well as GUI</p>
      <p><Link to="/pokerfrogs">Poker Frogs</Link> showcases file loading, polished and interactive GUI, as well as 3D rendering and manual tool design</p>
    </div>
  );
};

export default Home;

