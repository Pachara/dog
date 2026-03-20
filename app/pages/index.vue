<template>
  <div class="landing">
    <!-- Nav -->
    <nav class="nav">
      <span class="nav-brand">DOG</span>
      <div class="nav-right">
        <NuxtLink to="/office" class="nav-link">Oracle Office</NuxtLink>
        <button class="theme-toggle" @click="toggleTheme" :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
          {{ isDark ? '&#9788;' : '&#9790;' }}
        </button>
      </div>
    </nav>

    <!-- Hero -->
    <section class="hero">
      <div class="hero-glow" />
      <div class="hero-content">
        <div class="hero-badge">URL Uptime Monitor</div>
        <h1 class="hero-title">
          Keep your sites<br />
          <span class="hero-gradient">alive.</span>
        </h1>
        <p class="hero-desc">
          Monitor any URL in real-time. Get instant status checks, response times,
          and uptime visibility &mdash; all from one clean dashboard.
        </p>
        <NuxtLink to="/monitor" class="hero-cta">
          Start Monitoring &rarr;
        </NuxtLink>
      </div>
      <!-- Animated status cards -->
      <div class="hero-visual">
        <div class="hero-card hero-card-1">
          <span class="hc-dot hc-dot--up" />
          <span class="hc-url">github.com</span>
          <span class="hc-time">142ms</span>
        </div>
        <div class="hero-card hero-card-2">
          <span class="hc-dot hc-dot--up" />
          <span class="hc-url">google.com</span>
          <span class="hc-time">38ms</span>
        </div>
        <div class="hero-card hero-card-3">
          <span class="hc-dot hc-dot--down" />
          <span class="hc-url">broken-site.io</span>
          <span class="hc-time">Timeout</span>
        </div>
        <div class="hero-card hero-card-4">
          <span class="hc-dot hc-dot--up" />
          <span class="hc-url">nuxt.com</span>
          <span class="hc-time">89ms</span>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="features">
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">&#9889;</div>
          <h3 class="feature-title">Real-Time Checks</h3>
          <p class="feature-desc">
            Server-side HEAD requests with automatic GET fallback.
            10-second timeout. Results in milliseconds.
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">&#9680;</div>
          <h3 class="feature-title">Auto Polling</h3>
          <p class="feature-desc">
            URLs are checked every 30 seconds automatically.
            Status badges update live &mdash; no manual refresh needed.
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">&#127912;</div>
          <h3 class="feature-title">Multiple Designs</h3>
          <p class="feature-desc">
            Switch between Classic, Modern, and Retro 90s themes.
            Each design is a completely different visual experience.
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">&#9790;</div>
          <h3 class="feature-title">Dark Mode</h3>
          <p class="feature-desc">
            Full dark and light theme support across every component.
            Your preference is saved and remembered.
          </p>
        </div>
      </div>
    </section>

    <!-- Bottom CTA -->
    <section class="bottom-cta">
      <h2 class="cta-title">Ready to start?</h2>
      <p class="cta-desc">Add your first URL and see results instantly.</p>
      <NuxtLink to="/monitor" class="hero-cta">
        Open Dashboard &rarr;
      </NuxtLink>
    </section>

    <!-- Footer -->
    <footer class="landing-footer">
      <p>Built with Nuxt 4 &middot; Vue 3 &middot; Nitro</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { isDark, toggleTheme } = useTheme()
</script>

<style scoped>
.landing {
  min-height: 100vh;
  overflow-x: hidden;
}

/* --- Nav --- */
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 960px;
  margin: 0 auto;
  padding: 1.25rem 1.5rem;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nav-link {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s;
}

.nav-link:hover {
  color: var(--text-primary);
}

.nav-brand {
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: 0.12em;
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
  transition: background 0.2s;
  color: var(--text-primary);
}

.theme-toggle:hover {
  background: var(--bg-btn-secondary-hover);
}

/* --- Hero --- */
.hero {
  position: relative;
  max-width: 960px;
  margin: 0 auto;
  padding: 4rem 1.5rem 5rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.hero-glow {
  position: absolute;
  top: -20%;
  left: 20%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  animation: glow-drift 8s ease-in-out infinite alternate;
}

@keyframes glow-drift {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(40px, 30px) scale(1.15); }
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  background: var(--bg-btn-secondary);
  color: var(--text-secondary);
  margin-bottom: 1.25rem;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.1;
  margin: 0 0 1.25rem;
  letter-spacing: -0.02em;
}

.hero-gradient {
  background: linear-gradient(135deg, #6366f1, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-desc {
  font-size: 1.05rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin: 0 0 2rem;
  max-width: 420px;
}

.hero-cta {
  display: inline-block;
  padding: 0.8rem 2rem;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  border-radius: 10px;
  transition: all 0.2s;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
}

.hero-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.45);
}

/* --- Hero visual (floating cards) --- */
.hero-visual {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.hero-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--bg-card);
  border: 1px solid var(--border-card-default);
  border-radius: 12px;
  padding: 0.85rem 1.1rem;
  animation: card-float 4s ease-in-out infinite alternate;
  transition: background 0.3s, border-color 0.3s;
}

.hero-card-1 { animation-delay: 0s; }
.hero-card-2 { animation-delay: 0.5s; margin-left: 1.5rem; }
.hero-card-3 { animation-delay: 1s; margin-left: 0.5rem; }
.hero-card-4 { animation-delay: 1.5s; margin-left: 2rem; }

@keyframes card-float {
  0% { transform: translateY(0); }
  100% { transform: translateY(-6px); }
}

.hc-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.hc-dot--up { background: #22c55e; box-shadow: 0 0 6px rgba(34, 197, 94, 0.5); }
.hc-dot--down { background: #ef4444; box-shadow: 0 0 6px rgba(239, 68, 68, 0.5); animation: dot-pulse 1.5s infinite; }

@keyframes dot-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.hc-url {
  flex: 1;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-primary);
}

.hc-time {
  font-size: 0.75rem;
  font-weight: 600;
  font-family: 'SF Mono', 'Fira Code', monospace;
  color: var(--text-muted);
}

/* --- Features --- */
.features {
  max-width: 960px;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.feature-card {
  background: var(--bg-card);
  border: 1px solid var(--border-card-default);
  border-radius: 14px;
  padding: 1.5rem;
  transition: all 0.25s;
}

.feature-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.feature-icon {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
}

.feature-title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 0.4rem;
}

.feature-desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

/* --- Bottom CTA --- */
.bottom-cta {
  text-align: center;
  padding: 3rem 1.5rem 4rem;
  max-width: 960px;
  margin: 0 auto;
}

.cta-title {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0 0 0.5rem;
}

.cta-desc {
  color: var(--text-secondary);
  margin: 0 0 1.5rem;
  font-size: 1rem;
}

/* --- Footer --- */
.landing-footer {
  text-align: center;
  padding: 2rem 1rem;
  border-top: 1px solid var(--border-card-default);
  max-width: 960px;
  margin: 0 auto;
}

.landing-footer p {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* --- Responsive --- */
@media (max-width: 680px) {
  .hero {
    grid-template-columns: 1fr;
    padding: 2.5rem 1.25rem 3rem;
    gap: 2.5rem;
  }

  .hero-title {
    font-size: 2.2rem;
  }

  .hero-desc {
    font-size: 0.95rem;
  }

  .hero-card-2 { margin-left: 0; }
  .hero-card-3 { margin-left: 0; }
  .hero-card-4 { margin-left: 0; }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
