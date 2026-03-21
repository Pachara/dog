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
      <p class="subtitle">Makro vs Lotus's — same product, who's cheaper?</p>
      <form class="search-form" @submit.prevent="doSearch">
        <input v-model="query" type="text" class="search-input" placeholder="Search products..." autofocus />
        <button type="submit" class="search-btn" :disabled="searching || !query.trim()">
          {{ searching ? '...' : 'Compare' }}
        </button>
      </form>
    </header>

    <!-- Stats summary -->
    <div v-if="searched && !searching && stats" class="summary-bar">
      <span class="summary-chip summary-matched">{{ stats.matched }} matched</span>
      <span class="summary-chip summary-makro">Makro wins: {{ stats.makroCheaper }}</span>
      <span class="summary-chip summary-lotus">Lotus's wins: {{ stats.lotusCheaper }}</span>
      <span v-if="stats.equal" class="summary-chip summary-equal">Tie: {{ stats.equal }}</span>
    </div>

    <!-- Filter tabs -->
    <div v-if="searched && results.length > 0" class="filter-tabs">
      <button class="tab-btn" :class="{ active: tab === 'all' }" @click="tab = 'all'">All ({{ results.length }})</button>
      <button class="tab-btn" :class="{ active: tab === 'matched' }" @click="tab = 'matched'">Matched ({{ matchedResults.length }})</button>
      <button class="tab-btn" :class="{ active: tab === 'makro' }" @click="tab = 'makro'">Makro Only ({{ makroOnly.length }})</button>
      <button class="tab-btn" :class="{ active: tab === 'lotus' }" @click="tab = 'lotus'">Lotus's Only ({{ lotusOnly.length }})</button>
    </div>

    <div v-if="searching" class="status-msg">Searching both stores...</div>
    <div v-else-if="searched && filtered.length === 0" class="status-msg">No products found</div>

    <!-- Results -->
    <div class="results-list">
      <template v-for="item in filtered" :key="item.type === 'matched' ? item.makro.id : item.product.id">
        <!-- Matched pair card -->
        <div v-if="item.type === 'matched'" class="match-card">
          <div class="match-name">{{ item.name }}</div>
          <div class="match-sides">
            <!-- Makro side -->
            <a :href="item.makro.link" target="_blank" rel="noopener" class="match-side" :class="{ 'side--winner': item.cheaper === 'makro', 'side--loser': item.cheaper === 'lotus' }">
              <span class="side-store store--makro">Makro</span>
              <img v-if="item.makro.image" :src="item.makro.image" class="side-img" loading="lazy" />
              <div class="side-pricing">
                <span class="side-price">{{ formatPrice(item.makro.price) }}</span>
                <span v-if="item.makro.originalPrice > item.makro.price" class="side-original">{{ formatPrice(item.makro.originalPrice) }}</span>
              </div>
              <span v-if="item.cheaper === 'makro'" class="winner-badge">Cheaper!</span>
            </a>
            <!-- VS divider -->
            <div class="match-vs">
              <span class="vs-text">VS</span>
              <span v-if="item.priceDiff > 0" class="vs-diff">{{ formatPrice(item.priceDiff) }}</span>
            </div>
            <!-- Lotus side -->
            <a :href="item.lotus.link" target="_blank" rel="noopener" class="match-side" :class="{ 'side--winner': item.cheaper === 'lotus', 'side--loser': item.cheaper === 'makro' }">
              <span class="side-store store--lotus">Lotus's</span>
              <img v-if="item.lotus.image" :src="item.lotus.image" class="side-img" loading="lazy" />
              <div class="side-pricing">
                <span class="side-price">{{ formatPrice(item.lotus.price) }}</span>
                <span v-if="item.lotus.originalPrice > item.lotus.price" class="side-original">{{ formatPrice(item.lotus.originalPrice) }}</span>
              </div>
              <span v-if="item.cheaper === 'lotus'" class="winner-badge">Cheaper!</span>
            </a>
          </div>
        </div>

        <!-- Unmatched single card -->
        <a v-else :href="item.product.link" target="_blank" rel="noopener" class="single-card">
          <span class="single-store" :class="'store--' + item.product.store">
            {{ item.product.store === 'makro' ? 'Makro' : "Lotus's" }}
          </span>
          <img v-if="item.product.image" :src="item.product.image" class="single-img" loading="lazy" />
          <div class="single-body">
            <p class="single-name">{{ item.product.name }}</p>
            <div class="single-pricing">
              <span class="single-price">{{ formatPrice(item.product.price) }}</span>
              <span v-if="item.product.originalPrice > item.product.price" class="single-original">{{ formatPrice(item.product.originalPrice) }}</span>
              <span v-if="item.product.discount" class="single-discount">{{ item.product.discount }}</span>
            </div>
          </div>
          <span class="single-only">Only here</span>
        </a>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const { isDark, toggleTheme } = useTheme()

