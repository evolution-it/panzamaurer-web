import { groq } from 'next-sanity'

export const PRACTICE_AREAS_LIST_QUERY = groq`
  *[_type == "practiceArea" && status == "published"] | order(title asc) {
    _id,
    title,
    slug,
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
