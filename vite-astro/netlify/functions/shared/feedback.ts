
export function createFeedbackResponse(feedbackValue: string, redirectTo: string = '/'): Response {
  const headers = new Headers()
  headers.set('Location', redirectTo)

  // Set feedback cookie
  const feedbackCookie = `blink_feedback=${feedbackValue}; Path=/; HttpOnly; SameSite=strict`
  headers.set('Set-Cookie', feedbackCookie)

  return new Response(null, {
    status: 302,
    headers
  })
}

export function createSuccessResponse(data: any): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function createErrorResponse(message: string, status: number = 400): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}