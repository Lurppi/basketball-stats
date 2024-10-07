// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './', // Das Root-Verzeichnis für den Build
  build: {
    outDir: 'dist', // Ausgabeordner für den Build
    rollupOptions: {
      input: './public/index.html', // Stellt sicher, dass Vite die index.html aus public verwendet
    },
  },
  publicDir: 'public', // Das Verzeichnis für öffentliche statische Dateien
});
