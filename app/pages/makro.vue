<template>
  <div class="makro">
    <nav class="makro-nav">
      <NuxtLink to="/" class="back-link">&larr; Home</NuxtLink>
      <button class="theme-toggle" @click="toggleTheme" :title="isDark ? 'Light' : 'Dark'">
        {{ isDark ? '&#9788;' : '&#9790;' }}
      </button>
    </nav>

    <header class="makro-header">
      <h1>Makro <span class="makro-accent">Search</span></h1>
      <form class="search-form" @submit.prevent="doSearch">
        <input
          v-model="query"
          type="text"
          class="search-input"
          placeholder="Search Makro Pro products..."
          autofocus
        />
        <button type="submit" class="search-btn" :disabled="searching || !query.trim()">
          {{ searching ? 'Searching...' : 'Search' }}
        </button>
      </form>
    </header>

    <div v-if="searching && products.length === 0" class="makro-status">Searching...</div>
    <div v-else-if="searched && products.length === 0" class="makro-status">No products found</div>
    <p v-if="products.length > 0" class="result-count">{{ products.length }} results</p>

    <div class="product-grid">
      <a
        v-for="product in products"
        :key="product.id"
        :href="product.link"
        target="_blank"
        rel="noopener"
        class="product-card"
      >
        <div class="product-img-wrap">
          <img
            v-if="product.image"
            :src="product.image"
            :alt="product.title"
            class="product-img"
            loading="lazy"
          />
          <div v-else class="product-img-placeholder">No Image</div>
          <span v-if="!product.inStock" class="out-of-stock">Out of Stock</span>
          <span v-if="product.discount" class="discount-tag">{{ product.discount }}</span>
        </div>
        <div class="product-body">
          <p class="product-title">{{ product.title }}</p>
          <p v-if="product.titleEn && product.titleEn !== product.title" class="product-title-en">{{ product.titleEn }}</p>
          <p v-if="product.brand" class="product-brand">{{ product.brand }}</p>
          <div class="product-pricing">
            <span class="sale-price">{{ formatPrice(product.displayPrice) }}</span>
            <span v-if="product.originalPrice > product.displayPrice" class="original-price">{{ formatPrice(product.originalPrice) }}</span>
          </div>
          <p v-if="product.unitInfo" class="product-unit">{{ product.unitInfo }}</p>
          <div class="product-meta">
            <span v-if="product.soldCount > 0" class="sold-count">Sold {{ product.soldCount.toLocaleString() }}</span>
            <span v-if="product.category" class="product-cat">{{ product.category }}</span>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
const { isDark, toggleTheme } = useTheme()

interface Product {
  id: string
  title: string
  titleEn: string
  brand: string
  displayPrice: number
  originalPrice: number
  discount: string
  image: string
  link: string
  unitInfo: string
  soldCount: number
  inStock: boolean
  category: string
}

const query = ref('')
const products = ref<Product[]>([])
const searching = ref(false)
const searched = ref(false)

