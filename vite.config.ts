import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base: '/world-geography-recall-system-/',
  plugins: [react()],
  server: {
    port: 5173,
    open: false
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1800,
    rollupOptions: {
      output: {
        // Split the heavy 3D stack into its own chunk so future app-code
        // updates don't force users to re-download three.js/globe.gl.
        manualChunks: {
          'vendor-3d': ['three', 'react-globe.gl'],
          'vendor-react': ['react', 'react-dom', 'zustand']
        }
      }
    }
  }
});
