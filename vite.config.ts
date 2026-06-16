import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 프론트엔드(/todos...) 요청을 백엔드(localhost:5000)로 전달해 CORS 문제를 회피합니다.
      '/todos': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
