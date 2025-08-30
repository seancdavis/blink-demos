/**
 * Checks if a request should be processed by HTMLRewriter based on URL path and content type
 * @param request - The incoming request
 * @param response - The response from context.next()
 * @returns true if the response should be processed by HTMLRewriter
 */
export function shouldProcessHtml(request: Request, response: Response): boolean {
  // Skip processing for static asset file extensions
  const url = new URL(request.url)
  if (url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i)) {
    return false
  }

  // Only process HTML responses
  const contentType = response.headers.get('content-type')
  if (contentType && !contentType.includes('text/html')) {
    return false
  }

  return true
}