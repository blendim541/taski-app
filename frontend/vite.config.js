/**
 * Vite config — build tool for the React app.
 * proxy: when the frontend requests /api/..., Vite forwards them to the backend
 * (localhost:3000) so we don't need to put the full URL in the frontend code.
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
