// RSS feed parser — fetches XML and converts to article objects
// No external library needed — uses built-in fetch + DOMParser-like regex approach

export type RssItem = {
  title: string
  link: string
  description: string
  pubDate: string
  imageUrl: string | null
  guid: string
}

function extractText(xml: string, tag: string): string {
  const cdata = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i')
  const plain = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i')
  const cdataMatch = xml.match(cdata)
  if (cdataMatch) return cdataMatch[1].trim()
  const plainMatch = xml.match(plain)
  return plainMatch ? plainMatch[1].replace(/<[^>]*>/g, '').trim() : ''
}

function extractAll(xml: string, tag: string): string[] {
  const cdata = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'gi')
  const plain = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi')
  const results: string[] = []
  let m: RegExpExecArray | null
  // Try CDATA first
  while ((m = cdata.exec(xml)) !== null) results.push(m[1].trim())
  if (results.length > 0) return results
  while ((m = plain.exec(xml)) !== null) {
    results.push(m[1].replace(/<[^>]*>/g, '').trim())
  }
  return results
}

function extractImage(itemXml: string): string | null {
  // Try media:content
  const media = itemXml.match(/media:content[^>]+url="([^"]+)"/i)
  if (media) return media[1]
  // Try media:thumbnail
  const thumb = itemXml.match(/media:thumbnail[^>]+url="([^"]+)"/i)
  if (thumb) return thumb[1]
  // Try enclosure
  const encl = itemXml.match(/enclosure[^>]+url="([^"]+)"/i)
  if (encl) return encl[1]
  // Try og:image in description
  const og = itemXml.match(/src="(https?:\/\/[^"]+\.(jpg|jpeg|png|webp)[^"]*)"/i)
  if (og) return og[1]
  return null
}

function splitItems(xml: string): string[] {
  const items: string[] = []
  const re = /<item[^>]*>([\s\S]*?)<\/item>/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(xml)) !== null) items.push(m[1])
  return items
}

export function cleanHtmlText(text: string): string {
  if (!text) return ''
  
  return text
    // 1. Strip all HTML tags
    .replace(/<[^>]*>/g, '')
    // 2. Decode common HTML entities
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8230;/g, '...')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    // 3. Remove typical RSS feed signatures
    .replace(/The post .* appeared first on .*/gi, '')
    // 4. Remove trailing read more links and URLs
    .replace(/Read More:\s*https?:\/\/\S+/gi, '')
    .replace(/https?:\/\/\S+/gi, '')
    // 5. Clean up duplicate spaces
    .replace(/\s+/g, ' ')
    .trim()
}

export async function parseRssFeed(url: string): Promise<RssItem[]> {
  try {
    const res = await fetch(url, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/xml, text/xml, */*'
      },
      next: { revalidate: 43200 }, // Caches for 12 hours (twice a day)
    })
    if (!res.ok) {
      console.warn(`RSS fetch returned status ${res.status} for ${url}`)
      return []
    }
    const xml = await res.text()
    const items = splitItems(xml)

    return items.map((item) => {
      const rawTitle = extractText(item, 'title')
      const rawDesc = extractText(item, 'description')
      
      return {
        title: cleanHtmlText(rawTitle),
        link: extractText(item, 'link') || extractText(item, 'guid'),
        description: cleanHtmlText(rawDesc),
        pubDate: extractText(item, 'pubDate'),
        imageUrl: extractImage(item),
        guid: extractText(item, 'guid') || extractText(item, 'link'),
      }
    }).filter((it) => it.title && it.link)
  } catch (e) {
    console.error(`RSS fetch error for ${url}:`, e)
    return []
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export function estimateReadTime(text: string): string {
  const words = text.split(/\s+/).length
  const minutes = Math.max(1, Math.round(words / 200))
  return `${minutes} min read`
}
