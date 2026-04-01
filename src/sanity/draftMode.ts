import { draftMode } from 'next/headers'
import { client, getDraftClient } from './client'

type FetchOptions = { cache: 'no-store' } | { next: { tags: string[] } }

export async function getDraftModeClient() {
  const { isEnabled } = await draftMode()
  return {
    isEnabled,
    sanityClient: isEnabled ? getDraftClient() : client,
    cacheTags: (tags: string[]): FetchOptions =>
      isEnabled ? { cache: 'no-store' as const } : { next: { tags } },
  }
}
