import React from 'react';
import ReactDOM from 'react-dom/client'; // Ensure this is installed via npm
import AppNavigator from './screens/AppNavigator'; // Your AppNavigator component

// Mount your app to the root element in index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppNavigator />
  </React.StrictMode>
);