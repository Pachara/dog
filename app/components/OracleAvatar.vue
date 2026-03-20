<template>
  <div class="avatar-scene" :class="{ 'avatar-scene--offline': !isWorking }">
    <!-- Peter: Manager with glasses and clipboard -->
    <svg v-if="character === 'peter'" class="avatar-svg" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <!-- Body -->
      <rect class="av-body" x="24" y="42" width="32" height="26" rx="4" fill="#3b82f6" />
      <!-- Tie -->
      <polygon class="av-tie" points="40,44 37,52 40,50 43,52" fill="#ef4444" />
      <!-- Neck -->
      <rect x="36" y="38" width="8" height="6" rx="2" fill="#fbbf24" />
      <!-- Head -->
      <circle class="av-head" cx="40" cy="28" r="14" fill="#fcd34d" />
      <!-- Hair -->
      <path d="M26,24 Q28,14 40,14 Q52,14 54,24" fill="#92400e" />
      <!-- Glasses frame -->
      <rect class="av-glasses" x="29" y="24" width="9" height="7" rx="2" fill="none" stroke="#1e293b" stroke-width="1.5" />
      <rect class="av-glasses" x="42" y="24" width="9" height="7" rx="2" fill="none" stroke="#1e293b" stroke-width="1.5" />
      <line x1="38" y1="27" x2="42" y2="27" stroke="#1e293b" stroke-width="1.5" />
      <!-- Eyes (working: open, sleeping: closed) -->
      <g v-if="isWorking">
        <circle class="av-eye av-eye--blink" cx="33.5" cy="27.5" r="1.8" fill="#1e293b" />
        <circle class="av-eye av-eye--blink" cx="46.5" cy="27.5" r="1.8" fill="#1e293b" />
      </g>
      <g v-else>
        <line x1="31" y1="28" x2="36" y2="28" stroke="#1e293b" stroke-width="1.5" stroke-linecap="round" />
        <line x1="44" y1="28" x2="49" y2="28" stroke="#1e293b" stroke-width="1.5" stroke-linecap="round" />
      </g>
      <!-- Mouth -->
      <path v-if="isWorking" d="M37,33 Q40,36 43,33" fill="none" stroke="#92400e" stroke-width="1" stroke-linecap="round" />
      <line v-else x1="37" y1="34" x2="43" y2="34" stroke="#92400e" stroke-width="1" stroke-linecap="round" />
      <!-- Clipboard (working: typing motion) -->
      <g class="av-clipboard">
        <rect x="54" y="44" width="12" height="16" rx="1.5" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1" />
        <rect x="56" y="42" width="8" height="3" rx="1" fill="#94a3b8" />
        <line x1="56" y1="49" x2="64" y2="49" stroke="#cbd5e1" stroke-width="1" />
        <line x1="56" y1="52" x2="62" y2="52" stroke="#cbd5e1" stroke-width="1" />
        <line x1="56" y1="55" x2="63" y2="55" stroke="#cbd5e1" stroke-width="1" />
      </g>
    </svg>

    <!-- Tony: Surfer/ocean wave guy -->
    <svg v-else-if="character === 'tony'" class="avatar-svg" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <!-- Body -->
      <rect class="av-body" x="24" y="42" width="32" height="26" rx="4" fill="#0891b2" />
      <!-- Wave pattern on shirt -->
      <path d="M24,54 Q32,50 40,54 Q48,58 56,54" fill="none" stroke="#22d3ee" stroke-width="1.5" opacity="0.6" />
      <!-- Neck -->
      <rect x="36" y="38" width="8" height="6" rx="2" fill="#fbbf24" />
      <!-- Head -->
      <circle class="av-head" cx="40" cy="28" r="14" fill="#fcd34d" />
      <!-- Wavy hair -->
      <path d="M26,24 Q28,12 36,14 Q40,8 44,14 Q52,12 54,24" fill="#1e293b" />
      <path d="M26,22 Q30,18 34,22" fill="#1e293b" />
      <!-- Sunglasses: on eyes when working, pushed up to forehead when sleeping -->
      <g v-if="isWorking">
        <path class="av-shades" d="M29,25 L29,29 Q29,31 31,31 L37,31 Q39,31 39,29 L39,25 Z" fill="#334155" />
        <path class="av-shades" d="M41,25 L41,29 Q41,31 43,31 L49,31 Q51,31 51,29 L51,25 Z" fill="#334155" />
        <line x1="39" y1="27" x2="41" y2="27" stroke="#334155" stroke-width="1.5" />
        <!-- Eyes behind shades (open, blinking) -->
        <circle class="av-eye av-eye--blink" cx="34" cy="28" r="1.2" fill="#06b6d4" />
        <circle class="av-eye av-eye--blink" cx="46" cy="28" r="1.2" fill="#06b6d4" />
      </g>
      <g v-else>
        <!-- Shades pushed up to forehead -->
        <path d="M30,16 L30,20 Q30,21.5 31.5,21.5 L37,21.5 Q38.5,21.5 38.5,20 L38.5,16 Z" fill="#334155" opacity="0.7" />
        <path d="M41.5,16 L41.5,20 Q41.5,21.5 43,21.5 L48.5,21.5 Q50,21.5 50,20 L50,16 Z" fill="#334155" opacity="0.7" />
        <line x1="38.5" y1="18" x2="41.5" y2="18" stroke="#334155" stroke-width="1.2" opacity="0.7" />
        <!-- Closed eyes (visible) -->
        <line x1="31" y1="27" x2="37" y2="27" stroke="#1e293b" stroke-width="1.5" stroke-linecap="round" />
        <line x1="43" y1="27" x2="49" y2="27" stroke="#1e293b" stroke-width="1.5" stroke-linecap="round" />
        <!-- Sleepy eyelashes -->
        <line x1="31" y1="27" x2="30" y2="25.5" stroke="#1e293b" stroke-width="0.8" stroke-linecap="round" />
        <line x1="37" y1="27" x2="38" y2="25.5" stroke="#1e293b" stroke-width="0.8" stroke-linecap="round" />
        <line x1="43" y1="27" x2="42" y2="25.5" stroke="#1e293b" stroke-width="0.8" stroke-linecap="round" />
        <line x1="49" y1="27" x2="50" y2="25.5" stroke="#1e293b" stroke-width="0.8" stroke-linecap="round" />
      </g>
      <!-- Mouth -->
      <path v-if="isWorking" d="M35,34 Q40,38 45,34" fill="none" stroke="#92400e" stroke-width="1.2" stroke-linecap="round" />
      <line v-else x1="36" y1="35" x2="44" y2="35" stroke="#92400e" stroke-width="1" stroke-linecap="round" />
      <!-- Surfboard -->
      <g class="av-surfboard">
        <ellipse cx="16" cy="52" rx="4" ry="18" fill="#f97316" transform="rotate(-15, 16, 52)" />
        <line x1="16" y1="36" x2="16" y2="68" stroke="#fb923c" stroke-width="1" transform="rotate(-15, 16, 52)" />
      </g>
      <!-- Wave under (working only) -->
      <path v-if="isWorking" class="av-wave" d="M4,72 Q12,66 20,72 Q28,78 36,72 Q44,66 52,72 Q60,78 68,72 Q76,66 84,72" fill="none" stroke="#22d3ee" stroke-width="2" opacity="0.4" />
    </svg>

    <!-- Fallback: generic Oracle -->
    <svg v-else class="avatar-svg" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <rect class="av-body" x="24" y="42" width="32" height="26" rx="4" fill="#8b5cf6" />
      <rect x="36" y="38" width="8" height="6" rx="2" fill="#fbbf24" />
      <circle class="av-head" cx="40" cy="28" r="14" fill="#fcd34d" />
      <path d="M26,24 Q28,14 40,14 Q52,14 54,24" fill="#6b7280" />
      <g v-if="isWorking">
        <circle class="av-eye av-eye--blink" cx="34" cy="27" r="1.8" fill="#1e293b" />
        <circle class="av-eye av-eye--blink" cx="46" cy="27" r="1.8" fill="#1e293b" />
      </g>
      <g v-else>
        <line x1="31.5" y1="28" x2="36.5" y2="28" stroke="#1e293b" stroke-width="1.5" stroke-linecap="round" />
        <line x1="43.5" y1="28" x2="48.5" y2="28" stroke="#1e293b" stroke-width="1.5" stroke-linecap="round" />
      </g>
      <path v-if="isWorking" d="M37,33 Q40,36 43,33" fill="none" stroke="#92400e" stroke-width="1" stroke-linecap="round" />
      <line v-else x1="37" y1="34" x2="43" y2="34" stroke="#92400e" stroke-width="1" stroke-linecap="round" />
    </svg>

    <!-- Zzz overlay for offline -->
    <div v-if="!isWorking" class="zzz-container">
      <span class="zzz zzz-1">z</span>
      <span class="zzz zzz-2">z</span>
      <span class="zzz zzz-3">Z</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  oracleId: string
  status: 'online' | 'idle' | 'offline'
}>()

