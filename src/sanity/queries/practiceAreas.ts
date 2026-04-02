import { groq } from 'next-sanity'

export const PRACTICE_AREAS_LIST_QUERY = groq`
  *[_type == "practiceArea" && status == "published" && showOnPracticeAreasPage != false] | order(orderRank asc, title asc) {
    _id,
    title,
    slug,
    heading,
    summary,
    status
  }
`

export const PRACTICE_AREA_BY_SLUG_QUERY = groq`
  *[_type == "practiceArea" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    heading,
    content,
    status,
    featuredAttorneys[]-> {
      _id,
      name,
      role,
      slug,
      image
    }
  }
`

export const PRACTICE_AREA_SLUGS_QUERY = groq`
  *[_type == "practiceArea" && status == "published"].slug.current
`

export const NAV_PRACTICE_AREAS_QUERY = groq`
  *[_type == "practiceArea" && status == "published" && showInNavDropdown == true] | order(orderRank asc, title asc) {
    _id,
    title,
    slug
  }
`
