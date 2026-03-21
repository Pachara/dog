// Fancy cartoon SVG icon generator — deterministic from domain name.
// Known sites get themed icons. Unknown sites get cute cartoon characters.

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash)
}

function bg(color: string, grad?: string): string {
  let s = `<rect width="64" height="64" rx="14" fill="${color}"/>`
  if (grad) {
    s += `<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">`
    s += `<stop offset="0%" stop-color="${grad}" stop-opacity="0.4"/>`
    s += `<stop offset="100%" stop-color="${color}" stop-opacity="0"/>`
    s += `</linearGradient></defs>`
    s += `<rect width="64" height="64" rx="14" fill="url(#bg)"/>`
  }
  return s
}

function wrap(content: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${content}</svg>`
}

// --- Known site icons ---

const KNOWN_ICONS: Record<string, () => string> = {
  'google.com': () => wrap(
    bg('#ffffff', '#f0f0f0') +
    // Magnifying glass
    `<circle cx="28" cy="28" r="12" fill="none" stroke="#4285f4" stroke-width="3"/>` +
    `<line x1="37" y1="37" x2="48" y2="48" stroke="#ea4335" stroke-width="4" stroke-linecap="round"/>` +
    // Rainbow dots inside
    `<circle cx="22" cy="26" r="2.5" fill="#ea4335"/>` +
    `<circle cx="28" cy="22" r="2.5" fill="#fbbc05"/>` +
    `<circle cx="34" cy="26" r="2.5" fill="#34a853"/>` +
    `<circle cx="28" cy="32" r="2.5" fill="#4285f4"/>` +
    // Sparkles
    `<circle cx="50" cy="14" r="1.5" fill="#fbbc05"/>` +
    `<circle cx="12" cy="48" r="1" fill="#34a853"/>`
  ),

  'github.com': () => wrap(
    bg('#24292e', '#3d4450') +
    // Cat face (octocat-inspired)
    `<circle cx="32" cy="34" r="16" fill="#f0f0f0"/>` +
    // Ears
    `<polygon points="18,22 22,12 28,24" fill="#f0f0f0"/>` +
    `<polygon points="46,22 42,12 36,24" fill="#f0f0f0"/>` +
    `<polygon points="20,21 23,15 27,23" fill="#e0e0e0"/>` +
    `<polygon points="44,21 41,15 37,23" fill="#e0e0e0"/>` +
    // Eyes
    `<ellipse cx="26" cy="32" rx="3" ry="3.5" fill="#24292e"/>` +
    `<ellipse cx="38" cy="32" rx="3" ry="3.5" fill="#24292e"/>` +
    `<circle cx="27" cy="31" r="1" fill="white"/>` +
    `<circle cx="39" cy="31" r="1" fill="white"/>` +
    // Nose + mouth
    `<ellipse cx="32" cy="37" rx="2" ry="1.5" fill="#ffb6c1"/>` +
    `<path d="M30,39 Q32,42 34,39" fill="none" stroke="#24292e" stroke-width="0.8"/>` +
    // Whiskers
    `<line x1="14" y1="34" x2="24" y2="35" stroke="#ccc" stroke-width="0.6"/>` +
    `<line x1="14" y1="38" x2="24" y2="37" stroke="#ccc" stroke-width="0.6"/>` +
    `<line x1="50" y1="34" x2="40" y2="35" stroke="#ccc" stroke-width="0.6"/>` +
    `<line x1="50" y1="38" x2="40" y2="37" stroke="#ccc" stroke-width="0.6"/>`
  ),

  'youtube.com': () => wrap(
    bg('#ff0000', '#ff4444') +
    // TV body
    `<rect x="12" y="18" width="40" height="30" rx="4" fill="#1a1a1a"/>` +
    `<rect x="14" y="20" width="36" height="26" rx="2" fill="#2d2d2d"/>` +
    // Play button
    `<polygon points="27,26 27,40 40,33" fill="white"/>` +
    // Antenna
    `<line x1="26" y1="18" x2="20" y2="8" stroke="#cccccc" stroke-width="2" stroke-linecap="round"/>` +
    `<line x1="38" y1="18" x2="44" y2="8" stroke="#cccccc" stroke-width="2" stroke-linecap="round"/>` +
    `<circle cx="20" cy="7" r="2" fill="#ff4444"/>` +
    `<circle cx="44" cy="7" r="2" fill="#ff4444"/>` +
    // Stand
    `<rect x="28" y="48" width="8" height="3" rx="1" fill="#666"/>` +
    `<rect x="24" y="51" width="16" height="2" rx="1" fill="#888"/>`
  ),

  'facebook.com': () => wrap(
    bg('#1877f2', '#4599ff') +
    // Thumbs up hand
    `<path d="M22,44 L22,30 L28,30 L30,22 Q31,18 34,18 L38,18 Q40,18 40,20 L40,26 L46,26 Q50,26 49,30 L47,40 Q46,44 42,44 Z" fill="white"/>` +
    // Cuff
    `<rect x="16" y="29" width="8" height="16" rx="2" fill="#e4e6eb"/>` +
    // Sparkles
    `<circle cx="48" cy="14" r="2" fill="#fff" opacity="0.5"/>` +
    `<circle cx="12" cy="16" r="1.5" fill="#fff" opacity="0.4"/>` +
    `<circle cx="52" cy="36" r="1" fill="#fff" opacity="0.3"/>`
  ),

  'x.com': () => wrap(
    bg('#000000', '#1a1a1a') +
    // X logo style
    `<text x="32" y="44" text-anchor="middle" fill="white" font-size="36" font-weight="800" font-family="Arial,sans-serif">X</text>` +
    // Sparkles
    `<circle cx="12" cy="12" r="1.5" fill="#555"/>` +
    `<circle cx="52" cy="14" r="1" fill="#444"/>` +
    `<circle cx="50" cy="52" r="1.5" fill="#333"/>`
  ),

  'twitter.com': () => wrap(
    bg('#1da1f2', '#4db8f7') +
    // Bird body
    `<ellipse cx="32" cy="34" rx="14" ry="10" fill="white"/>` +
    // Wing
    `<path d="M20,30 Q14,22 22,26 Q18,20 26,24" fill="#e8f5fe"/>` +
    // Head
    `<circle cx="38" cy="26" r="7" fill="white"/>` +
    // Eye
    `<circle cx="40" cy="25" r="2" fill="#1a1a1a"/>` +
    `<circle cx="40.7" cy="24.3" r="0.7" fill="white"/>` +
    // Beak
    `<polygon points="44,26 50,24 50,28" fill="#ffad1f"/>` +
    `<line x1="44" y1="27" x2="49" y2="27" stroke="#e8950a" stroke-width="0.5"/>` +
    // Tail feathers
    `<path d="M18,34 Q10,30 14,38" fill="#e8f5fe"/>` +
    `<path d="M18,36 Q8,34 14,42" fill="#d4edfc"/>`
  ),

  'amazon.com': () => wrap(
    bg('#ff9900', '#ffb84d') +
    // Box
    `<rect x="16" y="18" width="32" height="28" rx="3" fill="#232f3e"/>` +
    `<rect x="16" y="18" width="32" height="8" rx="3" fill="#37475a"/>` +
    // Tape
    `<rect x="29" y="18" width="6" height="28" fill="#ff9900" opacity="0.3"/>` +
    // Smile arrow
    `<path d="M20,40 Q32,50 44,40" fill="none" stroke="#ff9900" stroke-width="2.5" stroke-linecap="round"/>` +
    `<polygon points="42,38 46,41 42,43" fill="#ff9900"/>` +
    // Sparkle
    `<circle cx="50" cy="12" r="2" fill="white" opacity="0.4"/>`
  ),

  'reddit.com': () => wrap(
    bg('#ff4500', '#ff6633') +
    // Snoo face
    `<circle cx="32" cy="34" r="16" fill="white"/>` +
    // Ears
    `<circle cx="18" cy="22" r="5" fill="white"/>` +
    `<circle cx="18" cy="22" r="3" fill="#ff4500"/>` +
    `<circle cx="46" cy="22" r="5" fill="white"/>` +
    `<circle cx="46" cy="22" r="3" fill="#ff4500"/>` +
    // Eyes
    `<circle cx="26" cy="32" r="3" fill="#ff4500"/>` +
    `<circle cx="38" cy="32" r="3" fill="#ff4500"/>` +
    `<circle cx="27" cy="31" r="1" fill="white"/>` +
    `<circle cx="39" cy="31" r="1" fill="white"/>` +
    // Mouth
    `<path d="M24,40 Q32,44 40,40" fill="none" stroke="#ff4500" stroke-width="1.5"/>` +
    // Antenna
    `<line x1="32" y1="18" x2="32" y2="10" stroke="#ccc" stroke-width="1.5"/>` +
    `<circle cx="32" cy="9" r="2.5" fill="#ff4500"/>`
  ),

  'netflix.com': () => wrap(
    bg('#000000', '#1a1a1a') +
    // N letter stylized
    `<path d="M18,14 L18,50 L24,50 L24,28 L38,50 L44,50 L44,14 L38,14 L38,36 L24,14 Z" fill="#e50914"/>` +
    // Popcorn
    `<circle cx="52" cy="48" r="2" fill="#ffec27"/>` +
    `<circle cx="54" cy="44" r="1.5" fill="#ffec27"/>` +
    `<circle cx="50" cy="45" r="1.8" fill="#ffec27"/>`
  ),

  'stackoverflow.com': () => wrap(
    bg('#f48024', '#f9a03f') +
    // Stack of books/blocks
    `<rect x="20" y="40" width="24" height="4" rx="1" fill="#bcbbbb" transform="rotate(-4,32,42)"/>` +
    `<rect x="20" y="34" width="24" height="4" rx="1" fill="#f48024" transform="rotate(2,32,36)"/>` +
    `<rect x="20" y="28" width="24" height="4" rx="1" fill="#ffcc01" transform="rotate(-1,32,30)"/>` +
    `<rect x="20" y="22" width="24" height="4" rx="1" fill="#6cbc6d" transform="rotate(3,32,24)"/>` +
    `<rect x="20" y="16" width="24" height="4" rx="1" fill="#1a95ff" transform="rotate(-2,32,18)"/>` +
    // Bracket
    `<text x="32" y="56" text-anchor="middle" fill="white" font-size="10" font-weight="700" font-family="monospace">{...}</text>`
  ),
}

// --- TLD-based icons ---

function devIcon(): string {
  return wrap(
    bg('#0f172a', '#1e293b') +
    // Laptop
    `<rect x="14" y="16" width="36" height="24" rx="3" fill="#334155"/>` +
    `<rect x="16" y="18" width="32" height="20" rx="1" fill="#0f172a"/>` +
    // Code brackets
    `<text x="24" y="32" fill="#22d3ee" font-size="12" font-weight="700" font-family="monospace">&lt;</text>` +
    `<text x="33" y="32" fill="#a78bfa" font-size="12" font-weight="700" font-family="monospace">/</text>` +
    `<text x="38" y="32" fill="#22d3ee" font-size="12" font-weight="700" font-family="monospace">&gt;</text>` +
    // Keyboard base
    `<path d="M10,40 L54,40 L50,46 Q49,48 47,48 L17,48 Q15,48 14,46 Z" fill="#475569"/>` +
    // Glow
    `<circle cx="32" cy="28" r="8" fill="#22d3ee" opacity="0.06"/>`
  )
}

function ioIcon(): string {
  return wrap(
    bg('#1e1b4b', '#312e81') +
    // Rocket body
    `<path d="M32,8 Q38,16 38,32 L26,32 Q26,16 32,8 Z" fill="#e2e8f0"/>` +
    `<path d="M32,8 Q35,16 35,32 L32,32 Q32,16 32,8 Z" fill="#cbd5e1"/>` +
    // Nose cone
    `<ellipse cx="32" cy="12" rx="3" ry="4" fill="#ef4444"/>` +
    // Window
    `<circle cx="32" cy="22" r="3" fill="#3b82f6"/>` +
    `<circle cx="33" cy="21" r="1" fill="#93c5fd" opacity="0.6"/>` +
    // Fins
    `<path d="M26,28 L20,36 L26,34 Z" fill="#ef4444"/>` +
    `<path d="M38,28 L44,36 L38,34 Z" fill="#ef4444"/>` +
    // Flame
    `<ellipse cx="32" cy="38" rx="4" ry="6" fill="#f97316"/>` +
    `<ellipse cx="32" cy="37" rx="2.5" ry="4" fill="#fbbf24"/>` +
    `<ellipse cx="32" cy="36" rx="1.2" ry="2.5" fill="white"/>` +
    // Stars
    `<circle cx="10" cy="14" r="1" fill="white" opacity="0.6"/>` +
    `<circle cx="52" cy="20" r="1.5" fill="white" opacity="0.5"/>` +
    `<circle cx="14" cy="44" r="0.8" fill="white" opacity="0.4"/>` +
    `<circle cx="50" cy="48" r="1" fill="white" opacity="0.5"/>`
  )
}

function aiIcon(): string {
  return wrap(
    bg('#7c3aed', '#8b5cf6') +
    // Robot head
    `<rect x="18" y="20" width="28" height="24" rx="6" fill="#e2e8f0"/>` +
    `<rect x="18" y="20" width="28" height="24" rx="6" fill="none" stroke="#c4b5fd" stroke-width="1"/>` +
    // Antenna
    `<line x1="32" y1="20" x2="32" y2="12" stroke="#c4b5fd" stroke-width="2"/>` +
    `<circle cx="32" cy="10" r="3" fill="#fbbf24"/>` +
    `<circle cx="32" cy="10" r="1.5" fill="#fde68a"/>` +
    // Eyes (LED style)
    `<rect x="23" y="27" width="6" height="4" rx="1" fill="#22d3ee"/>` +
    `<rect x="35" y="27" width="6" height="4" rx="1" fill="#22d3ee"/>` +
    `<rect x="24" y="28" width="2" height="2" fill="white" opacity="0.5"/>` +
    `<rect x="36" y="28" width="2" height="2" fill="white" opacity="0.5"/>` +
    // Mouth grid
    `<rect x="26" y="36" width="12" height="4" rx="1" fill="#94a3b8"/>` +
    `<line x1="29" y1="36" x2="29" y2="40" stroke="#e2e8f0" stroke-width="0.5"/>` +
    `<line x1="32" y1="36" x2="32" y2="40" stroke="#e2e8f0" stroke-width="0.5"/>` +
    `<line x1="35" y1="36" x2="35" y2="40" stroke="#e2e8f0" stroke-width="0.5"/>` +
    // Ears
    `<rect x="12" y="28" width="6" height="8" rx="2" fill="#c4b5fd"/>` +
    `<rect x="46" y="28" width="6" height="8" rx="2" fill="#c4b5fd"/>` +
    // Bolts
    `<circle cx="15" cy="32" r="1.5" fill="#7c3aed"/>` +
    `<circle cx="49" cy="32" r="1.5" fill="#7c3aed"/>`
  )
}

// --- Generic cartoon templates (hash-selected) ---

type CartoonFn = (primary: string, secondary: string) => string

const CARTOONS: CartoonFn[] = [
  // 0: Dog face
  (p, s) => wrap(bg(p, s) +
    `<ellipse cx="32" cy="36" rx="14" ry="12" fill="#f5deb3"/>` +
    `<ellipse cx="20" cy="24" rx="6" ry="8" fill="#d2a679" transform="rotate(-15,20,24)"/>` +
    `<ellipse cx="44" cy="24" rx="6" ry="8" fill="#d2a679" transform="rotate(15,44,24)"/>` +
    `<circle cx="26" cy="33" r="2.5" fill="#1a1a1a"/><circle cx="27" cy="32" r="0.8" fill="white"/>` +
    `<circle cx="38" cy="33" r="2.5" fill="#1a1a1a"/><circle cx="39" cy="32" r="0.8" fill="white"/>` +
    `<ellipse cx="32" cy="38" rx="3" ry="2.5" fill="#1a1a1a"/>` +
    `<path d="M29,41 Q32,45 35,41" fill="#e8747c"/>` +
    `<ellipse cx="32" cy="44" rx="1.5" ry="1" fill="#e8747c"/>`),

  // 1: Cat face
  (p, s) => wrap(bg(p, s) +
    `<circle cx="32" cy="36" r="14" fill="#ffa94d"/>` +
    `<polygon points="18,24 22,10 30,26" fill="#ffa94d"/><polygon points="46,24 42,10 34,26" fill="#ffa94d"/>` +
    `<polygon points="20,23 23,14 28,24" fill="#ffcc80"/>` +
    `<polygon points="44,23 41,14 36,24" fill="#ffcc80"/>` +
    `<ellipse cx="26" cy="34" rx="2" ry="2.5" fill="#1a1a1a"/><circle cx="27" cy="33" r="0.7" fill="white"/>` +
    `<ellipse cx="38" cy="34" rx="2" ry="2.5" fill="#1a1a1a"/><circle cx="39" cy="33" r="0.7" fill="white"/>` +
    `<ellipse cx="32" cy="38" rx="2" ry="1.5" fill="#ff6b6b"/>` +
    `<path d="M29,40 Q32,43 35,40" fill="none" stroke="#1a1a1a" stroke-width="0.8"/>`),

  // 2: Bear
  (p, s) => wrap(bg(p, s) +
    `<circle cx="32" cy="34" r="16" fill="#8B5E3C"/>` +
    `<circle cx="18" cy="20" r="6" fill="#8B5E3C"/><circle cx="18" cy="20" r="3.5" fill="#C68642"/>` +
    `<circle cx="46" cy="20" r="6" fill="#8B5E3C"/><circle cx="46" cy="20" r="3.5" fill="#C68642"/>` +
    `<circle cx="26" cy="32" r="2" fill="#1a1a1a"/><circle cx="38" cy="32" r="2" fill="#1a1a1a"/>` +
    `<ellipse cx="32" cy="38" rx="6" ry="5" fill="#C68642"/>` +
    `<ellipse cx="32" cy="37" rx="2.5" ry="2" fill="#1a1a1a"/>` +
    `<path d="M30,40 Q32,43 34,40" fill="none" stroke="#1a1a1a" stroke-width="1"/>`),

  // 3: Penguin
  (p, s) => wrap(bg(p, s) +
    `<ellipse cx="32" cy="36" rx="14" ry="16" fill="#2d3436"/>` +
    `<ellipse cx="32" cy="38" rx="10" ry="12" fill="white"/>` +
    `<circle cx="26" cy="30" r="2.5" fill="white"/><circle cx="26" cy="30" r="1.5" fill="#1a1a1a"/>` +
    `<circle cx="38" cy="30" r="2.5" fill="white"/><circle cx="38" cy="30" r="1.5" fill="#1a1a1a"/>` +
    `<polygon points="32,34 29,38 35,38" fill="#f39c12"/>` +
    `<path d="M16,34 Q12,40 18,44" fill="#2d3436" stroke="none"/>` +
    `<path d="M48,34 Q52,40 46,44" fill="#2d3436" stroke="none"/>`),

  // 4: Fox
  (p, s) => wrap(bg(p, s) +
    `<circle cx="32" cy="36" r="14" fill="#e67e22"/>` +
    `<polygon points="16,26 22,8 30,28" fill="#e67e22"/><polygon points="48,26 42,8 34,28" fill="#e67e22"/>` +
    `<polygon points="19,24 23,14 28,26" fill="white"/>` +
    `<polygon points="45,24 41,14 36,26" fill="white"/>` +
    `<ellipse cx="32" cy="40" rx="8" ry="6" fill="white"/>` +
    `<circle cx="26" cy="33" r="2" fill="#1a1a1a"/><circle cx="38" cy="33" r="2" fill="#1a1a1a"/>` +
    `<ellipse cx="32" cy="38" rx="2" ry="1.5" fill="#1a1a1a"/>` +
    `<path d="M30,40 Q32,42 34,40" fill="none" stroke="#1a1a1a" stroke-width="0.8"/>`),

  // 5: Planet
  (p, s) => wrap(bg('#0f172a', '#1e293b') +
    `<circle cx="32" cy="32" r="16" fill="${p}"/>` +
    `<circle cx="32" cy="32" r="16" fill="${s}" opacity="0.15"/>` +
    `<ellipse cx="32" cy="32" rx="24" ry="6" fill="none" stroke="${s}" stroke-width="2" transform="rotate(-20,32,32)"/>` +
    `<circle cx="26" cy="28" r="3" fill="${s}" opacity="0.2"/>` +
    `<circle cx="36" cy="36" r="2" fill="${s}" opacity="0.15"/>` +
    `<circle cx="10" cy="12" r="1" fill="white" opacity="0.5"/>` +
    `<circle cx="52" cy="48" r="1.5" fill="white" opacity="0.4"/>` +
    `<circle cx="50" cy="14" r="0.8" fill="white" opacity="0.3"/>`),

  // 6: Star
  (p, s) => wrap(bg(p, s) +
    `<polygon points="32,8 37,24 54,24 40,34 45,50 32,40 19,50 24,34 10,24 27,24" fill="#fbbf24"/>` +
    `<polygon points="32,14 35,24 44,24 37,30 39,40 32,35 25,40 27,30 20,24 29,24" fill="#fde68a"/>` +
    `<circle cx="30" cy="28" r="1.5" fill="#1a1a1a"/><circle cx="36" cy="28" r="1.5" fill="#1a1a1a"/>` +
    `<path d="M29,33 Q32,36 35,33" fill="none" stroke="#92400e" stroke-width="1" stroke-linecap="round"/>`),

  // 7: Diamond
  (p, s) => wrap(bg(p, s) +
    `<polygon points="32,8 52,28 32,56 12,28" fill="#67e8f9"/>` +
    `<polygon points="32,8 42,28 32,56" fill="#22d3ee"/>` +
    `<polygon points="32,8 32,56 22,28" fill="#a5f3fc"/>` +
    `<line x1="12" y1="28" x2="52" y2="28" stroke="white" stroke-width="0.5" opacity="0.5"/>` +
    `<line x1="32" y1="8" x2="22" y2="28" stroke="white" stroke-width="0.5" opacity="0.3"/>` +
    `<line x1="32" y1="8" x2="42" y2="28" stroke="white" stroke-width="0.5" opacity="0.3"/>` +
    `<circle cx="28" cy="24" r="2" fill="white" opacity="0.3"/>`),

  // 8: Crown
  (p, s) => wrap(bg(p, s) +
    `<polygon points="10,42 10,24 20,32 32,18 44,32 54,24 54,42" fill="#fbbf24"/>` +
    `<polygon points="10,42 54,42 52,48 12,48" fill="#f59e0b"/>` +
    `<circle cx="20" cy="32" r="2" fill="#ef4444"/>` +
    `<circle cx="32" cy="22" r="2.5" fill="#3b82f6"/>` +
    `<circle cx="44" cy="32" r="2" fill="#22c55e"/>` +
    `<rect x="12" y="42" width="40" height="2" fill="#d97706"/>` +
    `<circle cx="10" cy="24" r="2.5" fill="#fbbf24"/><circle cx="54" cy="24" r="2.5" fill="#fbbf24"/>` +
    `<circle cx="32" cy="17" r="2.5" fill="#fbbf24"/>`),

  // 9: Lightning bolt
  (p, s) => wrap(bg(p, s) +
    `<polygon points="36,6 22,32 30,32 26,58 44,28 34,28" fill="#fbbf24"/>` +
    `<polygon points="34,10 24,32 30,32 28,52 42,28 34,28" fill="#fde68a"/>` +
    `<circle cx="14" cy="14" r="1.5" fill="white" opacity="0.3"/>` +
    `<circle cx="50" cy="50" r="1" fill="white" opacity="0.2"/>`),

  // 10: Coffee cup
  (p, s) => wrap(bg(p, s) +
    `<rect x="16" y="24" width="26" height="24" rx="3" fill="white"/>` +
    `<rect x="18" y="26" width="22" height="6" fill="#8B5E3C"/>` +
    `<path d="M42,30 Q50,30 50,38 Q50,44 42,44" fill="none" stroke="white" stroke-width="3"/>` +
    `<rect x="14" y="48" width="30" height="3" rx="1.5" fill="#e2e8f0"/>` +
    // Steam
    `<path d="M24,22 Q22,16 26,14" fill="none" stroke="white" stroke-width="1.2" opacity="0.5"/>` +
    `<path d="M30" y1="20" Q28,14 32,12" fill="none" stroke="white" stroke-width="1.2" opacity="0.4"/>` +
    `<path d="M36,22 Q34,16 38,14" fill="none" stroke="white" stroke-width="1.2" opacity="0.3"/>`),

  // 11: Pizza slice
  (p, s) => wrap(bg(p, s) +
    `<path d="M32,10 L50,52 L14,52 Z" fill="#f59e0b"/>` +
    `<path d="M32,14 L48,50 L16,50 Z" fill="#fbbf24"/>` +
    // Crust
    `<path d="M14,52 Q32,56 50,52" fill="#d97706" stroke="#b45309" stroke-width="1"/>` +
    // Pepperoni
    `<circle cx="28" cy="36" r="3" fill="#ef4444"/><circle cx="36" cy="40" r="2.5" fill="#ef4444"/>` +
    `<circle cx="32" cy="28" r="2" fill="#ef4444"/>` +
    // Cheese spots
    `<circle cx="24" cy="44" r="1.5" fill="#fde68a" opacity="0.5"/>` +
    `<circle cx="40" cy="46" r="1" fill="#fde68a" opacity="0.4"/>`),

  // 12: Cake
  (p, s) => wrap(bg(p, s) +
    // Bottom tier
    `<rect x="14" y="36" width="36" height="14" rx="3" fill="#f9a8d4"/>` +
    `<rect x="14" y="36" width="36" height="4" rx="2" fill="#f472b6"/>` +
    // Top tier
    `<rect x="20" y="24" width="24" height="14" rx="3" fill="#fda4af"/>` +
    `<rect x="20" y="24" width="24" height="4" rx="2" fill="#fb7185"/>` +
    // Candle
    `<rect x="30" y="14" width="4" height="12" fill="#fbbf24"/>` +
    // Flame
    `<ellipse cx="32" cy="12" rx="2.5" ry="4" fill="#f97316"/>` +
    `<ellipse cx="32" cy="12" rx="1.2" ry="2" fill="#fbbf24"/>` +
    // Frosting drips
    `<circle cx="20" cy="38" r="2" fill="white" opacity="0.5"/>` +
    `<circle cx="32" cy="39" r="2.5" fill="white" opacity="0.5"/>` +
    `<circle cx="44" cy="38" r="2" fill="white" opacity="0.5"/>` +
    // Plate
    `<ellipse cx="32" cy="52" rx="20" ry="3" fill="white" opacity="0.3"/>`),

  // 13: Cactus
  (p, s) => wrap(bg('#fef3c7', '#fde68a') +
    `<rect x="28" y="18" width="8" height="30" rx="4" fill="#22c55e"/>` +
    `<path d="M28,30 Q18,30 18,22 Q18,18 22,18" fill="none" stroke="#22c55e" stroke-width="7" stroke-linecap="round"/>` +
    `<path d="M36,34 Q46,34 46,26 Q46,22 42,22" fill="none" stroke="#22c55e" stroke-width="7" stroke-linecap="round"/>` +
    `<circle cx="30" cy="26" r="1" fill="#1a1a1a"/><circle cx="34" cy="26" r="1" fill="#1a1a1a"/>` +
    `<path d="M30,30 Q32,32 34,30" fill="none" stroke="#166534" stroke-width="0.8"/>` +
    `<ellipse cx="32" cy="50" rx="12" ry="3" fill="#d2b48c"/>` +
    `<rect x="24" y="46" width="16" height="6" rx="2" fill="#c2956b"/>`),

  // 14: Ghost
  (p, s) => wrap(bg(p, s) +
    `<path d="M20,44 L20,26 Q20,14 32,14 Q44,14 44,26 L44,44 L40,40 L36,44 L32,40 L28,44 L24,40 Z" fill="white"/>` +
    `<circle cx="27" cy="28" r="3" fill="#1a1a1a"/><circle cx="37" cy="28" r="3" fill="#1a1a1a"/>` +
    `<circle cx="28" cy="27" r="1" fill="white"/><circle cx="38" cy="27" r="1" fill="white"/>` +
    `<ellipse cx="32" cy="36" rx="3" ry="2.5" fill="#1a1a1a"/>` +
    `<circle cx="16" cy="20" r="1.5" fill="white" opacity="0.3"/>` +
    `<circle cx="48" cy="34" r="1" fill="white" opacity="0.2"/>`),

  // 15: Mushroom
  (p, s) => wrap(bg(p, s) +
    `<ellipse cx="32" cy="28" rx="20" ry="14" fill="#ef4444"/>` +
    `<circle cx="24" cy="22" r="4" fill="white" opacity="0.6"/>` +
    `<circle cx="38" cy="18" r="3" fill="white" opacity="0.5"/>` +
    `<circle cx="32" cy="26" r="2.5" fill="white" opacity="0.4"/>` +
    `<rect x="26" y="28" width="12" height="18" rx="2" fill="#fef3c7"/>` +
    `<rect x="26" y="28" width="12" height="4" fill="#fde68a" opacity="0.3"/>` +
    `<circle cx="30" cy="36" r="1" fill="#1a1a1a"/><circle cx="36" cy="36" r="1" fill="#1a1a1a"/>` +
    `<path d="M30,40 Q32,42 34,40" fill="none" stroke="#92400e" stroke-width="0.8"/>`),

  // 16: Octopus
  (p, s) => wrap(bg('#1e3a5f', '#2563eb') +
    `<ellipse cx="32" cy="26" rx="14" ry="12" fill="${p}"/>` +
    `<circle cx="26" cy="24" r="3" fill="white"/><circle cx="26" cy="24" r="1.5" fill="#1a1a1a"/>` +
    `<circle cx="38" cy="24" r="3" fill="white"/><circle cx="38" cy="24" r="1.5" fill="#1a1a1a"/>` +
    `<path d="M29,31 Q32,34 35,31" fill="none" stroke="#1a1a1a" stroke-width="1"/>` +
    // Tentacles
    `<path d="M20,34 Q14,42 18,50" fill="none" stroke="${p}" stroke-width="3" stroke-linecap="round"/>` +
    `<path d="M26,36 Q22,46 26,52" fill="none" stroke="${p}" stroke-width="3" stroke-linecap="round"/>` +
    `<path d="M38,36 Q42,46 38,52" fill="none" stroke="${p}" stroke-width="3" stroke-linecap="round"/>` +
    `<path d="M44,34 Q50,42 46,50" fill="none" stroke="${p}" stroke-width="3" stroke-linecap="round"/>` +
    `<circle cx="18" cy="50" r="2" fill="${s}"/><circle cx="26" cy="52" r="2" fill="${s}"/>` +
    `<circle cx="38" cy="52" r="2" fill="${s}"/><circle cx="46" cy="50" r="2" fill="${s}"/>`),

  // 17: Alien
  (p, s) => wrap(bg('#0f172a', '#1e293b') +
    `<ellipse cx="32" cy="30" rx="16" ry="20" fill="${p}"/>` +
    `<ellipse cx="24" cy="28" rx="5" ry="3" fill="#1a1a1a"/>` +
    `<ellipse cx="40" cy="28" rx="5" ry="3" fill="#1a1a1a"/>` +
    `<ellipse cx="24" cy="28" rx="4" ry="2" fill="${s}"/>` +
    `<ellipse cx="40" cy="28" rx="4" ry="2" fill="${s}"/>` +
    `<ellipse cx="32" cy="38" rx="2" ry="1" fill="#1a1a1a"/>` +
    `<line x1="32" y1="8" x2="32" y2="4" stroke="${s}" stroke-width="1.5"/>` +
    `<circle cx="32" cy="3" r="2" fill="${s}"/>` +
    `<circle cx="10" cy="10" r="1" fill="white" opacity="0.4"/>` +
    `<circle cx="54" cy="16" r="1.5" fill="white" opacity="0.3"/>`),

  // 18: Whale
  (p, s) => wrap(bg('#0ea5e9', '#38bdf8') +
    `<ellipse cx="32" cy="34" rx="20" ry="14" fill="#1e3a5f"/>` +
    `<circle cx="40" cy="30" r="2.5" fill="white"/><circle cx="40" cy="30" r="1.2" fill="#1a1a1a"/>` +
    `<path d="M14,32 Q10,28 8,32" fill="none" stroke="#1e3a5f" stroke-width="2"/>` +
    `<path d="M28,40 Q32,44 36,40" fill="none" stroke="#38bdf8" stroke-width="1"/>` +
    // Tail
    `<path d="M52,34 Q58,28 56,22" fill="none" stroke="#1e3a5f" stroke-width="4" stroke-linecap="round"/>` +
    `<path d="M52,34 Q58,40 56,46" fill="none" stroke="#1e3a5f" stroke-width="4" stroke-linecap="round"/>` +
    // Water spout
    `<circle cx="22" cy="18" r="2" fill="#7dd3fc" opacity="0.6"/>` +
    `<circle cx="18" cy="14" r="1.5" fill="#7dd3fc" opacity="0.5"/>` +
    `<circle cx="26" cy="12" r="1.5" fill="#7dd3fc" opacity="0.4"/>`),

  // 19: Flower
  (p, s) => wrap(bg('#ecfdf5', '#d1fae5') +
    // Petals
    `<circle cx="32" cy="18" r="8" fill="${p}" opacity="0.8"/>` +
    `<circle cx="22" cy="26" r="8" fill="${s}" opacity="0.7"/>` +
    `<circle cx="42" cy="26" r="8" fill="${s}" opacity="0.7"/>` +
    `<circle cx="24" cy="36" r="8" fill="${p}" opacity="0.6"/>` +
    `<circle cx="40" cy="36" r="8" fill="${p}" opacity="0.6"/>` +
    // Center
    `<circle cx="32" cy="28" r="6" fill="#fbbf24"/>` +
    `<circle cx="32" cy="28" r="3" fill="#f59e0b"/>` +
    // Stem
    `<line x1="32" y1="34" x2="32" y2="54" stroke="#22c55e" stroke-width="3"/>` +
    // Leaf
    `<ellipse cx="38" cy="46" rx="6" ry="3" fill="#22c55e" transform="rotate(30,38,46)"/>`),
]

