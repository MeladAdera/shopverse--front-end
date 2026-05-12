import type { AxiosAdapter, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { AxiosHeaders } from 'axios';
import { handleDemoRequest } from './demoApiHandler';

export function installDemoApi(...clients: AxiosInstance[]): void {
  const adapter: AxiosAdapter = async (config: InternalAxiosRequestConfig) => {
    const data = await handleDemoRequest(config);
    return {
      data,
      status: 200,
      statusText: 'OK',
      headers: new AxiosHeaders(),
      config,
    };
  };

  for (const client of clients) {
    client.interceptors.request.use((config) => {
      (config as InternalAxiosRequestConfig).adapter = adapter;
      return config;
    });
  }
}
