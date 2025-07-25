import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './global.css';
import './lib/i18n';

// Get the root element
const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

// Create root only once and store it
let root: ReturnType<typeof createRoot>;

// Function to render the app
const renderApp = () => {
  if (!root) {
    root = createRoot(container);
  }
  root.render(<App />);
};

// Initial render
renderApp();

// Hot module replacement support
if (import.meta.hot) {
  import.meta.hot.accept(['./App'], () => {
    renderApp();
  });
}
