/**
 * Truncates text to a specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) {
    return text
  }
  
  // Find the last complete word within the limit
  const truncated = text.slice(0, maxLength)
  const lastSpaceIndex = truncated.lastIndexOf(' ')
  
  // If there's a space, cut at the last word boundary
  if (lastSpaceIndex > 0) {
    return truncated.slice(0, lastSpaceIndex) + '…'
  }
  
  // Otherwise, just truncate at the limit
  return truncated + '…'
}