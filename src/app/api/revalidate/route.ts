import { revalidatePath } from 'next/cache'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-webhook-secret')

  if (!secret || secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return Response.json({ error: 'Invalid secret' }, { status: 401 })
  }

  let body: { _type?: string } = {}
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { _type } = body

  switch (_type) {
    case 'attorney':
      revalidatePath('/attorneys', 'layout')
      break
    case 'location':
      revalidatePath('/locations', 'page')
      revalidatePath('/contact', 'page')
      revalidatePath('/', 'layout')
      break
    case 'newsArticle':
      revalidatePath('/news', 'layout')
      break
    case 'practiceArea':
      revalidatePath('/practice-areas', 'layout')
      break
    case 'page':
      revalidatePath('/', 'layout')
      revalidatePath('/locations', 'page')
      revalidatePath('/contact', 'page')
      revalidatePath('/attorneys', 'page')
      revalidatePath('/practice-areas', 'page')
      revalidatePath('/news', 'page')
      break
    case 'siteSettings':
    default:
      revalidatePath('/', 'layout')
  }

  return Response.json({ revalidated: true, type: _type })
}