const isWorking = computed(() => props.status === 'online')

const characterMap: Record<string, string> = {
  'my-oracle': 'peter',
  'tony-oracle': 'tony',
}

const character = computed(() => characterMap[props.oracleId] ?? 'generic')
</script>

<style scoped>
.avatar-scene {
  position: relative;
  width: 80px;
  height: 80px;
  flex-shrink: 0;
}

.avatar-svg {
  width: 100%;
  height: 100%;
  transition: filter 0.5s ease;
}

/* === ONLINE animations === */

/* Bobbing body */
.avatar-scene:not(.avatar-scene--offline) .av-body {
  animation: av-bob 2s ease-in-out infinite;
  transform-origin: center bottom;
}

@keyframes av-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

/* Head bob (slightly delayed) */
.avatar-scene:not(.avatar-scene--offline) .av-head {
  animation: av-head-bob 2s ease-in-out 0.1s infinite;
}

@keyframes av-head-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

/* Eye blink */
.avatar-scene:not(.avatar-scene--offline) .av-eye--blink {
  animation: av-blink 4s ease infinite;
}

@keyframes av-blink {
  0%, 94%, 100% { transform: scaleY(1); }
  96% { transform: scaleY(0.1); }
}

/* Peter clipboard wiggle */
.avatar-scene:not(.avatar-scene--offline) .av-clipboard {
  animation: av-clipboard 1.5s ease-in-out infinite;
  transform-origin: 60px 50px;
}

