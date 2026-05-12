// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter } from 'react-router-dom'; // أضف هذا
import App from './App';
import { queryClient } from './lib/query-client';
import './index.css';
import { isDemoDataEnabled } from './mocks/demoFlag';
import { installDemoApi } from './mocks/installDemoApi';
import api from './lib/axios';
import { api as apiClient } from './lib/api-client';

if (isDemoDataEnabled()) {
  installDemoApi(api, apiClient);
  console.info('[Shopverse] Demo API enabled — set VITE_USE_DEMO_DATA=false to use your real backend.');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter> {/* أضف هذا السطر */}
        <App />
      </BrowserRouter> {/* أضف هذا السطر */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);