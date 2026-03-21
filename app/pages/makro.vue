<template>
  <div class="makro">
    <nav class="makro-nav">
      <NuxtLink to="/" class="back-link">&larr; Home</NuxtLink>
      <button class="theme-toggle" @click="toggleTheme" :title="isDark ? 'Light' : 'Dark'">
        {{ isDark ? '&#9788;' : '&#9790;' }}
      </button>
    </nav>

    <header class="makro-header">
      <h1>Makro Pro</h1>
      <p class="makro-subtitle">{{ filtered.length }} products</p>
      <input
        v-model="search"
        type="text"
        class="makro-search"
        placeholder="Search products..."
      />
    </header>

    <div class="product-grid">
      <div v-for="product in filtered" :key="product.name" class="product-card">
        <div class="product-name">{{ product.name }}</div>
        <div class="product-prices">
          <span class="sale-price">{{ formatPrice(product.salePrice) }}</span>
          <span v-if="product.originalPrice > product.salePrice" class="original-price">{{ formatPrice(product.originalPrice) }}</span>
          <span v-if="product.discount" class="discount-badge">{{ product.discount }}</span>
        </div>
      </div>
    </div>

    <div v-if="filtered.length === 0 && !loading" class="makro-empty">
      No products found
    </div>
    <div v-if="loading" class="makro-empty">Loading...</div>
  </div>
</template>

<script setup lang="ts">
const { isDark, toggleTheme } = useTheme()

interface Product {
  name: string
  salePrice: number
  originalPrice: number
  discount: string
}

const products = ref<Product[]>([])
const search = ref('')
const loading = ref(true)

const filtered = computed(() => {
  if (!search.value.trim()) return products.value
  const q = search.value.toLowerCase()
  return products.value.filter(p => p.name.toLowerCase().includes(q))
})

function formatPrice(n: number): string {
  return n.toLocaleString('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 })
}

onMounted(async () => {
  try {
    products.value = await $fetch<Product[]>('/api/makro/products')
  } catch {}
  loading.value = false
})
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

.back-link:hover {
  color: var(--text-primary);
}

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
  margin: 0;
  color: #0055a5;
}

[data-theme="dark"] .makro-header h1 {
  color: #60a5fa;
}

.makro-subtitle {
  color: var(--text-muted);
  font-size: 0.85rem;
  margin: 0.25rem 0 1rem;
}

.makro-search {
  width: 100%;
  max-width: 400px;
  padding: 0.6rem 1rem;
  border: 1.5px solid var(--border-input);
  border-radius: 10px;
  font-size: 0.9rem;
  outline: none;
  background: var(--bg-input);
  color: var(--text-primary);
  transition: border-color 0.2s;
}

.makro-search::placeholder {
  color: var(--text-muted);
}

.makro-search:focus {
  border-color: #0055a5;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 0.75rem;
}

.product-card {
  background: var(--bg-card);
  border: 1px solid var(--border-card-default);
  border-radius: 10px;
  padding: 0.85rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s;
}

.product-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.product-name {
  font-size: 0.82rem;
  font-weight: 500;
  flex: 1;
  min-width: 0;
}

.product-prices {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
}

.sale-price {
  font-size: 0.95rem;
  font-weight: 700;
  color: #dc2626;
}

[data-theme="dark"] .sale-price {
  color: #f87171;
}

.original-price {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-decoration: line-through;
}

.discount-badge {
  font-size: 0.6rem;
  font-weight: 700;
  background: #dc2626;
  color: white;
  padding: 0.1rem 0.3rem;
  border-radius: 4px;
}

.makro-empty {
  text-align: center;
  padding: 3rem;
  color: var(--text-muted);
}
</style>
