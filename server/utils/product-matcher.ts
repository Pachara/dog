// Product matching — matches same products across Makro and Lotus's
// Uses word overlap + size-aware matching (tested by Peter with มิตรผล: 7/20 matched)

export interface NormalizedProduct {
  id: string
  name: string
  nameEn: string
  brand: string
  price: number
  perUnitPrice: number
  unitFactor: number
  originalPrice: number
  discount: string
  image: string
  link: string
  store: 'makro' | 'lotus'
}

export interface MatchedPair {
  type: 'matched'
  name: string
  makro: NormalizedProduct
  lotus: NormalizedProduct
  cheaper: 'makro' | 'lotus' | 'equal'
  priceDiff: number
}

export interface UnmatchedProduct {
  type: 'unmatched'
  product: NormalizedProduct
}

export type CompareResult = MatchedPair | UnmatchedProduct

// --- Size extraction ---
// Extract weight/volume from product name: "1 กก.", "500g", "1.5 ลิตร", etc.
interface SizeInfo {
  value: number
  unit: string // normalized: 'g', 'kg', 'ml', 'l'
}

function extractSize(text: string): SizeInfo | null {
  const t = text.toLowerCase()
  // Patterns: "500 g", "1.5 กก.", "250 ml", "1 ลิตร", "500กรัม"
  const patterns: [RegExp, string, number][] = [
    [/(\d+\.?\d*)\s*(?:กก\.|กิโลกรัม|kg)/i, 'kg', 1],
    [/(\d+\.?\d*)\s*(?:กรัม|กร\.|g(?:ram)?)\b/i, 'g', 1],
    [/(\d+\.?\d*)\s*(?:ลิตร|ล\.|liter|litre|lt)\b/i, 'l', 1],
    [/(\d+\.?\d*)\s*(?:มล\.|มิลลิลิตร|ml)\b/i, 'ml', 1],
    [/(\d+\.?\d*)\s*(?:ออนซ์|oz)\b/i, 'oz', 1],
  ]

  for (const [regex, unit, mult] of patterns) {
    const match = t.match(regex)
    if (match) {
      return { value: parseFloat(match[1]) * mult, unit }
    }
  }
  return null
}

function sameSize(a: SizeInfo | null, b: SizeInfo | null): number {
  if (!a && !b) return 0 // no size info, neutral
  if (!a || !b) return 0 // one has size, one doesn't, neutral

  // Normalize to same unit for comparison
  const toGrams = (s: SizeInfo) => {
    if (s.unit === 'kg') return s.value * 1000
    if (s.unit === 'g') return s.value
    if (s.unit === 'l') return s.value * 1000
    if (s.unit === 'ml') return s.value
    if (s.unit === 'oz') return s.value * 28.35
    return s.value
  }

  // Only compare same category (weight vs volume)
  const isWeight = (u: string) => ['g', 'kg', 'oz'].includes(u)
  const isVolume = (u: string) => ['ml', 'l'].includes(u)
  if (isWeight(a.unit) !== isWeight(b.unit) && isVolume(a.unit) !== isVolume(b.unit)) {
    return 0 // different categories, neutral
  }

  const ga = toGrams(a)
  const gb = toGrams(b)
  const ratio = Math.min(ga, gb) / Math.max(ga, gb)

  if (ratio > 0.9) return 0.2   // same size → bonus
  if (ratio < 0.5) return -0.3  // very different size → penalty
  return 0 // somewhat similar, neutral
}

// --- Word overlap matching ---