function formatPrice(n: number): string {
  if (!n) return '-'
  return n.toLocaleString('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 })
}

function calcDiscount(sale: number, original: number): string {
  if (!original || !sale || original <= sale) return ''
  const pct = Math.round(((original - sale) / original) * 100)
  return pct > 0 ? `-${pct}%` : ''
}

async function doSearch() {
  if (!query.value.trim()) return
  searching.value = true
  searched.value = false
  try {
    const data = await $fetch<any>('/api/makro/search', {
      method: 'POST',
      body: { q: query.value, limit: 40 },
    })

    products.value = (data.hits || []).map((hit: any) => {
      const doc = hit.document || hit
      const images = doc.images || []
      const makroId = doc.makroId || ''
      const id = doc.id || ''
      const displayPrice = doc.displayPrice || 0
      const originalPrice = doc.originalPrice || 0

      let unitInfo = ''
      if (doc.unitSize && doc.unitFactor && doc.unitFactor > 1) {
        unitInfo = `${doc.unitSize} x ${doc.unitFactor}`
      } else if (doc.unitSize) {
        unitInfo = doc.unitSize
      }

      return {
        id: String(id),
        title: doc.title || doc.titleEn || '',
        titleEn: doc.titleEn || '',
        brand: doc.brand || doc.brandEn || '',
        displayPrice,
        originalPrice,
        discount: calcDiscount(displayPrice, originalPrice),
        image: images.length > 0 ? images[0] : '',
        link: makroId ? `https://www.makro.pro/th/p/${makroId}-${id}` : '#',
        unitInfo,
        soldCount: doc.soldCount || 0,
        inStock: doc.inStock !== 0,
        category: doc.deepestCategory || '',
      }
    })
  } catch {
    products.value = []
  }
  searching.value = false
  searched.value = true
}
</script>

<style scoped>
.makro {
  max-width: 960px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

.makro-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.back-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.85rem;
}

.back-link:hover { color: var(--text-primary); }

.theme-toggle {
  background: var(--bg-btn-secondary);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
}

.makro-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.makro-header h1 {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0 0 1rem;
}

.makro-accent {
  color: #0055a5;
}

[data-theme="dark"] .makro-accent { color: #60a5fa; }

.search-form {
  display: flex;
  gap: 0.5rem;
  max-width: 500px;
  margin: 0 auto;
}

.search-input {
  flex: 1;
  padding: 0.7rem 1rem;
  border: 1.5px solid var(--border-input);
  border-radius: 10px;
  font-size: 0.9rem;
  outline: none;
  background: var(--bg-input);
  color: var(--text-primary);
  transition: border-color 0.2s;
}

.search-input::placeholder { color: var(--text-muted); }
.search-input:focus { border-color: #0055a5; }

.search-btn {
  padding: 0.7rem 1.25rem;
  border: none;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  background: #0055a5;
  color: white;
  white-space: nowrap;
  transition: background 0.2s;
}

.search-btn:hover:not(:disabled) { background: #004488; }
.search-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.makro-status {
  text-align: center;
  padding: 3rem;
  color: var(--text-muted);
}

.result-count {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0 0 0.75rem;
}

/* Product grid */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
}

@media (max-width: 480px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
}

.product-card {
  background: var(--bg-card);
  border: 1px solid var(--border-card-default);
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: all 0.25s;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

/* Image */
.product-img-wrap {
  position: relative;
  aspect-ratio: 1;
  background: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

[data-theme="dark"] .product-img-wrap { background: #1a1a2e; }

.product-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 0.5rem;
}

.product-img-placeholder {
  color: var(--text-muted);
  font-size: 0.75rem;
}

.out-of-stock {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
}

.discount-tag {
  position: absolute;
  top: 6px;
  right: 6px;
  background: #dc2626;
  color: white;
  font-size: 0.6rem;
  font-weight: 700;
  padding: 0.15rem 0.35rem;
  border-radius: 4px;
}

/* Body */
.product-body {
  padding: 0.6rem 0.75rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
}

.product-title {
  font-size: 0.78rem;
  font-weight: 600;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
}

.product-title-en {
  font-size: 0.65rem;
  color: var(--text-muted);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-brand {
  font-size: 0.65rem;
  color: var(--text-secondary);
  margin: 0;
}

.product-pricing {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
  margin-top: 0.2rem;
}

.sale-price {
  font-size: 0.95rem;
  font-weight: 700;
  color: #dc2626;
}

[data-theme="dark"] .sale-price { color: #f87171; }

.original-price {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-decoration: line-through;
}

.product-unit {
  font-size: 0.65rem;
  color: var(--text-secondary);
  margin: 0;
}

.product-meta {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-top: auto;
  padding-top: 0.3rem;
}

.sold-count {
  font-size: 0.6rem;
  color: var(--text-muted);
}

.product-cat {
  font-size: 0.6rem;
  color: var(--text-muted);
  background: var(--bg-btn-secondary);
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
}
</style>
