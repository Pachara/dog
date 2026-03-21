<template>
  <div class="compare">
    <nav class="compare-nav">
      <NuxtLink to="/" class="back-link">&larr; Home</NuxtLink>
      <button class="theme-toggle" @click="toggleTheme" :title="isDark ? 'Light' : 'Dark'">
        {{ isDark ? '&#9788;' : '&#9790;' }}
      </button>
    </nav>

    <header class="compare-header">
      <h1>Price <span class="accent">Compare</span></h1>
      <p class="subtitle">Makro vs Lotus's — find the best deal</p>
      <form class="search-form" @submit.prevent="doSearch">
        <input v-model="query" type="text" class="search-input" placeholder="Search products..." autofocus />
        <button type="submit" class="search-btn" :disabled="searching || !query.trim()">
          {{ searching ? '...' : 'Compare' }}
        </button>
      </form>
    </header>

    <!-- Summary -->
    <div v-if="searched && !searching" class="summary-bar">
      <span class="summary-item summary-makro">Makro cheaper: <strong>{{ stats.makroCheaper }}</strong></span>
      <span class="summary-item summary-lotus">Lotus's cheaper: <strong>{{ stats.lotusCheaper }}</strong></span>
      <span class="summary-item summary-total">Total: {{ allProducts.length }} products</span>
    </div>

    <!-- Filter tabs -->
    <div v-if="searched && allProducts.length > 0" class="filter-tabs">
      <button v-for="tab in tabs" :key="tab.id" class="tab-btn" :class="{ active: activeTab === tab.id }" @click="activeTab = tab.id">
        {{ tab.label }} ({{ tab.count }})
      </button>
    </div>

    <div v-if="searching" class="status-msg">Searching both stores...</div>
    <div v-else-if="searched && filteredProducts.length === 0" class="status-msg">No products found</div>

    <!-- Product grid -->
    <div class="product-grid">
      <a
        v-for="product in filteredProducts"
        :key="product.id"
        :href="product.link"
        target="_blank"
        rel="noopener"
        class="product-card"
        :class="{
          'card--cheapest': product.isCheapest,
          'card--expensive': product.isExpensive,
        }"
      >
        <div class="card-store" :class="'store--' + product.store">
          {{ product.store === 'makro' ? 'Makro' : "Lotus's" }}
        </div>
        <div class="card-img-wrap">
          <img v-if="product.image" :src="product.image" :alt="product.name" class="card-img" loading="lazy" />
          <div v-else class="card-img-placeholder">No Image</div>
        </div>
        <div class="card-body">
          <p class="card-name">{{ product.name }}</p>
          <div class="card-pricing">
            <span class="card-price" :class="{ 'price--best': product.isCheapest, 'price--worst': product.isExpensive }">
              {{ formatPrice(product.price) }}
            </span>
            <span v-if="product.originalPrice > product.price" class="card-original">{{ formatPrice(product.originalPrice) }}</span>
            <span v-if="product.discount" class="card-discount">{{ product.discount }}</span>
          </div>
          <span v-if="product.priceDiff" class="card-diff" :class="product.isCheapest ? 'diff--save' : 'diff--more'">
            {{ product.isCheapest ? 'Save' : 'More' }} {{ formatPrice(Math.abs(product.priceDiff)) }}
          </span>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
const { isDark, toggleTheme } = useTheme()

interface Product {
  id: string
  name: string
  price: number
  originalPrice: number
  discount: string
  image: string
  link: string
  store: 'makro' | 'lotus'
  isCheapest: boolean
  isExpensive: boolean
  priceDiff: number
}

const query = ref('')
const allProducts = ref<Product[]>([])
const searching = ref(false)
const searched = ref(false)
const activeTab = ref('all')

