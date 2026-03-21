<template>
  <div class="store-search">
    <nav class="store-nav">
      <NuxtLink to="/" class="back-link">&larr; Home</NuxtLink>
      <button class="theme-toggle" @click="toggleTheme">{{ isDark ? '&#9788;' : '&#9790;' }}</button>
    </nav>

    <header class="store-header">
      <h1 class="store-title store-title--tops">Tops <span>Search</span></h1>
      <p v-if="buildIdStatus" class="build-status" :class="buildIdStatus">{{ buildIdMsg }}</p>
      <form class="search-form" @submit.prevent="doSearch">
        <input v-model="query" type="text" class="search-input" placeholder="Search Tops products..." autofocus />
        <button type="submit" class="search-btn search-btn--tops" :disabled="searching || !query.trim() || !buildId">
          {{ searching ? '...' : 'Search' }}
        </button>
      </form>
    </header>

    <div v-if="searching" class="status-msg">Searching Tops...</div>
    <div v-else-if="searched && products.length === 0" class="status-msg">No products found</div>
    <div v-if="error" class="status-msg error-msg">{{ error }}</div>
    <p v-if="products.length > 0" class="result-count">{{ totalProducts }} products found (showing {{ products.length }})</p>

    <div class="product-grid">
      <a v-for="p in products" :key="p.sku" :href="p.link" target="_blank" rel="noopener" class="product-card">
        <div class="card-img-wrap">
          <img v-if="p.image" :src="p.image" :alt="p.name" class="card-img" loading="lazy" />
          <span v-if="p.priceSaved > 0" class="discount-tag">Save {{ formatPrice(p.priceSaved) }}</span>
          <span v-if="!p.inStock" class="out-of-stock">Out of Stock</span>
        </div>
        <div class="card-body">
          <p class="card-name">{{ p.name }}</p>
          <p v-if="p.brand" class="card-brand">{{ p.brand }}</p>
          <div class="card-pricing">
            <span class="card-price">{{ formatPrice(p.price) }}</span>
            <span v-if="p.originalPrice > p.price" class="card-original">{{ formatPrice(p.originalPrice) }}</span>
          </div>
          <p v-if="p.unitName" class="card-unit">{{ p.unitName }}</p>
          <p v-if="p.category" class="card-category">{{ p.category }}</p>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
const { isDark, toggleTheme } = useTheme()

interface Product {
  sku: string; name: string; brand: string
  price: number; originalPrice: number; priceSaved: number
  image: string; link: string; unitName: string
  inStock: boolean; category: string
}

const query = ref('')
const products = ref<Product[]>([])
const totalProducts = ref(0)
const searching = ref(false)
const searched = ref(false)
const error = ref('')
const buildId = ref('')
const buildIdStatus = ref<string>('')
const buildIdMsg = ref('')

function formatPrice(n: number): string {
  if (!n) return '-'
  return n.toLocaleString('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 })
}

async function fetchBuildId() {
  buildIdStatus.value = 'loading'
  buildIdMsg.value = 'Fetching Tops build ID...'
  try {
    // Fetch the Tops homepage from the browser (passes Cloudflare)
    const html = await fetch('https://www.tops.co.th/en', {
      credentials: 'omit',
    }).then(r => r.text())

    // Extract buildId from __NEXT_DATA__
    const match = html.match(/"buildId"\s*:\s*"([^"]+)"/)
    if (match) {
      buildId.value = match[1]
      buildIdStatus.value = 'ok'
      buildIdMsg.value = `Build ID: ${buildId.value.slice(0, 8)}...`
    } else {
      buildIdStatus.value = 'error'
      buildIdMsg.value = 'Could not find build ID — Cloudflare may be blocking'
    }
  } catch (e: any) {
    buildIdStatus.value = 'error'
    buildIdMsg.value = `Failed to reach tops.co.th: ${e.message || 'CORS or network error'}`
  }
}

