import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';
import { MoviesProvider } from './state/moviesContext';
import { ToastProvider } from './state/toastContext';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <MoviesProvider>
          <App />
        </MoviesProvider>
      </ToastProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
