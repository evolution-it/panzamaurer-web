import { groq } from 'next-sanity'

export const ATTORNEYS_LIST_QUERY = groq`
  *[_type == "attorney" && status == "published"] | order(orderRank asc) {
    _id,
    name,
    role,
    slug,
    image,
    type
  }
`

export const ATTORNEY_BY_SLUG_QUERY = groq`
  *[_type == "attorney" && slug.current == $slug][0] {
    _id,
    name,
    firstName,
    role,
    slug,
    image,
    type,
    status,
    intro,
    education,
    barAdmissions,
    courtAdmissions,
    professionalMemberships,
    sections[] {
      title,
      content
    }
  }
`

export const ATTORNEY_SLUGS_QUERY = groq`
  *[_type == "attorney" && status == "published"].slug.current
`

export const TEAM_ATTORNEYS_QUERY = groq`
  *[_type == "attorney" && status == "published" && type == "Our Attorneys"] | order(orderRank asc) [0...5] {
    _id,
    name,
    role,
    slug,
    image
  }
`
