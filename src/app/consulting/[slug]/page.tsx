import { notFound } from 'next/navigation'
import ConsultingDetail from '@/components/ConsultingDetail'
import { CONSULTING_SERVICES, getConsultingService } from '@/data/consulting'

export function generateStaticParams() {
  return CONSULTING_SERVICES.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = getConsultingService(slug)
  return {
    title: service ? `${service.title} | Panza Maurer` : 'Consulting | Panza Maurer',
  }
}

export default async function ConsultingServicePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = getConsultingService(slug)

  if (!service) {
    notFound()
  }

  return (
    <ConsultingDetail
      eyebrow='Consulting Service'
      title={service.title}
      heading={service.heading}
      paragraphs={service.paragraphs}
      activeSlug={service.slug}
    />
  )
}
