import React from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';  // Adjusted path for all components

const SiteNavbar = () => {
  return (
    <nav className="site-navbar">
      <Link to="/" className="navbar-brand">Tobie Rathbun</Link>
      <div>
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/about" className="nav-link">About</Link>
        <a href="https://github.com/Tobie-Rathbun" className="nav-link">GitHub</a>
        <Link to="/pokerfrogs" className="nav-link">Poker Frogs</Link>
        <Link to="/jazzbot" className="nav-link">Chord Machine</Link>
        <Link to="/login" className="nav-link">Login</Link>
      </div>
    </nav>
  );
};

export default SiteNavbar;
