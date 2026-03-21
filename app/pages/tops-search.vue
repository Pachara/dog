<template>
  <div class="store-search">
    <nav class="store-nav">
      <NuxtLink to="/" class="back-link">&larr; Home</NuxtLink>
      <button class="theme-toggle" @click="toggleTheme">{{ isDark ? '&#9788;' : '&#9790;' }}</button>
    </nav>

    <header class="store-header">
      <h1 class="store-title store-title--tops">Tops <span>Search</span></h1>

      <div class="cli-notice">
        <div class="notice-icon">&#128274;</div>
        <h2 class="notice-title">Tops is available via CLI only</h2>
        <p class="notice-desc">
          Tops.co.th is protected by Cloudflare, blocking all server/browser requests from external sites.
          Use the Oracle CLI skill instead:
        </p>
        <div class="cli-examples">
          <code>/tops-search milk</code>
          <code>/tops-search "เฮลบลูบอย" --compare</code>
          <code>/tops-search ไข่ไก่ --limit 10</code>
        </div>
        <p class="notice-sub">
          The <code>--compare</code> flag searches Tops + Makro + Lotus's in parallel and shows a 3-way price comparison.
        </p>
      </div>

      <div class="alt-links">
        <p class="alt-title">Meanwhile, try these:</p>
        <div class="alt-buttons">
          <NuxtLink to="/makro-search" class="alt-btn alt-btn--makro">Makro Search</NuxtLink>
          <NuxtLink to="/lotus-search" class="alt-btn alt-btn--lotus">Lotus's Search</NuxtLink>
          <NuxtLink to="/makro" class="alt-btn alt-btn--compare">Price Compare</NuxtLink>
        </div>
      </div>
    </header>
  </div>
</template>

<script setup lang="ts">
const { isDark, toggleTheme } = useTheme()
</script>

<style scoped>
.store-search { max-width: 600px; margin: 0 auto; padding: 1.5rem 1rem; }
.store-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.back-link { color: var(--text-secondary); text-decoration: none; font-size: 0.85rem; }
.back-link:hover { color: var(--text-primary); }
.theme-toggle { background: var(--bg-btn-secondary); border: none; border-radius: 50%; width: 36px; height: 36px; font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-primary); }

.store-header { text-align: center; }
.store-title { font-size: 1.5rem; font-weight: 800; margin: 0 0 1.5rem; }
.store-title--tops span { color: #e3192c; }
[data-theme="dark"] .store-title--tops span { color: #f87171; }

.cli-notice {
  background: var(--bg-card);
  border: 1px solid var(--border-card-default);
  border-radius: 16px;
  padding: 2rem 1.5rem;
  margin-bottom: 1.5rem;
}

.notice-icon { font-size: 2rem; margin-bottom: 0.75rem; }
.notice-title { font-size: 1.1rem; font-weight: 700; margin: 0 0 0.5rem; }
.notice-desc { font-size: 0.85rem; color: var(--text-secondary); margin: 0 0 1rem; line-height: 1.5; }
.notice-desc code { background: var(--bg-btn-secondary); padding: 0.1rem 0.3rem; border-radius: 4px; font-size: 0.8rem; }

.cli-examples {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1rem;
}

.cli-examples code {
  display: block;
  background: #0f172a;
  color: #22d3ee;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-family: 'SF Mono', 'Fira Code', monospace;
  text-align: left;
}

[data-theme="light"] .cli-examples code {
  background: #1e293b;
}

.notice-sub { font-size: 0.78rem; color: var(--text-muted); margin: 0; line-height: 1.4; }
.notice-sub code { background: var(--bg-btn-secondary); padding: 0.1rem 0.3rem; border-radius: 4px; font-size: 0.75rem; }

.alt-links { margin-top: 1rem; }
.alt-title { font-size: 0.85rem; color: var(--text-secondary); margin: 0 0 0.75rem; }
.alt-buttons { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
.alt-btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  color: white;
  transition: all 0.2s;
}
.alt-btn:hover { transform: translateY(-1px); }
.alt-btn--makro { background: #0055a5; }
.alt-btn--lotus { background: #dc2626; }
.alt-btn--compare { background: linear-gradient(135deg, #0055a5, #22c55e); }
</style>
