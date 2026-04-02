import type { SanityClient } from 'sanity'

const BATCH_SIZE = 50

/**
 * Delete many documents in batches, sending at most BATCH_SIZE deletes per
 * transaction (= one HTTP request). Avoids 429s from concurrent bulk deletes.
 */
export async function batchDelete(client: SanityClient, ids: string[]): Promise<void> {
  for (let i = 0; i < ids.length; i += BATCH_SIZE) {
    const batch = ids.slice(i, i + BATCH_SIZE)
    const tx = client.transaction()
    batch.forEach((id) => tx.delete(id))
    await tx.commit()
  }
}

/**
 * Unset a field on many documents in batches, one transaction per batch.
 */
export async function batchUnsetField(
  client: SanityClient,
  ids: string[],
  field: string,
): Promise<void> {
  for (let i = 0; i < ids.length; i += BATCH_SIZE) {
    const batch = ids.slice(i, i + BATCH_SIZE)
    const tx = client.transaction()
    batch.forEach((id) => tx.patch(id, (p) => p.unset([field])))
    await tx.commit()
  }
}
