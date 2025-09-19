export function truncateText(text: string, maxLength: number = 200): string {
  if (text.length <= maxLength) {
    return text;
  }

  // Find the last space before the max length to avoid cutting words
  const truncated = text.slice(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');

  if (lastSpaceIndex > 0) {
    return truncated.slice(0, lastSpaceIndex) + '...';
  }

  return truncated + '...';
}