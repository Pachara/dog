// Deterministic SVG icon generator based on domain name.
// Same domain always produces the same icon (hash-based).

const PALETTE = [
  ['#6366f1', '#818cf8'], // indigo
  ['#ec4899', '#f472b6'], // pink
  ['#f97316', '#fb923c'], // orange
  ['#14b8a6', '#2dd4bf'], // teal
  ['#8b5cf6', '#a78bfa'], // violet
  ['#ef4444', '#f87171'], // red
  ['#06b6d4', '#22d3ee'], // cyan
  ['#eab308', '#facc15'], // yellow
  ['#22c55e', '#4ade80'], // green
  ['#3b82f6', '#60a5fa'], // blue
  ['#d946ef', '#e879f9'], // fuchsia
  ['#f43f5e', '#fb7185'], // rose
]

type ShapeType = 'circle' | 'square' | 'diamond' | 'hexagon' | 'triangle' | 'rounded-square'
const SHAPES: ShapeType[] = ['circle', 'square', 'diamond', 'hexagon', 'triangle', 'rounded-square']

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit int
  }
  return Math.abs(hash)
}

function drawShape(shape: ShapeType, cx: number, cy: number, size: number, fill: string, opacity: number): string {
  const s = size
  switch (shape) {
    case 'circle':
      return `<circle cx="${cx}" cy="${cy}" r="${s}" fill="${fill}" opacity="${opacity}"/>`
    case 'square':
      return `<rect x="${cx - s}" y="${cy - s}" width="${s * 2}" height="${s * 2}" fill="${fill}" opacity="${opacity}"/>`
    case 'rounded-square':
      return `<rect x="${cx - s}" y="${cy - s}" width="${s * 2}" height="${s * 2}" rx="${s * 0.3}" fill="${fill}" opacity="${opacity}"/>`
    case 'diamond':
      return `<polygon points="${cx},${cy - s} ${cx + s},${cy} ${cx},${cy + s} ${cx - s},${cy}" fill="${fill}" opacity="${opacity}"/>`
    case 'hexagon': {
      const pts = Array.from({ length: 6 }, (_, i) => {
        const angle = (Math.PI / 3) * i - Math.PI / 6
        return `${cx + s * Math.cos(angle)},${cy + s * Math.sin(angle)}`
      }).join(' ')
      return `<polygon points="${pts}" fill="${fill}" opacity="${opacity}"/>`
    }
    case 'triangle':
      return `<polygon points="${cx},${cy - s} ${cx + s * 0.87},${cy + s * 0.5} ${cx - s * 0.87},${cy + s * 0.5}" fill="${fill}" opacity="${opacity}"/>`
  }
}

export function useIconGenerator() {
  function generateIcon(domain: string): string {
    const clean = domain.replace(/^www\./, '').toLowerCase()
    const hash = hashString(clean)
    const letter = clean.charAt(0).toUpperCase()

    // Pick colors deterministically
    const colorIdx = hash % PALETTE.length
    const [primary, secondary] = PALETTE[colorIdx]

    // Pick background shape
    const bgShapeIdx = (hash >> 4) % SHAPES.length
    const bgShape = SHAPES[bgShapeIdx]

    // Pick accent shape (different from bg)
    const accentShapeIdx = ((hash >> 8) % (SHAPES.length - 1) + bgShapeIdx + 1) % SHAPES.length
    const accentShape = SHAPES[accentShapeIdx]

    // Decorative element positions based on hash
    const deco1X = 10 + (hash % 12)
    const deco1Y = 10 + ((hash >> 3) % 12)
    const deco2X = 42 + ((hash >> 6) % 12)
    const deco2Y = 42 + ((hash >> 9) % 12)
    const deco3X = 10 + ((hash >> 12) % 15)
    const deco3Y = 42 + ((hash >> 15) % 12)

    // Build SVG
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">`

    // Background fill
    svg += `<rect width="64" height="64" rx="14" fill="${primary}"/>`

    // Subtle gradient overlay
    svg += `<defs><linearGradient id="g${hash % 1000}" x1="0" y1="0" x2="1" y2="1">`
    svg += `<stop offset="0%" stop-color="${secondary}" stop-opacity="0.4"/>`
    svg += `<stop offset="100%" stop-color="${primary}" stop-opacity="0"/>`
    svg += `</linearGradient></defs>`
    svg += `<rect width="64" height="64" rx="14" fill="url(#g${hash % 1000})"/>`

    // Background decorative shape
    svg += drawShape(bgShape, 32, 32, 24, secondary, 0.15)

    // Small decorative elements
    svg += drawShape(accentShape, deco1X, deco1Y, 5, '#ffffff', 0.12)
    svg += drawShape(accentShape, deco2X, deco2Y, 4, '#ffffff', 0.1)
    svg += drawShape(bgShape, deco3X, deco3Y, 3.5, '#ffffff', 0.08)

    // Center letter
    svg += `<text x="32" y="42" text-anchor="middle" fill="white" font-size="28" font-weight="700" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">${letter}</text>`

    svg += `</svg>`
    return svg
  }

  function generateDataUrl(domain: string): string {
    return 'data:image/svg+xml,' + encodeURIComponent(generateIcon(domain))
  }

  return {
    generateIcon,
    generateDataUrl,
  }
}
