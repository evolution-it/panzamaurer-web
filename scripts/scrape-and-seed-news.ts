/**
 * Scrape all news articles from panzamaurer.com and seed them into Sanity.
 *
 * What it does:
 *   1. Deletes all existing newsArticle documents from Sanity
 *   2. Crawls /news/ through /news/page/24/ to collect article cards
 *   3. For each article: fetches the full page, downloads images, converts
 *      body HTML to Markdown, and creates a newsArticle document in Sanity
 *
 * Note on images:
 *   The listing page shows only the firm logo (not per-article thumbnails).
 *   The first image found inside each article is used as the listing image.
 *   All images in the article body are uploaded as article images.
 *
 * Run with:
 *   npx tsx scripts/scrape-and-seed-news.ts
 */

import { createClient } from '@sanity/client'
import * as cheerio from 'cheerio'
import TurndownService from 'turndown'
import { randomUUID } from 'crypto'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const BASE_URL = 'https://www.panzamaurer.com'
const TOTAL_PAGES = 24
const REQUEST_DELAY_MS = 400
const IMAGE_UPLOAD_DELAY_MS = 150

// ─── Sanity client ────────────────────────────────────────────────────────────

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN!,
  useCdn: false,
})

// ─── Turndown (HTML → Markdown) ────────────────────────────────────────────────

const turndown = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
})
turndown.addRule('removeImages', {
  filter: 'img',
  replacement: () => '',
})
turndown.addRule('unwrapFigure', {
  filter: 'figure',
  replacement: (content) => content.trim(),
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

function key() {
  return randomUUID().replace(/-/g, '').slice(0, 12)
}

function slugFromUrl(url: string): string {
  return url
    .replace(/^https?:\/\/[^/]+\//, '')
    .replace(/\/$/, '')
    .split('/')
    .pop() ?? ''
}

function parseDate(raw: string): string {
  try {
    const d = new Date(raw.trim())
    if (!isNaN(d.getTime())) return d.toISOString().split('T')[0]
  } catch { /* fall through */ }
  return ''
}

const LOGO_PATHS = ['/themes/', '/assets/img/logo', 'logo-dark', 'logo-light']

/** Fix malformed URLs like https://www.www.panzamaurer.com → https://www.panzamaurer.com */
function normalizeUrl(url: string): string {
  return url.replace(/^(https?:\/\/)www\.www\./i, '$1www.')
}

function isLogoOrIcon(src: string): boolean {
  if (src.startsWith('data:')) return true
  if (/\.(svg|gif|ico)(\?|$)/i.test(src)) return true
  if (LOGO_PATHS.some((p) => src.includes(p))) return true
  return false
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PanzaMaurerScraper/1.0)' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`)
  return res.text()
}

async function uploadImageFromUrl(rawImageUrl: string): Promise<string | null> {
  const imageUrl = normalizeUrl(rawImageUrl)
  try {
    if (isLogoOrIcon(imageUrl)) return null

    const res = await fetch(imageUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PanzaMaurerScraper/1.0)' },
    })
    if (!res.ok) return null

    const contentType = res.headers.get('content-type') ?? 'image/jpeg'
    if (!contentType.startsWith('image/')) return null

    const buffer = Buffer.from(await res.arrayBuffer())
    if (buffer.length < 1000) return null // skip tracking pixels

    const rawFilename = imageUrl.split('/').pop()?.split('?')[0] ?? 'image.jpg'
    const filename = rawFilename.slice(0, 100)

    const asset = await client.assets.upload('image', buffer, { filename, contentType })
    await delay(IMAGE_UPLOAD_DELAY_MS)
    return asset._id
  } catch (err) {
    console.warn(`    ⚠ Image upload failed (${imageUrl.slice(0, 70)}): ${(err as Error).message}`)
    return null
  }
}

function imageRef(assetId: string, idx: number) {
  return {
    _key: `img-${idx}-${key()}`,
    _type: 'image',
    asset: { _type: 'reference', _ref: assetId },
  }
}

// ─── Phase 1: Delete all existing newsArticle documents ───────────────────────

