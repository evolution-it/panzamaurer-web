import { groq } from 'next-sanity'

const NEWS_CARD_FIELDS = groq`
  _id,
  title,
  slug,
  date,
  excerpt,
  categories,
  listingImages
`

export const LATEST_NEWS_QUERY = groq`
  *[_type == "newsArticle" && status == "published"] | order(date desc) [0...6] {
    ${NEWS_CARD_FIELDS}
  }
`

export const LATEST_NEWS_HOMEPAGE_QUERY = groq`
  *[_type == "newsArticle" && status == "published"] | order(date desc) [0...3] {
    ${NEWS_CARD_FIELDS}
  }
`

export const HOME_NEWS_QUERY = groq`
  *[_type == "newsArticle" && status == "published"] | order(date desc) [0...$count] {
    ${NEWS_CARD_FIELDS}
  }
`

export const ARCHIVE_NEWS_QUERY = groq`
  *[_type == "newsArticle" && status in ["published", "archived"]] | order(date desc) {
    ${NEWS_CARD_FIELDS}
  }
`

export const NEWS_ARTICLE_BY_SLUG_QUERY = groq`
  *[_type == "newsArticle" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    date,
    author,
    excerpt,
    content,
    categories,
    images[],
    listingImages,
    status
  }
`

export const NEWS_SLUGS_QUERY = groq`
  *[_type == "newsArticle" && status in ["published", "archived"]].slug.current
`
