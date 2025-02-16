import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Get the actual Windows IP from your /etc/resolv.conf
const WINDOWS_HOST = '10.255.255.254'; // Replace this with your actual Windows IP

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: `http://${WINDOWS_HOST}:8080`,
        changeOrigin: true,
        rewrite: (path) => {
          const newPath = path.replace(/^\/api/, '');
          console.log(`Rewriting path from ${path} to ${newPath}`);
          return newPath;
        },
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request:', {
              method: req.method,
              originalUrl: req.url,
              targetUrl: proxyReq.path,
              fullUrl: `${WINDOWS_HOST}:8080${proxyReq.path}`
            });
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response:', {
              status: proxyRes.statusCode,
              originalUrl: req.url
            });
          });
        },
      }
    }
  }
});