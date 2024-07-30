// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './app';
// import './styles.css';

// ReactDOM.render(<App />, document.getElementById('root'));

// React 17 ^
// React 18 v

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App />);