async function doSearch() {
  if (!query.value.trim() || !buildId.value) return
  searching.value = true
  searched.value = false
  error.value = ''

  try {
    const keyword = encodeURIComponent(query.value.trim())
    const url = `https://www.tops.co.th/_next/data/${buildId.value}/en/search/${keyword}.json`

    const response = await fetch(url, { credentials: 'omit' })

    if (!response.ok) {
      if (response.status === 404) {
        // buildId expired, try to refresh
        error.value = 'Build ID expired, refreshing...'
        await fetchBuildId()
        if (buildId.value) {
          searching.value = false
          return doSearch()
        }
      }
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()
    const pageProps = data?.pageProps || {}
    const productList = pageProps?.initialData?.products || pageProps?.products || []
    totalProducts.value = pageProps?.initialData?.totalProducts || pageProps?.totalProducts || productList.length

    products.value = productList.map((item: any) => ({
      sku: item.sku || '',
      name: item.name || '',
      brand: item.brand || '',
      price: item.price || 0,
      originalPrice: item.originalPrice || 0,
      priceSaved: item.priceSaved || 0,
      image: item.pimImage ? `https://www.tops.co.th${item.pimImage}` : '',
      link: item.slug ? `https://www.tops.co.th/en/${item.slug}` : '#',
      unitName: item.unitName || '',
      inStock: item.stockAvail !== 0,
      category: item.categoryLevel1 || '',
    })).filter((p: Product) => p.name)
  } catch (e: any) {
    if (!error.value) error.value = `Search failed: ${e.message}`
    products.value = []
  }

  searching.value = false
  searched.value = true
}

onMounted(() => {
  fetchBuildId()
})
</script>

<style scoped>
.store-search { max-width: 960px; margin: 0 auto; padding: 1.5rem 1rem; }
.store-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.back-link { color: var(--text-secondary); text-decoration: none; font-size: 0.85rem; }
.back-link:hover { color: var(--text-primary); }
.theme-toggle { background: var(--bg-btn-secondary); border: none; border-radius: 50%; width: 36px; height: 36px; font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-primary); }

.store-header { text-align: center; margin-bottom: 1.5rem; }
.store-title { font-size: 1.5rem; font-weight: 800; margin: 0 0 0.5rem; }
.store-title--tops span { color: #e3192c; }
[data-theme="dark"] .store-title--tops span { color: #f87171; }

.build-status { font-size: 0.7rem; margin: 0 0 0.75rem; }
.build-status.loading { color: var(--text-muted); }
.build-status.ok { color: #16a34a; }
.build-status.error { color: #dc2626; }

.search-form { display: flex; gap: 0.5rem; max-width: 500px; margin: 0 auto; }
.search-input { flex: 1; padding: 0.7rem 1rem; border: 1.5px solid var(--border-input); border-radius: 10px; font-size: 0.9rem; outline: none; background: var(--bg-input); color: var(--text-primary); }
.search-input::placeholder { color: var(--text-muted); }
.search-input:focus { border-color: #e3192c; }
.search-btn { padding: 0.7rem 1.25rem; border: none; border-radius: 10px; font-size: 0.85rem; font-weight: 600; cursor: pointer; color: white; white-space: nowrap; }
.search-btn--tops { background: #e3192c; }
.search-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.status-msg { text-align: center; padding: 2rem; color: var(--text-muted); font-size: 0.9rem; }
.error-msg { color: #dc2626; }
.result-count { font-size: 0.8rem; color: var(--text-muted); margin: 0 0 0.75rem; }

.product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.75rem; }
@media (max-width: 480px) { .product-grid { grid-template-columns: repeat(2, 1fr); gap: 0.5rem; } }

.product-card { background: var(--bg-card); border: 1px solid var(--border-card-default); border-radius: 12px; overflow: hidden; text-decoration: none; color: inherit; transition: all 0.25s; display: flex; flex-direction: column; }
.product-card:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08); }

.card-img-wrap { position: relative; aspect-ratio: 1; background: #f8f8f8; display: flex; align-items: center; justify-content: center; }
[data-theme="dark"] .card-img-wrap { background: #1a1a2e; }
.card-img { width: 100%; height: 100%; object-fit: contain; padding: 0.75rem; }
.discount-tag { position: absolute; top: 6px; right: 6px; background: #e3192c; color: white; font-size: 0.6rem; font-weight: 700; padding: 0.15rem 0.35rem; border-radius: 4px; }
.out-of-stock { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); color: white; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; }

.card-body { padding: 0.6rem 0.75rem 0.75rem; display: flex; flex-direction: column; gap: 0.15rem; flex: 1; }
.card-name { font-size: 0.78rem; font-weight: 600; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.3; }
.card-brand { font-size: 0.65rem; color: var(--text-secondary); margin: 0; }
.card-pricing { display: flex; align-items: baseline; gap: 0.3rem; margin-top: 0.15rem; }
.card-price { font-size: 0.95rem; font-weight: 700; color: #e3192c; }
[data-theme="dark"] .card-price { color: #f87171; }
.card-original { font-size: 0.65rem; color: var(--text-muted); text-decoration: line-through; }
.card-unit { font-size: 0.6rem; color: var(--text-secondary); margin: 0; }
.card-category { font-size: 0.6rem; color: var(--text-muted); margin: 0; margin-top: auto; background: var(--bg-btn-secondary); padding: 0.1rem 0.3rem; border-radius: 3px; align-self: flex-start; }
</style>
