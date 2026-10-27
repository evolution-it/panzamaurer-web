import ConsultingDetail from '@/components/ConsultingDetail'
import { CONSULTING_OVERVIEW, CONSULTING_TEAM } from '@/data/consulting'
import { getDraftModeClient } from '@/sanity/draftMode'
import { ATTORNEYS_BY_SLUGS_QUERY } from '@/sanity/queries/attorneys'

export const metadata = {
  title: 'Consulting | Panza Maurer',
}

type Attorney = {
  _id: string
  name: string
  role?: string
  slug?: { current: string }
  image?: { asset: { _ref: string } } | null
}

export default async function ConsultingPage() {
  const { sanityClient, cacheTags } = await getDraftModeClient()
  const slugs = CONSULTING_TEAM.map((member) => member.slug)

  const attorneys = await sanityClient
    .fetch<Attorney[]>(ATTORNEYS_BY_SLUGS_QUERY, { slugs }, cacheTags(['attorneys']))
    .catch(() => [] as Attorney[])

  const bySlug = new Map(
    attorneys.filter((attorney) => attorney.slug?.current).map((attorney) => [attorney.slug!.current, attorney]),
  )

  const team = CONSULTING_TEAM.map((member) => {
    const attorney = bySlug.get(member.slug)
    return {
      _id: attorney?._id ?? member.slug,
      name: attorney?.name ?? member.name,
      role: attorney?.role || member.role,
      slug: attorney?.slug?.current ?? member.slug,
      image: member.imageSrc ? null : (attorney?.image ?? null),
      imageSrc: member.imageSrc,
    }
  })

  return (
    <ConsultingDetail
      eyebrow={CONSULTING_OVERVIEW.eyebrow}
      title={CONSULTING_OVERVIEW.title}
      heading={CONSULTING_OVERVIEW.heading}
      paragraphs={CONSULTING_OVERVIEW.paragraphs}
      team={team}
      teamHeading={CONSULTING_OVERVIEW.teamHeading}
    />
  )
}
