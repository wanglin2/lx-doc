import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/sheet/',
  plugins: [vue()],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, './src') }]
  },
  server: {
    host: '0.0.0.0',
    port: 9094
  },
  build: {
    rollupOptions: {
    
    }
  }
})
