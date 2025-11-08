import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],

  // This config to redirect /socket.io/ to the 8080 server is from https://stackoverflow.com/a/76336913
  server: {
    host: 'localhost',
    proxy: {
      '/socket.io/': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    }
  }
})