interface NormalizedProduct {
  id: string; name: string; nameEn: string; brand: string
  price: number; originalPrice: number; discount: string
  image: string; link: string; store: 'makro' | 'lotus'
}
interface MatchedPair {
  type: 'matched'; name: string
  makro: NormalizedProduct; lotus: NormalizedProduct
  cheaper: 'makro' | 'lotus' | 'equal'; priceDiff: number
}
interface UnmatchedProduct { type: 'unmatched'; product: NormalizedProduct }
type CompareResult = MatchedPair | UnmatchedProduct

const query = ref('')
const results = ref<CompareResult[]>([])
const stats = ref<any>(null)
const searching = ref(false)
const searched = ref(false)
const tab = ref('all')

function formatPrice(n: number): string {
  if (!n) return '-'
  return n.toLocaleString('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 })
}

const matchedResults = computed(() => results.value.filter(r => r.type === 'matched') as MatchedPair[])
const makroOnly = computed(() => results.value.filter(r => r.type === 'unmatched' && r.product.store === 'makro'))
const lotusOnly = computed(() => results.value.filter(r => r.type === 'unmatched' && r.product.store === 'lotus'))

const filtered = computed(() => {
  switch (tab.value) {
    case 'matched': return matchedResults.value
    case 'makro': return makroOnly.value
    case 'lotus': return lotusOnly.value
    default: return results.value
  }
})

async function doSearch() {
  if (!query.value.trim()) return
  searching.value = true
  searched.value = false
  tab.value = 'all'
  try {
    const data = await $fetch<{ results: CompareResult[]; stats: any }>('/api/compare', {
      method: 'POST', body: { q: query.value },
    })
    results.value = data.results
    stats.value = data.stats
  } catch {
    results.value = []
    stats.value = null
  }
  searching.value = false
  searched.value = true
}
</script>

<style scoped>
.compare { max-width: 820px; margin: 0 auto; padding: 1.5rem 1rem; }

.compare-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.back-link { color: var(--text-secondary); text-decoration: none; font-size: 0.85rem; }
.back-link:hover { color: var(--text-primary); }
.theme-toggle {
  background: var(--bg-btn-secondary); border: none; border-radius: 50%;
  width: 36px; height: 36px; font-size: 1.1rem; cursor: pointer;
  display: flex; align-items: center; justify-content: center; color: var(--text-primary);
}

.compare-header { text-align: center; margin-bottom: 1.25rem; }
.compare-header h1 { font-size: 1.5rem; font-weight: 800; margin: 0; }
.accent { background: linear-gradient(135deg, #0055a5, #22c55e); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.subtitle { color: var(--text-muted); font-size: 0.82rem; margin: 0.2rem 0 1rem; }

.search-form { display: flex; gap: 0.5rem; max-width: 480px; margin: 0 auto; }
.search-input {
  flex: 1; padding: 0.65rem 1rem; border: 1.5px solid var(--border-input);
  border-radius: 10px; font-size: 0.9rem; outline: none;
  background: var(--bg-input); color: var(--text-primary);
}
.search-input::placeholder { color: var(--text-muted); }
.search-input:focus { border-color: #0055a5; }
.search-btn {
  padding: 0.65rem 1.25rem; border: none; border-radius: 10px;
  font-size: 0.85rem; font-weight: 600; cursor: pointer;
  background: linear-gradient(135deg, #0055a5, #22c55e); color: white; white-space: nowrap;
}
.search-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* Summary */
.summary-bar { display: flex; justify-content: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem; }
.summary-chip { font-size: 0.75rem; font-weight: 600; padding: 0.3rem 0.65rem; border-radius: 8px; }
.summary-matched { background: var(--bg-btn-secondary); color: var(--text-primary); }
.summary-makro { background: rgba(0, 85, 165, 0.1); color: #0055a5; }
.summary-lotus { background: rgba(220, 38, 38, 0.1); color: #dc2626; }
.summary-equal { background: rgba(107, 114, 128, 0.1); color: var(--text-muted); }
[data-theme="dark"] .summary-makro { background: rgba(96, 165, 250, 0.12); color: #60a5fa; }
[data-theme="dark"] .summary-lotus { background: rgba(248, 113, 113, 0.12); color: #f87171; }

/* Tabs */
.filter-tabs { display: flex; gap: 0.35rem; margin-bottom: 1rem; flex-wrap: wrap; }
.tab-btn {
  padding: 0.35rem 0.7rem; border: 1px solid var(--border-card-default);
  border-radius: 8px; font-size: 0.72rem; font-weight: 500; cursor: pointer;
  background: transparent; color: var(--text-secondary); transition: all 0.2s;
}
.tab-btn:hover { border-color: var(--text-muted); }
.tab-btn.active { background: var(--text-primary); color: var(--bg-body); border-color: var(--text-primary); }

.status-msg { text-align: center; padding: 3rem; color: var(--text-muted); }

/* Results list */
.results-list { display: flex; flex-direction: column; gap: 0.75rem; }

/* --- MATCHED PAIR CARD --- */
.match-card {
  background: var(--bg-card); border: 1px solid var(--border-card-default);
  border-radius: 14px; padding: 0.85rem 1rem; transition: all 0.2s;
}
.match-card:hover { box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06); }

.match-name {
  font-size: 0.82rem; font-weight: 600; margin-bottom: 0.6rem;
  text-align: center; color: var(--text-primary);
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

.match-sides { display: grid; grid-template-columns: 1fr auto 1fr; gap: 0.5rem; align-items: center; }

.match-side {
  display: flex; flex-direction: column; align-items: center; gap: 0.35rem;
  text-decoration: none; color: inherit; padding: 0.5rem;
  border-radius: 10px; transition: all 0.2s; position: relative;
}
.match-side:hover { background: var(--bg-btn-secondary); }

.side--winner { border: 1.5px solid rgba(34, 197, 94, 0.4); border-radius: 10px; }
.side--loser { opacity: 0.7; }

.side-store {
  font-size: 0.6rem; font-weight: 700; padding: 0.1rem 0.35rem;
  border-radius: 4px; text-transform: uppercase; letter-spacing: 0.03em;
}
.store--makro { background: #0055a5; color: white; }
.store--lotus { background: #dc2626; color: white; }

.side-img { width: 56px; height: 56px; object-fit: contain; border-radius: 6px; }

.side-pricing { display: flex; flex-direction: column; align-items: center; gap: 0.1rem; }
.side-price { font-size: 1rem; font-weight: 700; }
.side--winner .side-price { color: #16a34a; }
[data-theme="dark"] .side--winner .side-price { color: #4ade80; }
.side-original { font-size: 0.65rem; color: var(--text-muted); text-decoration: line-through; }

.winner-badge {
  font-size: 0.55rem; font-weight: 700; color: #16a34a;
  background: rgba(34, 197, 94, 0.1); padding: 0.1rem 0.35rem; border-radius: 4px;
}
[data-theme="dark"] .winner-badge { color: #4ade80; background: rgba(34, 197, 94, 0.15); }

/* VS divider */
.match-vs { display: flex; flex-direction: column; align-items: center; gap: 0.2rem; }
.vs-text { font-size: 0.7rem; font-weight: 800; color: var(--text-muted); }
.vs-diff { font-size: 0.65rem; font-weight: 600; color: var(--text-secondary); }

/* --- UNMATCHED SINGLE CARD --- */
.single-card {
  display: flex; align-items: center; gap: 0.75rem;
  background: var(--bg-card); border: 1px solid var(--border-card-default);
  border-radius: 12px; padding: 0.65rem 0.85rem; text-decoration: none;
  color: inherit; transition: all 0.2s; position: relative;
}
.single-card:hover { box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); }

.single-store {
  position: absolute; top: 6px; right: 6px;
  font-size: 0.5rem; font-weight: 700; padding: 0.1rem 0.3rem;
  border-radius: 3px; text-transform: uppercase;
}

.single-img { width: 44px; height: 44px; object-fit: contain; border-radius: 6px; flex-shrink: 0; }

.single-body { flex: 1; min-width: 0; }
.single-name {
  font-size: 0.78rem; font-weight: 500; margin: 0;
  display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;
}
.single-pricing { display: flex; align-items: baseline; gap: 0.3rem; margin-top: 0.15rem; }
.single-price { font-size: 0.85rem; font-weight: 700; color: var(--text-primary); }
.single-original { font-size: 0.65rem; color: var(--text-muted); text-decoration: line-through; }
.single-discount {
  font-size: 0.5rem; font-weight: 700; background: #dc2626; color: white;
  padding: 0.05rem 0.2rem; border-radius: 3px;
}

.single-only {
  font-size: 0.6rem; color: var(--text-muted); font-style: italic; flex-shrink: 0;
}

/* Responsive */
@media (max-width: 520px) {
  .match-sides { grid-template-columns: 1fr auto 1fr; gap: 0.25rem; }
  .side-img { width: 40px; height: 40px; }
  .side-price { font-size: 0.85rem; }
}
</style>
