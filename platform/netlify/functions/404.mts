import { Config } from '@netlify/functions'
import { renderPartial } from '../../src/utils/render-partial.mts'

export default async (request: Request) => {
  const html = renderPartial({ name: 'not-found' })
  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

export const config: Config = {
  path: '/404',
}
