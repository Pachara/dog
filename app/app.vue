<template>
  <div class="app">
    <header class="header">
      <h1>DOG</h1>
      <p class="subtitle">URL uptime monitor</p>
      <button class="theme-toggle" @click="toggleTheme" :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
        {{ isDark ? '&#9788;' : '&#9790;' }}
      </button>
    </header>
    <main class="main">
      <AddUrlForm />
      <div class="toolbar">
        <span class="count">{{ entries.length }} URL{{ entries.length !== 1 ? 's' : '' }} monitored</span>
        <button class="btn btn-secondary" :disabled="isChecking || entries.length === 0" @click="checkAll">
          {{ isChecking ? 'Checking...' : 'Check All Now' }}
        </button>
      </div>
      <MonitorList />
    </main>
  </div>
</template>

<script setup lang="ts">
const { entries, isChecking, loadFromStorage, checkAll, startPolling, stopPolling } = useMonitor()
const { isDark, loadTheme, toggleTheme } = useTheme()

onMounted(() => {
  loadTheme()
  loadFromStorage()
  if (entries.value.length > 0) {
    checkAll()
  }
  startPolling()
})

onUnmounted(() => {
  stopPolling()
})
</script>

<style>
*, *::before, *::after {
  box-sizing: border-box;
}

:root,
[data-theme="light"] {
  --bg-body: #f5f7fa;
  --text-primary: #1a1a2e;
  --text-secondary: #6b7280;
  --text-muted: #9ca3af;
  --bg-card: #ffffff;
  --bg-input: #ffffff;
  --border-input: #d1d5db;
  --bg-btn-secondary: #e5e7eb;
  --text-btn-secondary: #374151;
  --bg-btn-secondary-hover: #d1d5db;
  --border-card-default: #d1d5db;
}

[data-theme="dark"] {
  --bg-body: #0f172a;
  --text-primary: #e2e8f0;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --bg-card: #1e293b;
  --bg-input: #1e293b;
  --border-input: #334155;
  --bg-btn-secondary: #334155;
  --text-btn-secondary: #cbd5e1;
  --bg-btn-secondary-hover: #475569;
  --border-card-default: #334155;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg-body);
  color: var(--text-primary);
  line-height: 1.5;
  transition: background 0.3s, color 0.3s;
}

.app {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
}

.header h1 {
  font-size: 2rem;
  margin: 0;
  letter-spacing: 0.1em;
}

.subtitle {
  color: var(--text-secondary);
  margin: 0.25rem 0 0;
  font-size: 0.9rem;
}

.theme-toggle {
  position: absolute;
  top: 0;
  right: 0;
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

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1.5rem 0 1rem;
}

.count {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.btn {
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #2563eb;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
}

.btn-secondary {
  background: var(--bg-btn-secondary);
  color: var(--text-btn-secondary);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--bg-btn-secondary-hover);
}

.btn-danger {
  background: transparent;
  color: var(--text-muted);
  padding: 0.25rem 0.5rem;
  font-size: 1.2rem;
}

.btn-danger:hover:not(:disabled) {
  color: #ef4444;
}
</style>
