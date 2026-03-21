<template>
  <div class="store-search">
    <nav class="store-nav">
      <NuxtLink to="/" class="back-link">&larr; Home</NuxtLink>
      <button class="theme-toggle" @click="toggleTheme">{{ isDark ? '&#9788;' : '&#9790;' }}</button>
    </nav>

    <header class="store-header">
      <h1 class="store-title store-title--lotus">Lotus's <span>Search</span></h1>
      <form class="search-form" @submit.prevent="doSearch">
        <input v-model="query" type="text" class="search-input" placeholder="Search Lotus's products..." autofocus />
        <button type="submit" class="search-btn search-btn--lotus" :disabled="searching || !query.trim()">
          {{ searching ? '...' : 'Search' }}
        </button>
      </form>
    </header>

    <div v-if="searching" class="status-msg">Searching Lotus's...</div>
    <div v-else-if="searched && products.length === 0" class="status-msg">No products found</div>
    <p v-if="products.length > 0" class="result-count">{{ products.length }} results</p>

    <div class="product-grid">
      <a v-for="p in products" :key="p.id" :href="p.link" target="_blank" rel="noopener" class="product-card">
        <div class="card-img-wrap">
          <img v-if="p.image" :src="p.image" :alt="p.name" class="card-img" loading="lazy" />
          <span v-if="p.discount" class="discount-tag">{{ p.discount }}</span>
        </div>
        <div class="card-body">
          <p class="card-name">{{ p.name }}</p>
          <div class="card-pricing">
            <span class="card-price">{{ formatPrice(p.price) }}</span>
            <span v-if="p.originalPrice > p.price" class="card-original">{{ formatPrice(p.originalPrice) }}</span>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
const { isDark, toggleTheme } = useTheme()

interface Product {
  id: string; name: string; price: number; originalPrice: number
  discount: string; image: string; link: string
}

const query = ref('')
const products = ref<Product[]>([])
const searching = ref(false)
const searched = ref(false)

function formatPrice(n: number): string {
  if (!n) return '-'
  return n.toLocaleString('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 })
}

async function doSearch() {
  if (!query.value.trim()) return
  searching.value = true; searched.value = false
  try {
    const data = await $fetch<any>('/api/makro/lotuss', { method: 'POST', body: { q: query.value, limit: 40 } })
    const items = data?.data?.products || []
    products.value = items.map((item: any) => {
      const pr = item.priceRange?.minimumPrice || {}
      const price = pr.finalPrice?.value || 0
      const original = pr.regularPrice?.value || 0
      const pctOff = pr.discount?.percentOff || 0
      return {
        id: item.id || item.urlKey || '',
        name: item.name || '',
        price,
        originalPrice: original,
        discount: pctOff > 0 ? `-${Math.round(pctOff)}%` : '',
        image: item.thumbnail?.url || '',
        link: item.urlKey ? `https://www.lotuss.com/th/product/${item.urlKey}` : '#',
      }
    }).filter((p: Product) => p.name && p.price > 0)
  } catch { products.value = [] }
  searching.value = false; searched.value = true
}
</script>

<style scoped>
.store-search { max-width: 960px; margin: 0 auto; padding: 1.5rem 1rem; }
.store-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.back-link { color: var(--text-secondary); text-decoration: none; font-size: 0.85rem; }
.back-link:hover { color: var(--text-primary); }
.theme-toggle { background: var(--bg-btn-secondary); border: none; border-radius: 50%; width: 36px; height: 36px; font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-primary); }

.store-header { text-align: center; margin-bottom: 1.5rem; }
.store-title { font-size: 1.5rem; font-weight: 800; margin: 0 0 1rem; }
.store-title--lotus span { color: #dc2626; }
[data-theme="dark"] .store-title--lotus span { color: #f87171; }

.search-form { display: flex; gap: 0.5rem; max-width: 500px; margin: 0 auto; }
.search-input { flex: 1; padding: 0.7rem 1rem; border: 1.5px solid var(--border-input); border-radius: 10px; font-size: 0.9rem; outline: none; background: var(--bg-input); color: var(--text-primary); }
.search-input::placeholder { color: var(--text-muted); }
.search-input:focus { border-color: #dc2626; }
.search-btn { padding: 0.7rem 1.25rem; border: none; border-radius: 10px; font-size: 0.85rem; font-weight: 600; cursor: pointer; color: white; white-space: nowrap; }
.search-btn--lotus { background: #dc2626; }
.search-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.status-msg { text-align: center; padding: 3rem; color: var(--text-muted); }
.result-count { font-size: 0.8rem; color: var(--text-muted); margin: 0 0 0.75rem; }

.product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.75rem; }
@media (max-width: 480px) { .product-grid { grid-template-columns: repeat(2, 1fr); gap: 0.5rem; } }

.product-card { background: var(--bg-card); border: 1px solid var(--border-card-default); border-radius: 12px; overflow: hidden; text-decoration: none; color: inherit; transition: all 0.25s; display: flex; flex-direction: column; }
.product-card:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08); }

.card-img-wrap { position: relative; aspect-ratio: 1; background: #f8f8f8; display: flex; align-items: center; justify-content: center; }
[data-theme="dark"] .card-img-wrap { background: #1a1a2e; }
.card-img { width: 100%; height: 100%; object-fit: contain; padding: 0.75rem; }
.discount-tag { position: absolute; top: 6px; right: 6px; background: #dc2626; color: white; font-size: 0.6rem; font-weight: 700; padding: 0.15rem 0.35rem; border-radius: 4px; }

.card-body { padding: 0.6rem 0.75rem 0.75rem; display: flex; flex-direction: column; gap: 0.15rem; flex: 1; }
.card-name { font-size: 0.78rem; font-weight: 600; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.3; }
.card-pricing { display: flex; align-items: baseline; gap: 0.3rem; margin-top: 0.15rem; }
.card-price { font-size: 0.95rem; font-weight: 700; color: #dc2626; }
[data-theme="dark"] .card-price { color: #f87171; }
.card-original { font-size: 0.65rem; color: var(--text-muted); text-decoration: line-through; }
</style>
