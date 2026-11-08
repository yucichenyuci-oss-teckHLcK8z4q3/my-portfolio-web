<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import ScreenshotCarousel from './components/ScreenshotCarousel.vue'

const base = import.meta.env.BASE_URL
const projects = ref([])
const loading = ref(true)
const error = ref('')
const hash = ref(location.hash)

const asset = (p) => (p ? base + p : '')

// 從所有公開作品的 technologies 彙整，依出現次數排序（次數相同時依首次出現順序）
const allTechnologies = computed(() => {
  const count = new Map()
  for (const p of projects.value) {
    for (const t of p.technologies) count.set(t, (count.get(t) ?? 0) + 1)
  }
  return [...count.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t)
})

const current = computed(() => {
  const m = hash.value.match(/^#\/p\/([a-z0-9-]+)$/)
  return m ? (projects.value.find((p) => p.slug === m[1]) ?? null) : null
})

// readmeHtml 已在同步時清理過，這裡只補上網站的基底路徑
const readme = computed(() =>
  current.value ? current.value.readmeHtml.replaceAll('src="portfolio/', `src="${base}portfolio/`) : '',
)

function onHashChange() {
  hash.value = location.hash
  window.scrollTo(0, 0)
}

onMounted(async () => {
  window.addEventListener('hashchange', onHashChange)
  try {
    const res = await fetch(`${base}portfolio/projects.json`, { cache: 'no-cache' })
    if (!res.ok) throw new Error(res.statusText)
    projects.value = (await res.json()).projects
  } catch {
    error.value = '暫時無法讀取作品資料'
  } finally {
    loading.value = false
  }
})
onBeforeUnmount(() => window.removeEventListener('hashchange', onHashChange))
</script>

<template>
  <main class="page">
    <header class="site-header">
      <a href="#/" class="brand">作品集</a>
      <p v-if="allTechnologies.length" class="tagline">{{ allTechnologies.join(' · ') }}</p>
    </header>

    <p v-if="loading" class="status">載入作品中…</p>
    <p v-else-if="error" class="status">{{ error }}</p>

    <article v-else-if="current" class="detail">
      <a href="#/" class="back">← 返回作品列表</a>
      <h1>{{ current.title }}</h1>
      <p v-if="current.summary" class="summary">{{ current.summary }}</p>
      <ul class="tags">
        <li v-for="t in current.technologies" :key="t">{{ t }}</li>
      </ul>

      <ScreenshotCarousel
        v-if="current.screenshots.length"
        :key="current.slug"
        :images="current.screenshots.map(asset)"
        :alt="current.title"
      />

      <div class="readme" v-html="readme"></div>
    </article>

    <template v-else>
      <p v-if="!projects.length" class="status">目前沒有公開的作品。</p>
      <section class="grid">
        <a v-for="p in projects" :key="p.slug" :href="`#/p/${p.slug}`" class="card">
          <img v-if="p.cover" :src="asset(p.cover)" :alt="p.title + ' 預覽'" loading="lazy" />
          <div class="card-body">
            <h2>{{ p.title }}</h2>
            <p>{{ p.summary }}</p>
            <ul class="tags">
              <li v-for="t in p.technologies" :key="t">{{ t }}</li>
            </ul>
          </div>
        </a>
      </section>
    </template>
  </main>
</template>
