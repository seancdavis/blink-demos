import type { Config, Context } from '@netlify/edge-functions'
import * as jose from 'https://deno.land/x/jose@v5.9.2/index.ts'
import { FeedbackName } from '../../src/utils/feedback-data.ts'
import { getStore } from '@netlify/blobs'
import { User } from '../../src/types.d.ts'

export default async function handler(request: Request, context: Context) {
  const { cookies } = context
  const url = request.url
  const requestPath = new URL(url).pathname
  const isAuthPage = ['/login', '/register', '/api/auth/register', '/api/auth/login'].includes(
    requestPath,
  )

  const setFeedback = (value: FeedbackName) => {
    cookies.set({ name: 'u_feedback', value, path: '/', httpOnly: true, sameSite: 'Strict' })
  }

  const sessionCookie = cookies.get('u_session')
  if (!sessionCookie && !isAuthPage) {
    setFeedback('login_required')
    return Response.redirect('/login', 303)
  }

  let decodedJwt: User | null = null

  try {
    decodedJwt = jose.decodeJwt(sessionCookie)
  } catch (error) {
    if (!isAuthPage) {
      cookies.delete({ name: 'u_session', path: '/' })
      setFeedback('login_required')
      return Response.redirect('/login', 303)
    }
  }

  if (!decodedJwt && !isAuthPage) {
    setFeedback('login_required')
    return Response.redirect('/login', 303)
  }

  if (!decodedJwt) {
    return context.next()
  }

  const userStore = getStore('User')
  const userBlob: User | null = await userStore.get(decodedJwt.id, { type: 'json' })

  if (!userBlob && !isAuthPage) {
    setFeedback('login_required')
    return Response.redirect('/login', 303)
  }

  if (!userBlob) {
    return context.next()
  }

  const userMatches =
    userBlob &&
    userBlob.username === decodedJwt.username &&
    userBlob.id === decodedJwt.id &&
    userBlob.password === decodedJwt.password

  if (!userMatches && !isAuthPage) {
    setFeedback('login_required')
    return Response.redirect('/login', 303)
  }

  if (userMatches && isAuthPage) {
    setFeedback('already_logged_in')
    return Response.redirect('/', 303)
  }

  return context.next()
}

export const config: Config = {
  path: '/*',
}
