import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api': {
            target: 'http://localhost:8000',
            changeOrigin: true,
            secure: false,
            rewrite: (path) => path.replace(/^\/api/, '')
          },
          '/uploads': {
            target: 'http://localhost:8000',
            changeOrigin: true,
            secure: false,
            rewrite: (path) => path.replace(/^\/uploads/, '/uploads')
          }
        }
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        // Generate source maps for production debugging
        sourcemap: false,
        // Increase chunk warning threshold
        chunkSizeWarningLimit: 500,
        rollupOptions: {
          output: {
            // Split vendor code into cacheable chunks
            manualChunks(id) {
              if (id.includes('node_modules/recharts') || id.includes('node_modules/d3')) {
                return 'vendor-charts';
              }
              if (id.includes('node_modules/react-router') || id.includes('node_modules/@remix-run')) {
                return 'vendor-router';
              }
            }
          }
        },
        // Optimize CSS
        cssCodeSplit: true,
      }
    };
});
