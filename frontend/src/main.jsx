import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { NotificationProvider } from './context/NotificationContext';
import { ErrorProvider } from './context/ErrorContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './assets/styles/main.css';

ReactDOM.createRoot(document.getElementById('root')).render(
 <React.StrictMode>
  <BrowserRouter>
    <ErrorProvider>
      <NotificationProvider>
        <App />
        <ToastContainer position="bottom-right" />
      </NotificationProvider>
    </ErrorProvider>
  </BrowserRouter>
</React.StrictMode>
);