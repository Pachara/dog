// Product matching algorithm — matches same products across Makro and Lotus's
// Uses number extraction + price similarity + token overlap

export interface NormalizedProduct {
  id: string
  name: string
  nameEn: string
  brand: string
  price: number
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

// --- Brand translation map (top Thai brands) ---
const BRAND_MAP: Record<string, string> = {
  'มาม่า': 'mama',
  'โอสถสภา': 'osotspa',
  'เนสท์เล่': 'nestle',
  'เนสเล่': 'nestle',
  'ยูนิลีเวอร์': 'unilever',
  'ซีพี': 'cp',
  'เบทาโกร': 'betagro',
  'ดัชมิลล์': 'dutchmill',
  'ไทย-เดนมาร์ค': 'thai-denmark',
  'ไทยเดนมาร์ค': 'thai-denmark',
  'แลคตาซอย': 'lactasoy',
  'โคคา-โคลา': 'coca-cola',
  'โคคาโคล่า': 'coca-cola',
  'เป๊ปซี่': 'pepsi',
  'สิงห์': 'singha',
  'ช้าง': 'chang',
  'ลีโอ': 'leo',
  'เอส-26': 's-26',
  'ดาว': 'dow',
  'น้ำมันพืช': 'vegetable-oil',
  'ไลอ้อน': 'lion',
  'บรีส': 'breeze',
  'โฟร์โมสต์': 'foremost',
  'เมจิ': 'meiji',
  'โลโบ': 'lobo',
  'อิชิตัน': 'ichitan',
  'โออิชิ': 'oishi',
  'คนอร์': 'knorr',
  'รอยัลแคนิน': 'royal-canin',
  'แม็กกี้': 'maggi',
  'คอลเกต': 'colgate',
}

// Extract all numbers from a string (weights, quantities, sizes)
function extractNumbers(text: string): number[] {
  const nums: number[] = []
  // Match numbers like 55, 1.5, 500, including those in Thai text
  const matches = text.match(/\d+\.?\d*/g)
  if (matches) {
    for (const m of matches) {
      const n = parseFloat(m)
      if (n > 0 && n < 100000) nums.push(n)
    }
  }
  return nums.sort((a, b) => a - b)
}

// Normalize text for comparison
function normalizeText(text: string): string[] {
  let t = text.toLowerCase()
  // Replace Thai brand names with English equivalents
  for (const [thai, eng] of Object.entries(BRAND_MAP)) {
    t = t.replace(new RegExp(thai, 'g'), eng)
  }
  // Remove common filler words
  t = t.replace(/แพ็ค|pack|ชิ้น|pieces?|กล่อง|box|ถุง|bag|ขวด|bottle|กระป๋อง|can|ซอง|sachet/gi, '')
  // Remove units (keep numbers)
  t = t.replace(/กรัม|กก\.|kg|g|ml|มล\.|ลิตร|l|cc|oz/gi, '')
  // Split into tokens, remove empty
  return t.split(/[\s,.\-\/×x()]+/).filter(tok => tok.length > 0)
}

// Calculate number overlap score (0-1)
function numberOverlap(nums1: number[], nums2: number[]): number {
  if (nums1.length === 0 && nums2.length === 0) return 0.5
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
  const total = Math.max(nums1.length, nums2.length)
  return matches / total
}

// Calculate token overlap score (0-1)
function tokenOverlap(tokens1: string[], tokens2: string[]): number {
  if (tokens1.length === 0 || tokens2.length === 0) return 0
  const set2 = new Set(tokens2)
  let matches = 0
  for (const t of tokens1) {
    if (set2.has(t)) matches++
  }
  const total = Math.max(tokens1.length, tokens2.length)
  return matches / total
}

// Price similarity (0-1, 1 = same price)
function priceSimilarity(p1: number, p2: number): number {
  if (p1 === 0 || p2 === 0) return 0
  const ratio = Math.min(p1, p2) / Math.max(p1, p2)
  return ratio
}

// Calculate match score between two products
function matchScore(a: NormalizedProduct, b: NormalizedProduct): number {
  const numsA = extractNumbers(a.name + ' ' + a.nameEn)
  const numsB = extractNumbers(b.name + ' ' + b.nameEn)
  const tokensA = normalizeText(a.name + ' ' + a.nameEn + ' ' + a.brand)
  const tokensB = normalizeText(b.name + ' ' + b.nameEn + ' ' + b.brand)

  const numScore = numberOverlap(numsA, numsB)
  const textScore = tokenOverlap(tokensA, tokensB)
  const priceScore = priceSimilarity(a.price, b.price)

  // Weighted combination: numbers most important, then text, then price
  return numScore * 0.45 + textScore * 0.30 + priceScore * 0.25
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

    // Threshold: 0.55+ = match
    if (bestScore >= 0.55 && bestIdx >= 0) {
      const lotus = lotusProducts[bestIdx]
      usedLotus.add(bestIdx)
      usedMakro.add(mi)

      const diff = makro.price - lotus.price
      results.push({
        type: 'matched',
        name: makro.nameEn || makro.name,
        makro,
        lotus,
        cheaper: Math.abs(diff) < 1 ? 'equal' : diff < 0 ? 'makro' : 'lotus',
        priceDiff: Math.abs(diff),
      })
    }
  }

  // Add unmatched Makro products
  for (let mi = 0; mi < makroProducts.length; mi++) {
    if (!usedMakro.has(mi)) {
      results.push({ type: 'unmatched', product: makroProducts[mi] })
    }
  }

  // Add unmatched Lotus products
  for (let li = 0; li < lotusProducts.length; li++) {
    if (!usedLotus.has(li)) {
      results.push({ type: 'unmatched', product: lotusProducts[li] })
    }
  }

  // Sort: matched pairs first (by price diff desc), then unmatched
  results.sort((a, b) => {
    if (a.type === 'matched' && b.type !== 'matched') return -1
    if (a.type !== 'matched' && b.type === 'matched') return 1
    if (a.type === 'matched' && b.type === 'matched') return b.priceDiff - a.priceDiff
    return 0
  })

  return results
}
