import { groq } from 'next-sanity'

const SECTION_FIELDS = groq`
  _key,
  _type,
  heading,
  boldPrefix,
  body,
  subtitle,
  ctaLabel,
  ctaHref,
  articleCount,
  quote,
  image { asset-> },
  "videos": videos[]{ "url": asset->url },
  "attorneys": attorneys[]-> {
    _id,
    name,
    role,
    slug,
    image,
    type,
    order
  },
  "locations": locations[]-> {
    _id,
    name,
    slug,
    image,
    building,
    address,
    city,
    phone,
    fax,
    order
  },
  "practiceAreas": practiceAreas[]-> {
    _id,
    title,
    slug
  }
`

export const PAGE_BY_SLUG_QUERY = groq`
  *[_type == "page" && slug.current == $slug && status != "archived"][0] {
    _id,
    title,
    navigationLabel,
    slug,
    seoDescription,
    showInNavigation,
    navigationOrder,
    status,
    sections[] { ${SECTION_FIELDS} }
  }
`

export const HOME_PAGE_QUERY = groq`
  *[_type == "page" && slug.current == "home"][0] {
    _id,
    title,
    seoDescription,
    sections[] { ${SECTION_FIELDS} }
  }
`

export const ALL_PAGES_NAV_QUERY = groq`
  *[_type == "page" && showInNavigation == true && status != "archived"] | order(navigationOrder asc) {
    _id,
    title,
    navigationLabel,
    slug
  }
`
