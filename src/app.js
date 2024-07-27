import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SiteNavbar from './components/SiteNavbar';
import Home from './components/Home';
import Jazzbot from './components/Jazzbot';
import About from './components/About';
import GitHub from './components/GitHub';
import Login from './components/Login';
import PokerFrogs from './components/PokerFrogs';

import './styles.css';  // Corrected path

const App = () => {
  return (
    <Router>
      <SiteNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jazzbot" element={<Jazzbot />} />
        <Route path="/about" element={<About />} />
        <Route path="/github" element={<GitHub />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pokerfrogs" element={<PokerFrogs />} />
      </Routes>
    </Router>
  );
};

export default App;
