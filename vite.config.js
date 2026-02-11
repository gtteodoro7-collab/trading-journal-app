import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react( )],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    open: true // Isso vai abrir seu navegador automaticamente!
  }
  ,
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('recharts')) return 'vendor_recharts';
            if (id.includes('d3') || id.includes('victory')) return 'vendor_charts';
            if (id.includes('date-fns')) return 'vendor_datefns';
            return 'vendor';
          }
        }
      }
    }
  }
})
