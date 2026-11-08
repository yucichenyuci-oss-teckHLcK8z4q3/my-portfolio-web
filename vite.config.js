import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // 必須與 GitHub repo 名稱相同
  base: '/my-portfolio-web/',
})
