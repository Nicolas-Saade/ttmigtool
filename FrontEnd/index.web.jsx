import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // Make sure this points to your `App.jsx` file

// Find the root div in `index.html`
const rootElement = document.getElementById('root');

// Render the App component
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
} else {
  console.error('Root element not found');
}