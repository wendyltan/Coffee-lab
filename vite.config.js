import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 相对路径便于 Capacitor 在 iOS/Android 壳内正确加载资源
  base: './',
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/xlsx')) return 'vendor-xlsx'
          if (id.includes('node_modules/@capacitor')) return 'vendor-capacitor'
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react'
          }
        },
      },
    },
  },
})
