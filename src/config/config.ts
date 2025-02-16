// src/config/config.ts
const isDev = import.meta.env.DEV;

// Log environment state when config is loaded
console.log('Environment:', {
  isDev,
  mode: import.meta.env.MODE,
  baseUrl: import.meta.env.BASE_URL,
});

export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080',
  apiTimeout: 300000,
  isDevelopment: isDev
} as const;

// Type check that all environment variables are present
if (isDev) {
  const missingVars = [];
  if (!import.meta.env.VITE_API_URL) missingVars.push('VITE_API_URL');
  if (!import.meta.env.VITE_API_TIMEOUT) missingVars.push('VITE_API_TIMEOUT');
  
  if (missingVars.length > 0) {
    console.warn('Missing environment variables:', missingVars.join(', '));
    console.warn('Make sure you have a .env file with the required variables.');
  }
}