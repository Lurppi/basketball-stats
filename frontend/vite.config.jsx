// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './',  // Das Root-Verzeichnis für den Build
  publicDir: 'public', // Der Ordner, in dem sich public assets befinden
  build: {
    outDir: 'dist',  // Der Ordner, in den der Build exportiert wird
    rollupOptions: {
      input: './public/index.html',  // Der Einstiegspunkt ist die index.html im public-Ordner
    },
  },
});
