<template>
  <form class="terminal-form" @submit.prevent="handleSubmit">
    <div class="input-line">
      <span class="prompt">{{ prompt }}</span>
      <input
        v-model="newUrl"
        type="text"
        class="terminal-input"
        placeholder="enter url..."
        :disabled="adding"
        spellcheck="false"
        autocomplete="off"
      />
    </div>
    <button type="submit" class="terminal-submit" :disabled="!newUrl.trim() || adding">
      {{ adding ? 'EXEC...' : 'RUN' }}
    </button>
  </form>
</template>

<script setup lang="ts">
const { addUrl } = useMonitor()
const newUrl = ref('')
const adding = ref(false)

const prompt = computed(() => adding.value ? '...' : '>_')

async function handleSubmit() {
  if (!newUrl.value.trim()) return
  adding.value = true
  await addUrl(newUrl.value)
  newUrl.value = ''
  adding.value = false
}
</script>

<style scoped>
.terminal-form {
  display: flex;
  gap: 0.5rem;
  align-items: stretch;
  background: #0a0a0a;
  border: 1px solid #00ff41;
  border-radius: 4px;
  padding: 0.5rem;
  box-shadow: 0 0 8px rgba(0, 255, 65, 0.15);
}

.input-line {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.prompt {
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.9rem;
  font-weight: 700;
  color: #00ff41;
  text-shadow: 0 0 8px rgba(0, 255, 65, 0.6);
  white-space: nowrap;
  animation: cursor-blink 1.2s step-end infinite;
}

@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.terminal-input {
  width: 100%;
  padding: 0.4rem 0;
  border: none;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.85rem;
  outline: none;
  background: transparent;
  color: #00ff41;
  caret-color: #00ff41;
}

.terminal-input::placeholder {
  color: #1a5c2a;
}

.terminal-submit {
  padding: 0.4rem 1rem;
  border: 1px solid #00ff41;
  border-radius: 2px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  background: rgba(0, 255, 65, 0.1);
  color: #00ff41;
  text-shadow: 0 0 6px rgba(0, 255, 65, 0.5);
  transition: all 0.15s;
  white-space: nowrap;
  letter-spacing: 0.1em;
}

.terminal-submit:hover:not(:disabled) {
  background: rgba(0, 255, 65, 0.2);
  box-shadow: 0 0 12px rgba(0, 255, 65, 0.3);
}

.terminal-submit:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
