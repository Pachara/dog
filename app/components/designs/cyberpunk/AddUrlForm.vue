<template>
  <form class="cyber-form" @submit.prevent="handleSubmit">
    <div class="input-wrapper">
      <span class="input-prefix">://</span>
      <input
        v-model="newUrl"
        type="text"
        class="cyber-input"
        placeholder="JACK IN URL..."
        :disabled="adding"
        spellcheck="false"
        autocomplete="off"
      />
      <span class="input-scan" />
    </div>
    <button type="submit" class="cyber-submit" :disabled="!newUrl.trim() || adding">
      <span class="btn-text">{{ adding ? 'SYNC...' : 'JACK IN' }}</span>
      <span class="btn-corner btn-corner--tl" />
      <span class="btn-corner btn-corner--br" />
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
.cyber-form {
  display: flex;
  gap: 0.5rem;
  align-items: stretch;
}

.input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(10, 10, 15, 0.9);
  border: 1px solid #05d9e8;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
}

.input-prefix {
  padding-left: 0.8rem;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.8rem;
  font-weight: 700;
  color: #05d9e8;
  text-shadow: 0 0 8px rgba(5, 217, 232, 0.5);
  white-space: nowrap;
}

.input-scan {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #05d9e8, transparent);
  animation: scan 3s ease-in-out infinite;
}

@keyframes scan {
  0% { left: 0; width: 0; }
  50% { left: 0; width: 100%; }
  100% { left: 100%; width: 0; }
}

.cyber-input {
  width: 100%;
  padding: 0.7rem 0.8rem 0.7rem 0.4rem;
  border: none;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.85rem;
  outline: none;
  background: transparent;
  color: #e0e0ff;
  caret-color: #ff2a6d;
  letter-spacing: 0.05em;
}

.cyber-input::placeholder {
  color: #2a2a4a;
  letter-spacing: 0.1em;
}

.cyber-input:focus ~ .input-scan {
  background: linear-gradient(90deg, transparent, #ff2a6d, transparent);
}

.cyber-submit {
  position: relative;
  padding: 0.7rem 1.5rem;
  border: 1px solid #ff2a6d;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.8rem;
  font-weight: 900;
  cursor: pointer;
  background: rgba(255, 42, 109, 0.1);
  color: #ff2a6d;
  text-shadow: 0 0 8px rgba(255, 42, 109, 0.5);
  letter-spacing: 0.15em;
  transition: all 0.2s;
  white-space: nowrap;
  clip-path: polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
}

.cyber-submit:hover:not(:disabled) {
  background: rgba(255, 42, 109, 0.25);
  box-shadow: 0 0 20px rgba(255, 42, 109, 0.3), inset 0 0 20px rgba(255, 42, 109, 0.1);
}

.cyber-submit:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.btn-corner {
  position: absolute;
  width: 6px;
  height: 6px;
  border: 1px solid #ff2a6d;
}

.btn-corner--tl {
  top: 2px;
  left: 10px;
  border-right: none;
  border-bottom: none;
}

.btn-corner--br {
  bottom: 2px;
  right: 10px;
  border-left: none;
  border-top: none;
}
</style>
