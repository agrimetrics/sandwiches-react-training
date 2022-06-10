import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@config': resolve(__dirname, './src/appConfig/index.ts'),
      '@components': resolve(__dirname, './src/components'),
      '@services': resolve(__dirname, './src/services/index.ts'),
    },
  },
  define: {
    'process.env': process.env,
  },
})
