<template>
  <div class="cd-form-card">
    <form class="cd-form" @submit.prevent="handleSubmit">
      <div class="cd-input-group">
        <span class="cd-input-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </span>
        <input
          v-model="newUrl"
          type="text"
          class="cd-input"
          placeholder="Enter a URL to monitor..."
          :disabled="adding"
        />
      </div>
      <button type="submit" class="cd-submit" :disabled="!newUrl.trim() || adding">
        <template v-if="adding">
          <span class="cd-spinner" />
        </template>
        <template v-else>
          Add URL
        </template>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
const { addUrl } = useMonitor()
const newUrl = ref('')
const adding = ref(false)

async function handleSubmit() {
  if (!newUrl.value.trim()) return
  adding.value = true
  await addUrl(newUrl.value)
  newUrl.value = ''
  adding.value = false
}
</script>

<style scoped>
.cd-form-card {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.06),
    0 4px 12px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.3s ease;
}

.cd-form-card:focus-within {
  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.08),
    0 8px 24px rgba(0, 0, 0, 0.06);
}

.cd-form {
  display: flex;
  gap: 0.75rem;
  align-items: stretch;
}

.cd-input-group {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.cd-input-icon {
  position: absolute;
  left: 0.85rem;
  color: var(--text-muted);
  display: flex;
  pointer-events: none;
  transition: color 0.3s ease;
}

.cd-input-group:focus-within .cd-input-icon {
  color: #6366f1;
}

.cd-input {
  width: 100%;
  padding: 0.75rem 0.85rem 0.75rem 2.5rem;
  border: 1.5px solid var(--border-input);
  border-radius: 12px;
  font-size: 0.9rem;
  outline: none;
  background: var(--bg-input);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.cd-input::placeholder {
  color: var(--text-muted);
}

.cd-input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
}

.cd-submit {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  background: #6366f1;
  color: white;
  transition: all 0.3s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 90px;
}

.cd-submit:hover:not(:disabled) {
  background: #4f46e5;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.cd-submit:active:not(:disabled) {
  transform: translateY(0);
}

.cd-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cd-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: cd-spin 0.6s linear infinite;
}

@keyframes cd-spin {
  to { transform: rotate(360deg); }
}
</style>
