import { defineConfig } from 'vite'
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  ublicDir: 'public',
  server: {
    port: 8080
  },
  resolve: {
    extensions: ['.js', '.json', '.vue'],
    alias: {
      '@': resolve(__dirname, 'src')
    },
  },
  plugins: [vue()],
})
