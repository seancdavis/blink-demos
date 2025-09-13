/**
 * Truncate text to a specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text
  }
  return text.substring(0, maxLength).trim() + '...'
}

/**
 * Convert newlines to HTML line breaks
 */
export function newlineToLineBreak(text: string): string {
  return text.replace(/\n/g, '<br>')
}