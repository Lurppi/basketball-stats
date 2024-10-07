import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './',  // Stellt sicher, dass das Root-Verzeichnis korrekt ist
  publicDir: 'public', // Das Verzeichnis, in dem sich public-assets befinden
  build: {
    outDir: 'dist',  // Der Ordner, in den der Build exportiert wird
    rollupOptions: {
      input: './public/index.html',  // Stellt sicher, dass Vite die index.html aus public verwendet
    },
  },
});