function normalizeForMatch(text: string): string {
  let t = text.toLowerCase()
  // Strip punctuation, collapse whitespace
  t = t.replace(/[,.\-\/()[\]{}'"!@#$%^&*+=;:<>?~`|\\]/g, ' ')
  t = t.replace(/\s+/g, ' ').trim()
  return t
}

function getWords(text: string): string[] {
  return normalizeForMatch(text).split(' ').filter(w => w.length > 0)
}

function wordOverlap(wordsA: string[], wordsB: string[]): number {
  if (wordsA.length === 0 || wordsB.length === 0) return 0
  const setA = new Set(wordsA)
  const setB = new Set(wordsB)

  // Count words that appear in both (exact match or substring containment)
  let common = 0
  for (const wa of setA) {
    for (const wb of setB) {
      if (wa === wb || (wa.length >= 3 && wb.includes(wa)) || (wb.length >= 3 && wa.includes(wb))) {
        common++
        break
      }
    }
  }

  // Use max(unique words) as denominator — stricter than min()
  // This prevents 1-word matches from scoring 1.0
  const total = Math.max(setA.size, setB.size)
  return common / total
}

// Calculate match score between two products
function matchScore(a: NormalizedProduct, b: NormalizedProduct): number {
  const textA = [a.name, a.nameEn, a.brand].filter(Boolean).join(' ')
  const textB = [b.name, b.nameEn, b.brand].filter(Boolean).join(' ')

  // Check if products share a key brand/product word (substring match)
  // This catches Thai brand names like เฮลบลูบอย matching across stores
  const normA = textA.toLowerCase()
  const normB = textB.toLowerCase()

  // Find longest common substring (min 3 chars) — brand detection
  let hasCommonBrand = false
  const wordsA = getWords(textA)
  const wordsB = getWords(textB)

  for (const wa of wordsA) {
    if (wa.length < 3) continue
    for (const wb of wordsB) {
      if (wb.length < 3) continue
      // Check substring containment (handles Thai compound words)
      if (wa.includes(wb) || wb.includes(wa) || wa === wb) {
        hasCommonBrand = true
        break
      }
    }
    if (hasCommonBrand) break
  }

  // If no common brand/keyword at all, very unlikely to be same product
  if (!hasCommonBrand) return 0

  // Word overlap similarity
  const similarity = wordOverlap(wordsA, wordsB)

  // Size-aware bonus/penalty
  const sizeA = extractSize(textA)
  const sizeB = extractSize(textB)
  const sizeAdj = sameSize(sizeA, sizeB)

  return similarity + sizeAdj
}

// Match products from two stores
export function matchProducts(
  makroProducts: NormalizedProduct[],
  lotusProducts: NormalizedProduct[],
): CompareResult[] {
  const results: CompareResult[] = []
  const usedLotus = new Set<number>()
  const usedMakro = new Set<number>()

  // For each Makro product, find best Lotus match
  for (let mi = 0; mi < makroProducts.length; mi++) {
    const makro = makroProducts[mi]
    let bestScore = 0
    let bestIdx = -1

    for (let li = 0; li < lotusProducts.length; li++) {
      if (usedLotus.has(li)) continue
      const score = matchScore(makro, lotusProducts[li])
      if (score > bestScore) {
        bestScore = score
        bestIdx = li
      }
    }

    // Threshold: 0.45+ = match (tested by Peter)
    if (bestScore >= 0.45 && bestIdx >= 0) {
      const lotus = lotusProducts[bestIdx]
      usedLotus.add(bestIdx)
      usedMakro.add(mi)

      // Compare per-unit prices (Makro sells bulk packs)
      const makroComparePrice = makro.perUnitPrice
      const lotusComparePrice = lotus.perUnitPrice
      const diff = makroComparePrice - lotusComparePrice

      results.push({
        type: 'matched',
        name: makro.nameEn || makro.name || lotus.name,
        makro,
        lotus,
        cheaper: Math.abs(diff) < 0.5 ? 'equal' : diff < 0 ? 'makro' : 'lotus',
        priceDiff: Math.round(Math.abs(diff)),
      })
    }
  }

  // Add unmatched
  for (let mi = 0; mi < makroProducts.length; mi++) {
    if (!usedMakro.has(mi)) {
      results.push({ type: 'unmatched', product: makroProducts[mi] })
    }
  }
  for (let li = 0; li < lotusProducts.length; li++) {
    if (!usedLotus.has(li)) {
      results.push({ type: 'unmatched', product: lotusProducts[li] })
    }
  }

  // Sort: matched first (by price diff desc), then unmatched
  results.sort((a, b) => {
    if (a.type === 'matched' && b.type !== 'matched') return -1
    if (a.type !== 'matched' && b.type === 'matched') return 1
    if (a.type === 'matched' && b.type === 'matched') return b.priceDiff - a.priceDiff
    return 0
  })

  return results
}
