import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app'; // Make sure this path matches your file structure
import './styles.css'; // Ensure this file exists and is correctly located

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);