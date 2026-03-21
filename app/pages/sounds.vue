<template>
  <div class="sounds">
    <nav class="sounds-nav">
      <NuxtLink to="/" class="back-link">&larr; Home</NuxtLink>
    </nav>
    <h1>Oracle Wake Sounds</h1>
    <p class="sounds-desc">Click to preview each Oracle's wake-up sound effect</p>

    <div class="sound-grid">
      <button class="sound-btn sound-btn--peter" @click="playBell">
        <span class="sound-icon">&#128276;</span>
        <span class="sound-name">Peter — Bell Ding</span>
        <span class="sound-detail">1200Hz sine + 2400Hz harmonic</span>
      </button>

      <button class="sound-btn sound-btn--tony" @click="playSplash">
        <span class="sound-icon">&#127754;</span>
        <span class="sound-name">Tony — Wave Splash</span>
        <span class="sound-detail">Noise burst + bandpass sweep</span>
      </button>

      <button class="sound-btn sound-btn--generic" @click="playChime">
        <span class="sound-icon">&#127925;</span>
        <span class="sound-name">Generic — Two-tone Chime</span>
        <span class="sound-detail">660Hz → 880Hz sine</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
function getCtx() { return new AudioContext() }

function playBell() {
  const ctx = getCtx()
  const t = ctx.currentTime
  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(1200, t)
  osc.frequency.exponentialRampToValueAtTime(800, t + 0.15)
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.3, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5)
  osc.connect(gain); gain.connect(ctx.destination)
  osc.start(t); osc.stop(t + 0.5)

  const osc2 = ctx.createOscillator()
  osc2.type = 'sine'
  osc2.frequency.setValueAtTime(2400, t)
  osc2.frequency.exponentialRampToValueAtTime(1600, t + 0.1)
  const gain2 = ctx.createGain()
  gain2.gain.setValueAtTime(0.12, t)
  gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.3)
  osc2.connect(gain2); gain2.connect(ctx.destination)
  osc2.start(t); osc2.stop(t + 0.3)
  setTimeout(() => ctx.close(), 600)
}

function playSplash() {
  const ctx = getCtx()
  const t = ctx.currentTime
  const bufferSize = ctx.sampleRate * 0.4
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2)
  }
  const noise = ctx.createBufferSource()
  noise.buffer = buffer
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(2000, t)
  filter.frequency.exponentialRampToValueAtTime(400, t + 0.35)
  filter.Q.setValueAtTime(2, t)
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.25, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
  noise.connect(filter); filter.connect(gain); gain.connect(ctx.destination)
  noise.start(t)

  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(500, t)
  osc.frequency.exponentialRampToValueAtTime(250, t + 0.3)
  const oscGain = ctx.createGain()
  oscGain.gain.setValueAtTime(0.15, t)
  oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35)
  osc.connect(oscGain); oscGain.connect(ctx.destination)
  osc.start(t); osc.stop(t + 0.35)
  setTimeout(() => ctx.close(), 500)
}

function playChime() {
  const ctx = getCtx()
  const t = ctx.currentTime
  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(660, t)
  osc.frequency.setValueAtTime(880, t + 0.12)
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.2, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
  osc.connect(gain); gain.connect(ctx.destination)
  osc.start(t); osc.stop(t + 0.4)
  setTimeout(() => ctx.close(), 500)
}
</script>

<style scoped>
.sounds {
  max-width: 500px;
  margin: 0 auto;
  padding: 1.5rem;
}

.sounds-nav {
  margin-bottom: 2rem;
}

.back-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.85rem;
}

h1 {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0 0 0.25rem;
}

.sounds-desc {
  color: var(--text-muted);
  font-size: 0.85rem;
  margin: 0 0 2rem;
}

.sound-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sound-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 1.25rem;
  border: 1px solid var(--border-card-default);
  border-radius: 14px;
  background: var(--bg-card);
  cursor: pointer;
  transition: all 0.25s;
}

.sound-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.sound-btn:active {
  transform: scale(0.97);
}

.sound-icon { font-size: 2rem; }
.sound-name { font-size: 0.9rem; font-weight: 600; color: var(--text-primary); }
.sound-detail { font-size: 0.7rem; color: var(--text-muted); }
</style>
