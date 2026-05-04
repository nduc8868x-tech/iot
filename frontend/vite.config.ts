import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    proxy: {
      // All /api/* requests in development are forwarded to the backend.
      // The frontend never hard-codes localhost:3000 — Vite handles the routing.
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // Uncomment if backend serves /api without the prefix:
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
