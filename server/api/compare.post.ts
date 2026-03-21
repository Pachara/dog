import type { NormalizedProduct } from '~/server/utils/product-matcher'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ q: string }>(event)

  if (!body.q?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Search query is required' })
  }

  const q = body.q.trim()

  // Search both APIs in parallel
  const [makroRaw, lotusRaw] = await Promise.all([
    fetch('https://search.maknet.siammakro.cloud/search/api/v1/indexes/products/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://www.makro.pro',
        'Referer': 'https://www.makro.pro/',
      },
      body: JSON.stringify({ q, limit: 20 }),
    }).then(r => r.ok ? r.json() : { hits: [] }).catch(() => ({ hits: [] })),

    fetch('https://api-o2o.lotuss.com/lotuss-mobile-bff/product/v5/search?sort=relevance:DESC&limit=20&page=1&seller_id=3', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword: q }),
    }).then(r => r.ok ? r.json() : { data: { products: [] } }).catch(() => ({ data: { products: [] } })),
  ])

  // Parse Makro products
  const makroProducts: NormalizedProduct[] = (makroRaw.hits || []).map((hit: any) => {
    const doc = hit.document || hit
    const images = doc.images || []
    const makroId = doc.makroId || ''
    const id = doc.id || ''
    return {
      id: `makro-${id}`,
      name: doc.title || '',
      nameEn: doc.titleEn || doc.title || '',
      brand: doc.brand || doc.brandEn || '',
      price: doc.displayPrice || 0,
      originalPrice: doc.originalPrice || 0,
      discount: doc.originalPrice > doc.displayPrice
        ? `-${Math.round(((doc.originalPrice - doc.displayPrice) / doc.originalPrice) * 100)}%`
        : '',
      image: images[0] || '',
      link: makroId ? `https://www.makro.pro/th/p/${makroId}-${id}` : '#',
      store: 'makro' as const,
    }
  }).filter((p: NormalizedProduct) => p.name && p.price > 0)

  // Parse Lotus products
  const lotusProducts: NormalizedProduct[] = (lotusRaw?.data?.products || []).map((item: any) => {
    const pr = item.priceRange?.minimumPrice || {}
    const price = pr.finalPrice?.value || 0
    const original = pr.regularPrice?.value || 0
    const pctOff = pr.discount?.percentOff || 0
    return {
      id: `lotus-${item.id || item.urlKey || ''}`,
      name: item.name || '',
      nameEn: '',
      brand: '',
      price,
      originalPrice: original,
      discount: pctOff > 0 ? `-${Math.round(pctOff)}%` : '',
      image: item.thumbnail?.url || '',
      link: item.urlKey ? `https://www.lotuss.com/th/product/${item.urlKey}` : '#',
      store: 'lotus' as const,
    }
  }).filter((p: NormalizedProduct) => p.name && p.price > 0)

  // Match products using the matcher utility (auto-imported by Nitro)
  const results = matchProducts(makroProducts, lotusProducts)

  return {
    results,
    stats: {
      makroTotal: makroProducts.length,
      lotusTotal: lotusProducts.length,
      matched: results.filter(r => r.type === 'matched').length,
      makroCheaper: results.filter(r => r.type === 'matched' && r.cheaper === 'makro').length,
      lotusCheaper: results.filter(r => r.type === 'matched' && r.cheaper === 'lotus').length,
      equal: results.filter(r => r.type === 'matched' && r.cheaper === 'equal').length,
    },
  }
})