async function deleteAllArticles() {
  console.log('\n── Phase 1: Delete existing newsArticle documents ──────────────')
  const ids: string[] = await client.fetch('*[_type == "newsArticle"]._id')
  console.log(`Found ${ids.length} existing document(s)`)

  const BATCH = 50
  for (let i = 0; i < ids.length; i += BATCH) {
    const batch = ids.slice(i, i + BATCH)
    const tx = client.transaction()
    for (const id of batch) tx.delete(id)
    await tx.commit()
    console.log(`  Deleted ${Math.min(i + BATCH, ids.length)} / ${ids.length}`)
  }
  console.log('Done.')
}

// ─── Phase 2: Collect article cards from listing pages ────────────────────────

interface ArticleCard {
  title: string
  dateRaw: string
  excerptRaw: string
  url: string
}

async function scrapeListingPages(): Promise<ArticleCard[]> {
  console.log(`\n── Phase 2: Scraping ${TOTAL_PAGES} listing pages ───────────────────`)
  const cards: ArticleCard[] = []

  for (let page = 1; page <= TOTAL_PAGES; page++) {
    const url =
      page === 1
        ? `${BASE_URL}/news/`
        : `${BASE_URL}/news/page/${page}/`

    try {
      const html = await fetchHtml(url)
      const $ = cheerio.load(html)

      // Posts are in div.post-block (WordPress custom theme, not <article>)
      const posts = $('.post-block')

      if (posts.length === 0) {
        console.log(`  Page ${page}: no posts found — stopping early`)
        break
      }

      posts.each((_i, el) => {
        const elem = $(el)

        // Title and URL from h3 a (or h2 a)
        const titleEl = elem.find('h3 a, h2 a').first()
        const title = titleEl.text().trim()
        const articleUrl = titleEl.attr('href') ?? ''
        if (!title || !articleUrl) return

        // The post-block has two <p> tags:
        //   p[0] = date text (e.g. "December 12, 2025")
        //   p[1] = excerpt (may start with "By Author… text…")
        const paras = elem.find('p')
        const dateRaw = paras.eq(0).text().trim()
        const excerptRaw = paras.eq(1).text().trim()

        cards.push({ title, dateRaw, excerptRaw, url: articleUrl })
      })

      console.log(`  Page ${page}/${TOTAL_PAGES}: ${posts.length} posts — total so far: ${cards.length}`)
    } catch (err) {
      console.warn(`  Page ${page} failed: ${(err as Error).message}`)
    }

    await delay(REQUEST_DELAY_MS)
  }

  // Deduplicate by URL
  const seen = new Set<string>()
  const unique = cards.filter((c) => {
    if (seen.has(c.url)) return false
    seen.add(c.url)
    return true
  })

  console.log(`Collected ${unique.length} unique article URLs.`)
  return unique
}

// ─── Phase 3: Fetch each article, download images, seed Sanity ───────────────

interface ArticleDetail {
  title: string
  author: string | undefined
  excerpt: string
  markdown: string
  categories: string[]
  articleImageUrls: string[]
}

