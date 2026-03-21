// Product matching — matches same products across Makro and Lotus's
// Key insight: Thai product names often have NO spaces between words,
// so word-level overlap fails. Uses substring containment instead.

export interface NormalizedProduct {
  id: string
  name: string       // Thai name (primary for matching)
  nameEn: string     // English name (Makro only)
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

// --- Normalize text for comparison ---
// Strip punctuation, numbers, units — keep only "word content"
// CRITICAL: Normalize Thai Unicode (Makro uses decomposed ํ+า, Lotus uses composed ำ)
function normalizeText(text: string): string {
  return text
    .normalize('NFC')
    .replace(/\u0e4d\u0e32/g, '\u0e33')     // Thai: ํ+า → ำ (Makro uses decomposed form)
    .toLowerCase()
    .replace(/\d+/g, ' ')                    // remove numbers
    .replace(/[,.\-\/()[\]{}'"!@#$%^&*+=;:<>?~`|\\×x]/g, ' ')
    .replace(/กก\.|กิโลกรัม|กรัม|กร\./gi, ' ')  // Thai units
    .replace(/\b(kg|g|ml|l|oz|cc)\b/gi, ' ')     // English units
    .replace(/แพ็ค|pack|ชิ้น|กล่อง|ถุง|ขวด|ซอง|box|bag|ขนาด/gi, ' ')
    .replace(/\s+/g, '')                     // collapse ALL whitespace
    .trim()
}

// Substring containment score between two normalized strings
// "มิตรผลน้ำตาลทราย" vs "มิตรผลน้ำตาลทรายบริสุทธิ์" → high score
function substringScore(a: string, b: string): number {
  if (!a || !b) return 0
  // Check if one contains the other
  if (a.includes(b) || b.includes(a)) {
    const shorter = Math.min(a.length, b.length)
    const longer = Math.max(a.length, b.length)
    return shorter / longer  // 1.0 = identical, 0.5 = half contained
  }

  // Find longest common substring
  const shorter = a.length <= b.length ? a : b
  const longer = a.length > b.length ? a : b
  let bestLen = 0

  for (let i = 0; i < shorter.length; i++) {
    for (let len = shorter.length - i; len > bestLen; len--) {
      const sub = shorter.substring(i, i + len)
      if (longer.includes(sub)) {
        bestLen = len
        break
      }
    }
  }

  if (bestLen < 3) return 0
  return bestLen / Math.max(a.length, b.length)
}

// Extract all numbers from text
function extractNumbers(text: string): number[] {
  const matches = text.normalize('NFC').replace(/\u0e4d\u0e32/g, '\u0e33').match(/\d+\.?\d*/g)
  if (!matches) return []
  return matches
    .map(m => parseFloat(m))
    .filter(n => n > 0 && n < 100000)
    .sort((a, b) => a - b)
}

// Number overlap score
function numberOverlap(nums1: number[], nums2: number[]): number {
  if (nums1.length === 0 && nums2.length === 0) return 0.3 // neutral
  if (nums1.length === 0 || nums2.length === 0) return 0

  let matches = 0
  const used = new Set<number>()
  for (const n1 of nums1) {
    for (let i = 0; i < nums2.length; i++) {
      if (!used.has(i) && Math.abs(n1 - nums2[i]) < 0.01) {
        matches++
        used.add(i)
        break
      }
    }
  }
  return matches / Math.max(nums1.length, nums2.length)
}

// Size extraction for size-aware matching
interface SizeInfo { value: number; unit: string }

function extractSize(text: string): SizeInfo | null {
  const t = text.normalize('NFC').replace(/\u0e4d\u0e32/g, '\u0e33').toLowerCase()
  const patterns: [RegExp, string][] = [
    [/(\d+\.?\d*)\s*(?:กก\.|กิโลกรัม|kg)\b/i, 'kg'],
    [/(\d+\.?\d*)\s*(?:กรัม|กร\.|g(?:ram)?)\b/i, 'g'],
    [/(\d+\.?\d*)\s*(?:ลิตร|ล\.|liter|litre|lt)\b/i, 'l'],
    [/(\d+\.?\d*)\s*(?:มล\.|มิลลิลิตร|ml)\b/i, 'ml'],
  ]
  for (const [regex, unit] of patterns) {
    const match = t.match(regex)
    if (match) return { value: parseFloat(match[1]), unit }
  }
  return null
}

function sizeAdjustment(a: SizeInfo | null, b: SizeInfo | null): number {
  if (!a || !b) return 0
  const toBase = (s: SizeInfo) => {
    if (s.unit === 'kg') return s.value * 1000
    if (s.unit === 'l') return s.value * 1000
    return s.value
  }
  const isWeight = (u: string) => ['g', 'kg'].includes(u)
  const isVolume = (u: string) => ['ml', 'l'].includes(u)
  if (isWeight(a.unit) !== isWeight(b.unit) && isVolume(a.unit) !== isVolume(b.unit)) return 0

  const ratio = Math.min(toBase(a), toBase(b)) / Math.max(toBase(a), toBase(b))
  if (ratio > 0.9) return 0.15   // same size → bonus
  if (ratio < 0.5) return -0.3   // very different → penalty
  return 0
}

// --- Main match score ---
function matchScore(a: NormalizedProduct, b: NormalizedProduct): number {
  // 1. Compare Thai text using substring containment (NOT word overlap)
  //    This handles Thai text with no spaces: "มิตรผลน้ำตาลทราย" vs "มิตรผลน้ำตาลทรายบริสุทธิ์"
  const thaiA = normalizeText(a.name + ' ' + a.brand)
  const thaiB = normalizeText(b.name + ' ' + b.brand)
  const thaiScore = substringScore(thaiA, thaiB)

  // 2. Compare English text if available (word-level is fine for English)
  let engScore = 0
  if (a.nameEn && b.nameEn) {
    const engNormA = normalizeText(a.nameEn)
    const engNormB = normalizeText(b.nameEn)
    engScore = substringScore(engNormA, engNormB)
  }

  // Take best language match
  const textScore = Math.max(thaiScore, engScore)

  // 3. Number matching (language-independent)
  const numsA = extractNumbers(a.name + ' ' + a.nameEn)
  const numsB = extractNumbers(b.name + ' ' + b.nameEn)
  const numScore = numberOverlap(numsA, numsB)

  // 4. Size adjustment
  const sizeAdj = sizeAdjustment(
    extractSize(a.name + ' ' + a.nameEn),
    extractSize(b.name + ' ' + b.nameEn),
  )

  // Weighted: text similarity is king, numbers help confirm
  return textScore * 0.55 + numScore * 0.30 + sizeAdj
}

// --- Match products ---
export function matchProducts(
  makroProducts: NormalizedProduct[],
  lotusProducts: NormalizedProduct[],
): CompareResult[] {
  const results: CompareResult[] = []
  const usedLotus = new Set<number>()
  const usedMakro = new Set<number>()

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

    if (bestScore >= 0.40 && bestIdx >= 0) {
      const lotus = lotusProducts[bestIdx]
      usedLotus.add(bestIdx)
      usedMakro.add(mi)

      const makroCompare = makro.perUnitPrice
      const lotusCompare = lotus.perUnitPrice
      const diff = makroCompare - lotusCompare

      results.push({
        type: 'matched',
        name: makro.name || makro.nameEn,
        makro,
        lotus,
        cheaper: Math.abs(diff) < 0.5 ? 'equal' : diff < 0 ? 'makro' : 'lotus',
        priceDiff: Math.round(Math.abs(diff)),
      })
    }
  }

  for (let mi = 0; mi < makroProducts.length; mi++) {
    if (!usedMakro.has(mi)) results.push({ type: 'unmatched', product: makroProducts[mi] })
  }
  for (let li = 0; li < lotusProducts.length; li++) {
    if (!usedLotus.has(li)) results.push({ type: 'unmatched', product: lotusProducts[li] })
  }

  results.sort((a, b) => {
    if (a.type === 'matched' && b.type !== 'matched') return -1
    if (a.type !== 'matched' && b.type === 'matched') return 1
    if (a.type === 'matched' && b.type === 'matched') return b.priceDiff - a.priceDiff
    return 0
  })

  return results
}