const PALETTES: [string, string][] = [
  ['#6366f1', '#818cf8'],
  ['#ec4899', '#f472b6'],
  ['#f97316', '#fb923c'],
  ['#14b8a6', '#2dd4bf'],
  ['#8b5cf6', '#a78bfa'],
  ['#ef4444', '#f87171'],
  ['#06b6d4', '#22d3ee'],
  ['#eab308', '#facc15'],
  ['#22c55e', '#4ade80'],
  ['#3b82f6', '#60a5fa'],
  ['#d946ef', '#e879f9'],
  ['#f43f5e', '#fb7185'],
]

export function useIconGenerator() {
  function generateIcon(domain: string): string {
    const clean = domain.replace(/^www\./, '').toLowerCase()

    // Check known sites first
    for (const [key, fn] of Object.entries(KNOWN_ICONS)) {
      if (clean === key || clean.endsWith('.' + key)) return fn()
    }

    // Check TLD-based icons
    if (clean.endsWith('.dev')) return devIcon()
    if (clean.endsWith('.io')) return ioIcon()
    if (clean.endsWith('.ai')) return aiIcon()

    // Generic cartoon based on domain hash
    const hash = hashString(clean)
    const cartoonIdx = hash % CARTOONS.length
    const paletteIdx = (hash >> 5) % PALETTES.length
    const [primary, secondary] = PALETTES[paletteIdx]
    return CARTOONS[cartoonIdx](primary, secondary)
  }

  function generateDataUrl(domain: string): string {
    return 'data:image/svg+xml,' + encodeURIComponent(generateIcon(domain))
  }

  return {
    generateIcon,
    generateDataUrl,
  }
}