@keyframes av-clipboard {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(2deg); }
  75% { transform: rotate(-1deg); }
}

/* Peter glasses glint */
.avatar-scene:not(.avatar-scene--offline) .av-glasses {
  animation: av-glint 3s ease infinite;
}

@keyframes av-glint {
  0%, 85%, 100% { opacity: 1; }
  90% { opacity: 0.6; }
}

/* Tony surfboard sway */
.avatar-scene:not(.avatar-scene--offline) .av-surfboard {
  animation: av-sway 3s ease-in-out infinite;
  transform-origin: 16px 68px;
}

@keyframes av-sway {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(3deg); }
}

/* Tony wave flow */
.av-wave {
  animation: av-wave-flow 2s linear infinite;
}

@keyframes av-wave-flow {
  0% { transform: translateX(0); }
  100% { transform: translateX(-20px); }
}

/* Tony shades shimmer */
.avatar-scene:not(.avatar-scene--offline) .av-shades {
  animation: av-shimmer 4s ease infinite;
}

@keyframes av-shimmer {
  0%, 80%, 100% { opacity: 1; }
  85% { opacity: 0.75; }
}

/* === OFFLINE state === */

.avatar-scene--offline .avatar-svg {
  filter: saturate(0.35) brightness(0.85);
  transition: filter 0.5s ease;
}

/* Breathing animation for offline */
.avatar-scene--offline .av-body {
  animation: av-breathe 3s ease-in-out infinite;
  transform-origin: center bottom;
}

@keyframes av-breathe {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.02); }
}

/* Zzz floating letters */
.zzz-container {
  position: absolute;
  top: -4px;
  right: -2px;
  pointer-events: none;
}

.zzz {
  position: absolute;
  font-weight: 800;
  color: #6366f1;
  opacity: 0;
  animation: av-zzz 3s ease-in-out infinite;
}

.zzz-1 {
  font-size: 0.6rem;
  right: 0;
  top: 14px;
  animation-delay: 0s;
}

.zzz-2 {
  font-size: 0.75rem;
  right: 6px;
  top: 6px;
  animation-delay: 1s;
}

.zzz-3 {
  font-size: 0.95rem;
  right: 12px;
  top: -4px;
  animation-delay: 2s;
}

@keyframes av-zzz {
  0% { opacity: 0; transform: translateY(4px) scale(0.7); }
  30% { opacity: 0.8; }
  70% { opacity: 0.6; transform: translateY(-8px) scale(1); }
  100% { opacity: 0; transform: translateY(-14px) scale(1.1); }
}

[data-theme="dark"] .zzz {
  color: #818cf8;
}
</style>
