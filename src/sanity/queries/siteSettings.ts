import { groq } from 'next-sanity'

export const SITE_SETTINGS_QUERY = groq`
  *[_type == "siteSettings"][0] {
    siteName,
    footerTagline,
    contactEmail,
    contactPhone,
    footerLocations[]-> {
      _id,
      name,
      building,
      address,
      city,
      phone,
      fax,
      order
    },
    navItems[] {
      _key,
      label,
      path,
      hasDropdown
    }
  }
`
