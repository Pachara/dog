<template>
  <form class="modern-form" @submit.prevent="handleSubmit">
    <div class="input-wrapper">
      <span class="input-icon">+</span>
      <input
        v-model="newUrl"
        type="text"
        class="modern-input"
        placeholder="Add a URL to watch..."
        :disabled="adding"
      />
    </div>
    <button type="submit" class="modern-submit" :disabled="!newUrl.trim() || adding">
      {{ adding ? 'Adding...' : 'Monitor' }}
    </button>
  </form>
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
.modern-form {
  display: flex;
  gap: 0.75rem;
  align-items: stretch;
}

.input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 0.8rem;
  font-size: 1.1rem;
  font-weight: 300;
  color: var(--text-muted);
  pointer-events: none;
}

.modern-input {
  width: 100%;
  padding: 0.75rem 0.8rem 0.75rem 2.2rem;
  border: 1px solid var(--border-input);
  border-radius: 12px;
  font-size: 0.9rem;
  outline: none;
  background: var(--bg-input);
  color: var(--text-primary);
  transition: all 0.2s;
}

.modern-input::placeholder {
  color: var(--text-muted);
}

.modern-input:focus {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
}

.modern-submit {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  color: white;
  transition: all 0.2s;
  white-space: nowrap;
}

.modern-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.modern-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
