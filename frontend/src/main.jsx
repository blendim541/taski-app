/**
 * ENTRY POINT — This is where the React app starts.
 * We render the whole app inside the <div id="root"> in index.html.
 * BrowserRouter enables client-side routing (changing the page without reloading).
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
