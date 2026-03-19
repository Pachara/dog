<template>
  <div class="retro-list-wrapper">
    <div class="retro-marquee">
      <marquee behavior="scroll" direction="left" scrollamount="3">
        &#9733; DOG URL Monitor v1.0 &#9733; Monitoring {{ entries.length }} site{{ entries.length !== 1 ? 's' : '' }} &#9733; Best viewed in Netscape Navigator &#9733; You are visitor #{{ visitorCount }} &#9733;
      </marquee>
    </div>
    <table v-if="entries.length > 0" class="retro-table">
      <thead>
        <tr>
          <th class="retro-th">Status</th>
          <th class="retro-th">URL</th>
          <th class="retro-th">Speed</th>
          <th class="retro-th">Checked</th>
          <th class="retro-th">Del</th>
        </tr>
      </thead>
      <TransitionGroup tag="tbody" name="retro">
        <DesignsRetro90MonitorCard v-for="entry in entries" :key="entry.id" :entry="entry" />
      </TransitionGroup>
    </table>
    <div v-else class="retro-empty">
      <p>&#128679; UNDER CONSTRUCTION &#128679;</p>
      <p class="retro-empty-sub">No URLs added yet! Use the form above.</p>
      <p class="retro-guestbook">~ Sign my guestbook ~</p>
    </div>
    <div class="retro-footer">
      <span class="retro-counter-box">
        Hits: <span class="retro-hit-counter">{{ String(entries.length).padStart(6, '0') }}</span>
      </span>
      <span class="retro-made-with">Made with &#10084;&#65039; and &lt;TABLE&gt; tags</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const { entries } = useMonitor()
const visitorCount = ref(0)

onMounted(() => {
  visitorCount.value = Math.floor(Math.random() * 99999) + 1337
})
</script>

<style scoped>
.retro-list-wrapper {
  border: 3px outset #c0c0c0;
  background: #000080;
  padding: 0.5rem;
}

.retro-marquee {
  background: #000000;
  color: #00ff00;
  font-family: 'Comic Sans MS', 'Chalkboard SE', cursive;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.3rem 0;
  border: 2px inset #333333;
  margin-bottom: 0.5rem;
}

.retro-table {
  width: 100%;
  border-collapse: collapse;
  border: 3px ridge #00ff00;
  background: #001a00;
}

.retro-th {
  background: linear-gradient(180deg, #006600, #003300);
  color: #00ff00;
  font-family: 'Comic Sans MS', 'Chalkboard SE', cursive;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.4rem 0.6rem;
  border: 2px ridge #00ff00;
  text-shadow: 0 0 8px #00ff00;
  letter-spacing: 0.05em;
}

.retro-empty {
  text-align: center;
  padding: 2rem 1rem;
  font-family: 'Comic Sans MS', 'Chalkboard SE', cursive;
  color: #ffff00;
}

.retro-empty p:first-child {
  font-size: 1.3rem;
  font-weight: 700;
  animation: blink90 1s step-end infinite;
}

.retro-empty-sub {
  color: #00ffff;
  font-size: 0.9rem;
}

.retro-guestbook {
  color: #ff69b4;
  font-size: 0.8rem;
  font-style: italic;
  margin-top: 1rem !important;
}

.retro-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  padding: 0.3rem 0.4rem;
  font-family: 'Comic Sans MS', 'Chalkboard SE', cursive;
  font-size: 0.7rem;
}

.retro-counter-box {
  color: #ffff00;
}

.retro-hit-counter {
  font-family: 'Courier New', monospace;
  background: #000000;
  color: #00ff00;
  padding: 0.1rem 0.5rem;
  border: 2px inset #333333;
  letter-spacing: 0.15em;
  font-weight: 700;
}

.retro-made-with {
  color: #ff69b4;
  font-style: italic;
}

.retro-enter-active,
.retro-leave-active {
  transition: all 0.3s ease;
}

.retro-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}

.retro-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@keyframes blink90 {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
