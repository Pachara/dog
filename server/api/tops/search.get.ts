const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9,th;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  'Cache-Control': 'no-cache',
  'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"macOS"',
  'sec-fetch-dest': 'document',
  'sec-fetch-mode': 'navigate',
  'sec-fetch-site': 'none',
  'sec-fetch-user': '?1',
  'upgrade-insecure-requests': '1',
}

// Cache buildId for 10 minutes (changes only on Tops deploy)
let cachedBuildId = ''
let buildIdFetchedAt = 0
const BUILD_ID_TTL = 10 * 60 * 1000

async function getBuildId(): Promise<string> {
  // Return cached if fresh
  if (cachedBuildId && Date.now() - buildIdFetchedAt < BUILD_ID_TTL) {
    return cachedBuildId
  }

  try {
    const res = await fetch('https://www.tops.co.th/en', {
      headers: BROWSER_HEADERS,
    })
    const html = await res.text()
    const match = html.match(/"buildId"\s*:\s*"([^"]+)"/)
    if (match) {
      cachedBuildId = match[1]
      buildIdFetchedAt = Date.now()
      return cachedBuildId
    }
  } catch {}

  // Fallback: use Peter's known buildId
  if (!cachedBuildId) {
    cachedBuildId = 'qhrnns8T80CcI2a93YAu9'
  }
  return cachedBuildId
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const q = (query.q as string || '').trim()

  if (!q) {
    throw createError({ statusCode: 400, statusMessage: 'Search query required' })
  }

  const buildId = await getBuildId()
  const keyword = encodeURIComponent(q)
  const url = `https://www.tops.co.th/_next/data/${buildId}/en/search/${keyword}.json`

  let response = await fetch(url, {
    headers: {
      ...BROWSER_HEADERS,
      'Accept': 'application/json, text/plain, */*',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'Referer': 'https://www.tops.co.th/en',
    },
  })

  // If 404, buildId expired — clear cache, refetch, retry once
  if (response.status === 404) {
    cachedBuildId = ''
    buildIdFetchedAt = 0
    const newBuildId = await getBuildId()
    const retryUrl = `https://www.tops.co.th/_next/data/${newBuildId}/en/search/${keyword}.json`
    response = await fetch(retryUrl, {
      headers: {
        ...BROWSER_HEADERS,
        'Accept': 'application/json, text/plain, */*',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'Referer': 'https://www.tops.co.th/en',
      },
    })
  }

  if (!response.ok) {
    throw createError({
      statusCode: response.status,
      statusMessage: `Tops API error: ${response.status}`,
    })
  }

  const data = await response.json()
  return data
})