async function scrapeArticle(card: ArticleCard): Promise<ArticleDetail> {
  const html = await fetchHtml(card.url)
  const $ = cheerio.load(html)

  // Title from page h1 (fallback to listing title)
  const title =
    $('h1.entry-title').text().trim() ||
    $('section.content').find('h1').first().text().trim() ||
    card.title

  // Article body lives inside section.content > article
  const contentEl = $('section.content article').first()

  // Author detection: check if first <p> starts with "By "
  let author: string | undefined
  const firstP = contentEl.find('p').first()
  const firstPText = firstP.text().trim()
  if (/^by\s+/i.test(firstPText) && firstPText.length < 150) {
    author = firstPText.replace(/^by\s+/i, '').trim()
    firstP.remove()
  }

  // Derive a clean excerpt from listing data:
  // listing p[1] may be "By Author Name Some excerpt text…" — strip the author part
  let excerpt = card.excerptRaw
  if (author && excerpt.toLowerCase().startsWith('by ')) {
    // Strip "By Author Name " prefix
    excerpt = excerpt.replace(/^by\s+[^.]+?(?=\s{2,}|\.\s|\s[A-Z])/i, '').trim()
  }
  // Remove trailing ellipsis artifact
  excerpt = excerpt.replace(/…$/, '').trim()

  // Collect image URLs before removing them from the DOM
  const articleImageUrls: string[] = []
  contentEl.find('img').each((_i, img) => {
    const src = normalizeUrl($(img).attr('src') ?? '')
    if (src.startsWith('http') && !isLogoOrIcon(src) && !articleImageUrls.includes(src)) {
      articleImageUrls.push(src)
    }
  })

  // Remove img / figure elements so they don't appear in the markdown
  contentEl.find('img, figcaption').remove()

  // Convert body HTML to Markdown
  const bodyHtml = contentEl.html() ?? ''
  const markdown = bodyHtml ? turndown.turndown(bodyHtml).trim() : ''

  if (!markdown) {
    console.warn(`    ⚠ Empty content body: ${card.url}`)
  }

  // Categories from .cat-links and tags from .tags-links
  const categories: string[] = []
  $('[rel="category tag"], .cat-links a, .entry-categories a').each((_i, el) => {
    const cat = $(el).text().trim()
    if (cat && !categories.includes(cat)) categories.push(cat)
  })
  $('[rel="tag"], .tags-links a').each((_i, el) => {
    const tag = $(el).text().trim()
    if (tag && !categories.includes(tag)) categories.push(tag)
  })

  return { title, author, excerpt, markdown, categories, articleImageUrls }
}

async function seedArticles(cards: ArticleCard[]) {
  console.log(`\n── Phase 3: Fetching articles and seeding Sanity (${cards.length} articles) ──`)
  let seeded = 0
  let failed = 0

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i]
    const slug = slugFromUrl(card.url)
    const prefix = `[${i + 1}/${cards.length}]`

    if (!slug) {
      console.warn(`${prefix} Skipping — could not derive slug from: ${card.url}`)
      failed++
      continue
    }

    try {
      const { title, author, excerpt, markdown, categories, articleImageUrls } =
        await scrapeArticle(card)

      // Upload article images; use the first as listing image too
      const articleAssets: string[] = []
      for (const imgUrl of articleImageUrls) {
        const assetId = await uploadImageFromUrl(imgUrl)
        if (assetId) articleAssets.push(assetId)
      }

      // First article image doubles as the listing thumbnail
      const listingAssets = articleAssets.slice(0, 1)

      const safeId = `news-${slug.replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 80)}`

      const doc = {
        _type: 'newsArticle',
        _id: safeId,
        title: title || card.title,
        slug: { _type: 'slug', current: slug },
        date: parseDate(card.dateRaw) || new Date().toISOString().split('T')[0],
        ...(author ? { author } : {}),
        excerpt,
        content: markdown,
        categories,
        status: 'published',
        listingImages: listingAssets.map((id, idx) => imageRef(id, idx)),
        images: articleAssets.map((id, idx) => imageRef(id, idx)),
      }

      await client.createOrReplace(doc)
      seeded++

      const imgNote = articleAssets.length ? ` (${articleAssets.length} img)` : ''
      console.log(`${prefix} ✓ ${(title || card.title).slice(0, 65)}${imgNote}`)
    } catch (err) {
      console.error(`${prefix} ✗ Failed: ${(err as Error).message}`)
      console.error(`         URL: ${card.url}`)
      failed++
    }

    await delay(REQUEST_DELAY_MS)
  }

  console.log(`\nDone. Seeded: ${seeded}  Failed: ${failed}`)
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  const { projectId, dataset } = client.config()
  console.log(`\nScrape & Seed News Articles`)
  console.log(`Project: ${projectId}  Dataset: ${dataset}`)

  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('Error: SANITY_WRITE_TOKEN is not set in .env.local')
    process.exit(1)
  }

  try {
    await deleteAllArticles()
    const cards = await scrapeListingPages()
    await seedArticles(cards)
    console.log('\n✓ Complete.')
  } catch (err) {
    console.error('\nScript failed:', err)
    process.exit(1)
  }
}

run()
