import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-webhook-secret')

  if (!secret || secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return Response.json({ error: 'Invalid secret' }, { status: 401 })
  }

  let body: { _type?: string; result?: { _type?: string } } = {}
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const _type = body._type ?? body.result?._type

  switch (_type) {
    case 'attorney':
      revalidateTag('attorneys')
      revalidatePath('/attorneys', 'layout')
      break
    case 'location':
      revalidateTag('locations')
      revalidatePath('/locations', 'page')
      revalidatePath('/contact', 'page')
      revalidatePath('/', 'layout')
      break
    case 'newsArticle':
      revalidateTag('news')
      revalidatePath('/news', 'layout')
      revalidatePath('/', 'layout')
      break
    case 'practiceArea':
      revalidateTag('practiceAreas')
      revalidatePath('/practice-areas', 'layout')
      break
    case 'page':
      revalidateTag('pages')
      revalidatePath('/', 'layout')
      revalidatePath('/locations', 'page')
      revalidatePath('/contact', 'page')
      revalidatePath('/attorneys', 'page')
      revalidatePath('/practice-areas', 'page')
      revalidatePath('/news', 'page')
      break
    case 'siteSettings':
      revalidateTag('siteSettings')
      revalidatePath('/', 'layout')
      break
    default:
      revalidatePath('/', 'layout')
  }

  return Response.json({ revalidated: true, type: _type })
}
