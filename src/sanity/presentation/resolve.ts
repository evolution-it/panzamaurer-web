import {
  defineLocations,
  PresentationPluginOptions,
} from 'sanity/presentation'

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    attorney: defineLocations({
      select: { name: 'name', slug: 'slug.current' },
      resolve: (doc) =>
        doc?.slug
          ? { locations: [{ title: doc.name ?? 'Attorney', href: `/attorneys/${doc.slug}` }] }
          : null,
    }),
    location: defineLocations({
      select: { name: 'name' },
      resolve: () => ({ locations: [{ title: 'Locations', href: '/locations' }] }),
    }),
    newsArticle: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) =>
        doc?.slug
          ? {
              locations: [
                { title: doc.title ?? 'Article', href: `/news/${doc.slug}` },
                { title: 'News', href: '/news' },
              ],
            }
          : null,
    }),
    practiceArea: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) =>
        doc?.slug
          ? {
              locations: [
                { title: doc.title ?? 'Practice Area', href: `/practice-areas/${doc.slug}` },
                { title: 'Practice Areas', href: '/practice-areas' },
              ],
            }
          : null,
    }),
    page: defineLocations({
      select: { title: 'title', slug: 'slug.current' },
      resolve: (doc) =>
        doc?.slug
          ? { locations: [{ title: doc.title ?? 'Page', href: `/${doc.slug}` }] }
          : null,
    }),
  },
}
