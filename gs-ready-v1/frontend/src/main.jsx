import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

import './styles.css';

/*
  Old GS Ready service workers remove.
  This prevents stale Vercel builds / cached app versions.
*/
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registrations =
        await navigator.serviceWorker.getRegistrations();

      for (const registration of registrations) {
        await registration.unregister();
      }

      if ('caches' in window) {
        const keys = await caches.keys();

        await Promise.all(
          keys
            .filter((key) => key.startsWith('gs-ready'))
            .map((key) => caches.delete(key))
        );
      }
    } catch (error) {
      console.warn('Service worker cleanup failed:', error);
    }
  });
}

ReactDOM.createRoot(
  document.getElementById('root')
).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);