function formatPrice(n: number): string {
  if (!n) return '-'
  return n.toLocaleString('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 })
}

const stats = computed(() => {
  let makroCheaper = 0
  let lotusCheaper = 0
  for (const p of allProducts.value) {
    if (p.isCheapest && p.store === 'makro') makroCheaper++
    if (p.isCheapest && p.store === 'lotus') lotusCheaper++
  }
  return { makroCheaper, lotusCheaper }
})

const tabs = computed(() => [
  { id: 'all', label: 'All', count: allProducts.value.length },
  { id: 'makro', label: 'Makro', count: allProducts.value.filter(p => p.store === 'makro').length },
  { id: 'lotus', label: "Lotus's", count: allProducts.value.filter(p => p.store === 'lotus').length },
  { id: 'best', label: 'Best Price', count: bestPriceProducts.value.length },
])

const bestPriceProducts = computed(() => {
  // Group by normalized name, pick cheapest
  const map = new Map<string, Product>()
  for (const p of allProducts.value) {
    const key = p.name.toLowerCase().replace(/[^a-z0-9ก-๙]/g, '').slice(0, 30)
    const existing = map.get(key)
    if (!existing || p.price < existing.price) {
      map.set(key, p)
    }
  }
  return [...map.values()]
})

const filteredProducts = computed(() => {
  switch (activeTab.value) {
    case 'makro': return allProducts.value.filter(p => p.store === 'makro')
    case 'lotus': return allProducts.value.filter(p => p.store === 'lotus')
    case 'best': return bestPriceProducts.value
    default: return allProducts.value
  }
})

function parseMakroProducts(data: any): Product[] {
  return (data.hits || []).map((hit: any) => {
    const doc = hit.document || hit
    const price = doc.displayPrice || 0
    const original = doc.originalPrice || 0
    const pct = original > price ? `-${Math.round(((original - price) / original) * 100)}%` : ''
    const images = doc.images || []
    const makroId = doc.makroId || ''
    const id = doc.id || ''
    return {
      id: `makro-${id}`,
      name: doc.title || doc.titleEn || '',
      price,
      originalPrice: original,
      discount: pct,
      image: images[0] || '',
      link: makroId ? `https://www.makro.pro/th/p/${makroId}-${id}` : '#',
      store: 'makro' as const,
      isCheapest: false,
      isExpensive: false,
      priceDiff: 0,
    }
  }).filter((p: Product) => p.name && p.price > 0)
}

function parseLotusProducts(data: any): Product[] {
  const products = data?.data?.products || []
  return products.map((item: any) => {
    const pr = item.priceRange?.minimumPrice || {}
    const price = pr.finalPrice?.value || 0
    const original = pr.regularPrice?.value || 0
    const pctOff = pr.discount?.percentOff || 0
    const discount = pctOff > 0 ? `-${Math.round(pctOff)}%` : ''
    const thumb = item.thumbnail?.url || ''
    const urlKey = item.urlKey || ''
    return {
      id: `lotus-${item.id || urlKey}`,
      name: item.name || '',
      price,
      originalPrice: original,
      discount,
      image: thumb,
      link: urlKey ? `https://www.lotuss.com/th/product/${urlKey}` : '#',
      store: 'lotus' as const,
      isCheapest: false,
      isExpensive: false,
      priceDiff: 0,
    }
  }).filter((p: Product) => p.name && p.price > 0)
}

function markCheapest(products: Product[]) {
  // Simple approach: for each makro product, find closest lotus match and vice versa
  const makro = products.filter(p => p.store === 'makro')
  const lotus = products.filter(p => p.store === 'lotus')

  if (makro.length > 0 && lotus.length > 0) {
    const avgMakro = makro.reduce((s, p) => s + p.price, 0) / makro.length
    const avgLotus = lotus.reduce((s, p) => s + p.price, 0) / lotus.length
    const diff = avgMakro - avgLotus

    // Mark individual products
    for (const p of products) {
      if (p.store === 'makro') {
        p.priceDiff = diff
        p.isCheapest = diff <= 0
        p.isExpensive = diff > 0
      } else {
        p.priceDiff = -diff
        p.isCheapest = diff >= 0
        p.isExpensive = diff < 0
      }
    }
  }
}

async function doSearch() {
  if (!query.value.trim()) return
  searching.value = true
  searched.value = false
  activeTab.value = 'all'

  try {
    const [makroData, lotusData] = await Promise.all([
      $fetch<any>('/api/makro/search', { method: 'POST', body: { q: query.value, limit: 20 } }).catch(() => ({ hits: [] })),
      $fetch<any>('/api/makro/lotuss', { method: 'POST', body: { q: query.value, limit: 20 } }).catch(() => ({ data: { products: [] } })),
    ])

    const makro = parseMakroProducts(makroData)
    const lotus = parseLotusProducts(lotusData)
    const combined = [...makro, ...lotus]

    // Sort: interleave makro and lotus
    combined.sort((a, b) => {
      if (a.store !== b.store) return a.store === 'makro' ? -1 : 1
      return a.price - b.price
    })

    markCheapest(combined)
    allProducts.value = combined
  } catch {
    allProducts.value = []
  }

  searching.value = false
  searched.value = true
}
</script>

<style scoped>
.compare {
  max-width: 960px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

.compare-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.back-link { color: var(--text-secondary); text-decoration: none; font-size: 0.85rem; }
.back-link:hover { color: var(--text-primary); }

.theme-toggle {
  background: var(--bg-btn-secondary); border: none; border-radius: 50%;
  width: 36px; height: 36px; font-size: 1.1rem; cursor: pointer;
  display: flex; align-items: center; justify-content: center; color: var(--text-primary);
}

.compare-header { text-align: center; margin-bottom: 1.5rem; }
.compare-header h1 { font-size: 1.5rem; font-weight: 800; margin: 0; }
.accent { background: linear-gradient(135deg, #0055a5, #22c55e); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.subtitle { color: var(--text-muted); font-size: 0.85rem; margin: 0.25rem 0 1rem; }

.search-form { display: flex; gap: 0.5rem; max-width: 500px; margin: 0 auto; }
.search-input {
  flex: 1; padding: 0.7rem 1rem; border: 1.5px solid var(--border-input);
  border-radius: 10px; font-size: 0.9rem; outline: none;
  background: var(--bg-input); color: var(--text-primary);
}
.search-input::placeholder { color: var(--text-muted); }
.search-input:focus { border-color: #0055a5; }
.search-btn {
  padding: 0.7rem 1.25rem; border: none; border-radius: 10px;
  font-size: 0.85rem; font-weight: 600; cursor: pointer;
  background: linear-gradient(135deg, #0055a5, #22c55e); color: white; white-space: nowrap;
}
.search-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* Summary */
.summary-bar {
  display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;
  margin-bottom: 1rem; font-size: 0.8rem;
}
.summary-item { padding: 0.35rem 0.75rem; border-radius: 8px; }
.summary-makro { background: rgba(0, 85, 165, 0.1); color: #0055a5; }
.summary-lotus { background: rgba(220, 38, 38, 0.1); color: #dc2626; }
.summary-total { color: var(--text-muted); }
[data-theme="dark"] .summary-makro { background: rgba(96, 165, 250, 0.12); color: #60a5fa; }
[data-theme="dark"] .summary-lotus { background: rgba(248, 113, 113, 0.12); color: #f87171; }

/* Tabs */
.filter-tabs { display: flex; gap: 0.35rem; margin-bottom: 1rem; flex-wrap: wrap; }
.tab-btn {
  padding: 0.4rem 0.75rem; border: 1px solid var(--border-card-default);
  border-radius: 8px; font-size: 0.75rem; font-weight: 500; cursor: pointer;
  background: transparent; color: var(--text-secondary); transition: all 0.2s;
}
.tab-btn:hover { border-color: var(--text-muted); }
.tab-btn.active { background: var(--text-primary); color: var(--bg-body); border-color: var(--text-primary); }

.status-msg { text-align: center; padding: 3rem; color: var(--text-muted); }

/* Grid */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
}
@media (max-width: 480px) { .product-grid { grid-template-columns: repeat(2, 1fr); gap: 0.5rem; } }

/* Card */
.product-card {
  background: var(--bg-card); border: 1.5px solid var(--border-card-default);
  border-radius: 12px; overflow: hidden; text-decoration: none;
  color: inherit; transition: all 0.25s; display: flex; flex-direction: column;
  position: relative;
}
.product-card:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08); }
.card--cheapest { border-color: rgba(34, 197, 94, 0.4); }
.card--cheapest:hover { border-color: rgba(34, 197, 94, 0.6); }
.card--expensive { border-color: rgba(239, 68, 68, 0.2); }

/* Store badge */
.card-store {
  position: absolute; top: 6px; left: 6px; z-index: 2;
  font-size: 0.55rem; font-weight: 700; padding: 0.15rem 0.4rem;
  border-radius: 4px; text-transform: uppercase; letter-spacing: 0.03em;
}
.store--makro { background: #0055a5; color: white; }
.store--lotus { background: #dc2626; color: white; }

/* Image */
.card-img-wrap {
  aspect-ratio: 1; background: #f8f8f8; display: flex;
  align-items: center; justify-content: center; overflow: hidden;
}
[data-theme="dark"] .card-img-wrap { background: #1a1a2e; }
.card-img { width: 100%; height: 100%; object-fit: contain; padding: 0.5rem; }
.card-img-placeholder { color: var(--text-muted); font-size: 0.7rem; }

/* Body */
.card-body { padding: 0.6rem 0.75rem 0.75rem; display: flex; flex-direction: column; gap: 0.2rem; flex: 1; }
.card-name {
  font-size: 0.75rem; font-weight: 600; margin: 0;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  overflow: hidden; line-height: 1.3;
}

.card-pricing { display: flex; align-items: baseline; gap: 0.3rem; margin-top: 0.15rem; }
.card-price { font-size: 0.95rem; font-weight: 700; }
.price--best { color: #16a34a; }
.price--worst { color: #dc2626; }
[data-theme="dark"] .price--best { color: #4ade80; }
[data-theme="dark"] .price--worst { color: #f87171; }
.card-original { font-size: 0.65rem; color: var(--text-muted); text-decoration: line-through; }
.card-discount {
  font-size: 0.55rem; font-weight: 700; background: #dc2626; color: white;
  padding: 0.1rem 0.25rem; border-radius: 3px;
}

.card-diff {
  font-size: 0.65rem; font-weight: 600; margin-top: 0.15rem;
  padding: 0.15rem 0.35rem; border-radius: 4px; align-self: flex-start;
}
.diff--save { background: rgba(34, 197, 94, 0.1); color: #16a34a; }
.diff--more { background: rgba(239, 68, 68, 0.08); color: #dc2626; }
[data-theme="dark"] .diff--save { background: rgba(34, 197, 94, 0.15); color: #4ade80; }
[data-theme="dark"] .diff--more { background: rgba(239, 68, 68, 0.12); color: #f87171; }
</style>
