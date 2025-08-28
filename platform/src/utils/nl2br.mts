/**
 * Converts newlines in text to HTML line breaks
 */
export function newlineToLineBreak(text: string): string {
  return text.replace(/\r?\n/g, '<br>')
}