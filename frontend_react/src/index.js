import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

/**
 * Entry point for Personal Notes Manager.
 * Environment variables (optional): REACT_APP_API_BASE, REACT_APP_BACKEND_URL
 * The app uses in-memory/localStorage via NotesService by default.
 */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
