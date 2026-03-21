<template>
  <div class="home">
    <nav class="home-nav">
      <span class="home-brand">DOG</span>
      <button class="theme-toggle" @click="toggleTheme" :title="isDark ? 'Light' : 'Dark'">
        {{ isDark ? '&#9788;' : '&#9790;' }}
      </button>
    </nav>

    <header class="home-header">
      <h1 class="home-title">
        <span class="home-gradient">Dog</span> Platform
      </h1>
      <p class="home-desc">Everything in one place.</p>
    </header>

    <div class="app-grid">
      <NuxtLink to="/monitor" class="app-card">
        <div class="app-icon app-icon--monitor">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="20" r="4" fill="#22c55e"/>
            <circle cx="24" cy="14" r="4" fill="#22c55e"/>
            <circle cx="36" cy="18" r="4" fill="#ef4444"/>
            <path d="M12,20 L24,14 L36,18" stroke="#94a3b8" stroke-width="1.5" fill="none"/>
          </svg>
        </div>
        <div class="app-info">
          <h2 class="app-name">URL Monitor</h2>
          <p class="app-desc">Monitor website uptime with real-time status checks and 6 design themes</p>
        </div>
        <span class="app-arrow">&rarr;</span>
      </NuxtLink>

      <NuxtLink to="/office" class="app-card">
        <div class="app-icon app-icon--office">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="14" cy="18" r="7" fill="#fcd34d"/>
            <circle cx="11" cy="16" r="1.5" fill="#1a1a1a"/>
            <circle cx="17" cy="16" r="1.5" fill="#1a1a1a"/>
            <path d="M11,21 Q14,24 17,21" stroke="#92400e" stroke-width="1" fill="none"/>
            <circle cx="30" cy="22" r="7" fill="#fcd34d"/>
            <circle cx="27" cy="20" r="1.5" fill="#1a1a1a"/>
            <circle cx="33" cy="20" r="1.5" fill="#1a1a1a"/>
            <line x1="27" y1="25" x2="33" y2="25" stroke="#92400e" stroke-width="1"/>
          </svg>
        </div>
        <div class="app-info">
          <h2 class="app-name">Oracle Office</h2>
          <p class="app-desc">Live dashboard showing Oracle activity with animated avatars and SSE</p>
        </div>
        <span class="app-arrow">&rarr;</span>
      </NuxtLink>

      <NuxtLink to="/makro" class="app-card">
        <div class="app-icon app-icon--makro">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="10" width="28" height="22" rx="3" fill="#e2e8f0"/>
            <rect x="8" y="14" width="24" height="3" rx="1" fill="#94a3b8"/>
            <rect x="8" y="19" width="16" height="2" rx="1" fill="#cbd5e1"/>
            <rect x="8" y="23" width="20" height="2" rx="1" fill="#cbd5e1"/>
            <rect x="8" y="27" width="12" height="2" rx="1" fill="#cbd5e1"/>
            <circle cx="30" cy="22" r="6" fill="#dc2626"/>
            <text x="30" y="25" text-anchor="middle" fill="white" font-size="8" font-weight="700">%</text>
          </svg>
        </div>
        <div class="app-info">
          <h2 class="app-name">Price Compare</h2>
          <p class="app-desc">Compare prices between Makro and Lotus's — find the best deal</p>
        </div>
        <span class="app-arrow">&rarr;</span>
      </NuxtLink>

      <NuxtLink to="/makro-search" class="app-card">
        <div class="app-icon app-icon--makro-search">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="32" height="32" rx="6" fill="#0055a5"/>
            <circle cx="18" cy="18" r="7" fill="none" stroke="white" stroke-width="2.5"/>
            <line x1="23" y1="23" x2="30" y2="30" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="app-info">
          <h2 class="app-name">Makro Search</h2>
          <p class="app-desc">Search Makro Pro products with per-unit pricing</p>
        </div>
        <span class="app-arrow">&rarr;</span>
      </NuxtLink>

      <NuxtLink to="/lotus-search" class="app-card">
        <div class="app-icon app-icon--lotus-search">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="32" height="32" rx="6" fill="#dc2626"/>
            <circle cx="18" cy="18" r="7" fill="none" stroke="white" stroke-width="2.5"/>
            <line x1="23" y1="23" x2="30" y2="30" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="app-info">
          <h2 class="app-name">Lotus's Search</h2>
          <p class="app-desc">Search Lotus's products and prices</p>
        </div>
        <span class="app-arrow">&rarr;</span>
      </NuxtLink>

    </div>

    <footer class="home-footer">
      <p>Built with Nuxt 4 &middot; Vue 3 &middot; Nitro</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { isDark, toggleTheme } = useTheme()
</script>

<style scoped>
.home {
  max-width: 720px;
  margin: 0 auto;
  padding: 1.5rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.home-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.home-brand {
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: 0.12em;
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
  transition: background 0.2s;
}

.theme-toggle:hover {
  background: var(--bg-btn-secondary-hover);
}

.home-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.home-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.02em;
}

.home-gradient {
  background: linear-gradient(135deg, #6366f1, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.home-desc {
  color: var(--text-muted);
  margin: 0.4rem 0 0;
  font-size: 1rem;
}

/* App grid */
.app-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
}

.app-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border-card-default);
  border-radius: 16px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.app-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: #6366f1;
}

.app-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
}

.app-icon svg {
  width: 100%;
  height: 100%;
}

.app-icon--monitor { background: #0f172a; }
.app-icon--office { background: #fef3c7; }
.app-icon--makro { background: #dbeafe; }

.app-icon--makro-search { background: #dbeafe; }
.app-icon--lotus-search { background: #fee2e2; }

[data-theme="dark"] .app-icon--office { background: #422006; }
[data-theme="dark"] .app-icon--makro { background: #1e3a5f; }
[data-theme="dark"] .app-icon--makro-search { background: #1e3a5f; }
[data-theme="dark"] .app-icon--lotus-search { background: #450a0a; }

.app-info {
  flex: 1;
  min-width: 0;
}

.app-name {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0 0 0.2rem;
}

.app-desc {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.4;
}

.app-arrow {
  font-size: 1.1rem;
  color: var(--text-muted);
  flex-shrink: 0;
  transition: transform 0.2s;
}

.app-card:hover .app-arrow {
  transform: translateX(4px);
  color: #6366f1;
}

/* Footer */
.home-footer {
  text-align: center;
  padding: 2rem 0 1rem;
  margin-top: auto;
  border-top: 1px solid var(--border-card-default);
}

.home-footer p {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-muted);
}

@media (max-width: 480px) {
  .home-title {
    font-size: 2rem;
  }

  .app-card {
    padding: 1rem 1.25rem;
  }
}
</style>
