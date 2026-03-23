<template>
  <form class="glass-form" @submit.prevent="handleSubmit">
    <div class="input-wrapper">
      <span class="input-icon">+</span>
      <input
        v-model="newUrl"
        type="text"
        class="glass-input"
        placeholder="Add a URL to watch..."
        :disabled="adding"
      />
    </div>
    <button type="submit" class="glass-submit" :disabled="!newUrl.trim() || adding">
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
.glass-form {
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
  color: rgba(196, 181, 253, 0.6);
  pointer-events: none;
}

.glass-input {
  width: 100%;
  padding: 0.75rem 0.8rem 0.75rem 2.2rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  font-size: 0.9rem;
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.glass-input::placeholder {
  color: rgba(196, 181, 253, 0.4);
}

.glass-input:focus {
  border-color: rgba(139, 92, 246, 0.5);
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.15), inset 0 0 20px rgba(139, 92, 246, 0.05);
  background: rgba(255, 255, 255, 0.12);
}

.glass-submit {
  padding: 0.75rem 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(99, 102, 241, 0.4));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: white;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.glass-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3);
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.6), rgba(99, 102, 241, 0.6));
  border-color: rgba(255, 255, 255, 0.3);
}

.glass-submit:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
