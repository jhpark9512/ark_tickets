import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port:3000,
    proxy: {// 프록시 설정
      '/api': {
        target: 'http://localhost:5000', // 실제 API 서버 주소
        changeOrigin: true,               // 호스트 헤더 변경
        rewrite: (path) => path.replace(/^\/api/, ''), // 경로 재작성 (선택적)
      },
    },
  }
})
