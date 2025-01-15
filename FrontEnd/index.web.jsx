import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // Ensure this points to your main App component

const rootElement = document.getElementById('root');
if (rootElement) {
  console.log('Root element found');
  const root = createRoot(rootElement); // React 18 way to create a root
  root.render(<App />);
} else {
  console.error('Root element not found');
}