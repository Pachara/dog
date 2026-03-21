import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

interface Product {
  name: string
  salePrice: number
  originalPrice: number
  discount: string
}

function parseCSVLine(line: string): string[] {
  const fields: string[] = []
  let current = ''
  let inQuotes = false
  for (const ch of line) {
    if (ch === '"') {
      inQuotes = !inQuotes
    } else if (ch === ',' && !inQuotes) {
      fields.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }
  fields.push(current.trim())
  return fields
}

function parsePrice(s: string): number {
  return parseInt(s.replace(/,/g, ''), 10) || 0
}

export default defineEventHandler(async (): Promise<Product[]> => {
  const csvPath = join(process.cwd(), 'server', 'data', 'makro-products.csv')
  const raw = await readFile(csvPath, 'utf-8')
  const lines = raw.trim().split('\n')

  // Skip header
  return lines.slice(1).map(line => {
    const [name, salePrice, originalPrice, discount] = parseCSVLine(line)
    return {
      name: name || '',
      salePrice: parsePrice(salePrice),
      originalPrice: parsePrice(originalPrice),
      discount: discount || '',
    }
  }).filter(p => p.name)
})
