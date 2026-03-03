import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 相对路径便于 Capacitor 在 iOS/Android 壳内正确加载资源
  base: './',
})
