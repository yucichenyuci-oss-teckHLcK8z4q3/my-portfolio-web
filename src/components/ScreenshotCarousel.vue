<script setup>
import { ref } from 'vue'
import Watermark from './Watermark.vue'

const props = defineProps({
  images: { type: Array, required: true },
  alt: { type: String, default: '' },
  watermark: { type: String, default: '' },
})

const track = ref(null)
const index = ref(0)

function go(i) {
  const n = props.images.length
  const target = (i + n) % n // 頭尾循環
  track.value.scrollTo({ left: target * track.value.clientWidth, behavior: 'smooth' })
}

// 用捲動位置計算目前是第幾張，手指滑動也能同步
function onScroll() {
  const el = track.value
  index.value = Math.round(el.scrollLeft / el.clientWidth)
}

function onKeydown(e) {
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    go(index.value - 1)
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    go(index.value + 1)
  }
}
</script>

<template>
  <div
    class="carousel"
    role="region"
    aria-roledescription="carousel"
    :aria-label="`${alt} 截圖`"
    tabindex="0"
    @keydown="onKeydown"
  >
    <div ref="track" class="carousel-track" @scroll.passive="onScroll">
      <img
        v-for="(src, i) in images"
        :key="i"
        :src="src"
        :alt="`${alt} 畫面 ${i + 1} / ${images.length}`"
        :loading="i === 0 ? 'eager' : 'lazy'"
      />
    </div>

    <Watermark v-if="watermark" :text="watermark" />

    <template v-if="images.length > 1">
      <button type="button" class="carousel-arrow prev" aria-label="上一張" @click="go(index - 1)">‹</button>
      <button type="button" class="carousel-arrow next" aria-label="下一張" @click="go(index + 1)">›</button>
      <span class="carousel-count">{{ index + 1 }} / {{ images.length }}</span>
      <div class="carousel-dots">
        <button
          v-for="(_, i) in images"
          :key="i"
          type="button"
          :class="{ active: i === index }"
          :aria-label="`第 ${i + 1} 張`"
          :aria-current="i === index"
          @click="go(i)"
        ></button>
      </div>
    </template>
  </div>
</template>
