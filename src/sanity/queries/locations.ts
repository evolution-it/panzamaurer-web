import { groq } from 'next-sanity'

export const LOCATIONS_QUERY = groq`
  *[_type == "location"] | order(order asc) {
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
  }
`
