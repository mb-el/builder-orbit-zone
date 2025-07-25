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

// Global root instance to prevent multiple createRoot calls
declare global {
  var __react_root__: ReturnType<typeof createRoot> | undefined;
}

// Function to get or create the root
const getRoot = () => {
  if (!window.__react_root__) {
    window.__react_root__ = createRoot(container);
  }
  return window.__react_root__;
};

// Function to render the app safely
const renderApp = () => {
  try {
    const root = getRoot();
    root.render(<App />);
  } catch (error) {
    console.error('Error rendering app:', error);
    // Fallback: clear the container and create a new root
    container.innerHTML = '';
    window.__react_root__ = undefined;
    const newRoot = getRoot();
    newRoot.render(<App />);
  }
};

// Initial render
renderApp();

// Hot module replacement support
if (import.meta.hot) {
  import.meta.hot.accept(['./App'], () => {
    renderApp();
  });

  // Clean up on module disposal
  import.meta.hot.dispose(() => {
    if (window.__react_root__) {
      try {
        window.__react_root__.unmount();
      } catch (error) {
        console.warn('Error unmounting root:', error);
      }
      window.__react_root__ = undefined;
    }
  });
}
