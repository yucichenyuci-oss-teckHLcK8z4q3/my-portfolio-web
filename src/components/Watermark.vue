<script setup>
import { computed } from 'vue'

// 覆蓋在圖片或內容上的斜向重複浮水印，不影響點擊與滑動
const props = defineProps({
  text: { type: String, required: true },
  opacity: { type: Number, default: 0.22 },
})

const escapeXml = (s) =>
  s.replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[c])

const backgroundImage = computed(() => {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="340" height="190">` +
    `<text x="170" y="95" text-anchor="middle" dominant-baseline="middle" transform="rotate(-22 170 95)" ` +
    `font-family="system-ui, sans-serif" font-size="15" font-weight="600" ` +
    `fill="rgba(255,255,255,${props.opacity})" stroke="rgba(0,0,0,${props.opacity * 0.8})" stroke-width="0.6">` +
    `${escapeXml(props.text)}</text></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
})
</script>

<template>
  <div class="watermark" aria-hidden="true" :style="{ backgroundImage }"></div>
</template>
