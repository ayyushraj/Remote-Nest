import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Define and export Vite configuration
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});
