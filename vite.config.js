import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// GitHub Pages 無法設定 HTTP 標頭，所以用 <meta> 加上 CSP。
// 只允許載入本站的程式、樣式、圖片與資料；README 內容即使含有惡意程式也不會被執行。
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join('; ')

// 只在正式建置時加入（開發模式的熱更新需要 inline script，加了會壞）
const securityMeta = () => ({
  name: 'security-meta',
  apply: 'build',
  transformIndexHtml: () => [
    { tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP }, injectTo: 'head' },
  ],
})

export default defineConfig({
  plugins: [vue(), securityMeta()],
  // 必須與 GitHub repo 名稱相同
  base: '/my-portfolio-web/',
})
