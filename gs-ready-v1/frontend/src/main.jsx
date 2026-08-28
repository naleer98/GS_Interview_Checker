import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

import './styles.css';

async function removeOldServiceWorkers() {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const hadController =
      Boolean(navigator.serviceWorker.controller);

    const registrations =
      await navigator.serviceWorker.getRegistrations();

    await Promise.all(
      registrations.map((registration) =>
        registration.unregister()
      )
    );

    if ('caches' in window) {
      const cacheNames = await caches.keys();

      await Promise.all(
        cacheNames.map((cacheName) =>
          caches.delete(cacheName)
        )
      );
    }

    /*
      Old SW current tab-ai control pannittu
      irundha one time reload pannuvom.

      Reload mudinja new page old SW control-la
      irukkaathu.
    */
    if (
      hadController &&
      sessionStorage.getItem(
        'gs_ready_sw_cleanup'
      ) !== 'done'
    ) {
      sessionStorage.setItem(
        'gs_ready_sw_cleanup',
        'done'
      );

      window.location.reload();

      return true;
    }

    return false;

  } catch (error) {
    console.warn(
      'Service worker cleanup failed:',
      error
    );

    return false;
  }
}

async function startApp() {

  const reloading =
    await removeOldServiceWorkers();

  if (reloading) {
    return;
  }

  const rootElement =
    document.getElementById('root');

  if (!rootElement) {
    console.error(
      'Root element not found.'
    );

    return;
  }

  ReactDOM
    .createRoot(rootElement)
    .render(
      <ErrorBoundary>

        <BrowserRouter>

          <AuthProvider>

            <App />

          </AuthProvider>

        </BrowserRouter>

      </ErrorBoundary>
    );
}

startApp();