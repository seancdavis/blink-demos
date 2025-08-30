/**
 * Checks if a request should be processed by HTMLRewriter based on URL path and content type
 * @param request - The incoming request
 * @param response - The response from context.next()
 * @returns true if the response should be processed by HTMLRewriter
 */
export function shouldProcessHtml(request: Request, response: Response): boolean {
  const url = new URL(request.url)
  const pathname = url.pathname
  const contentType = response.headers.get('content-type')
  
  // Debug logging for CSS files
  if (pathname.includes('.css')) {
    console.log(`CSS DEBUG - Path: ${pathname}, Content-Type: ${contentType}`)
  }
  
  // Skip processing for static asset file extensions
  if (pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i)) {
    return false
  }

  // Only process HTML responses
  if (contentType && !contentType.includes('text/html')) {
    return false
  }

  return true
}