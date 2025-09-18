export function timeAgoInWords(date: Date): string {
  const now = new Date();
  const secondsPast = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (secondsPast < 60) {
    return secondsPast === 0 ? "just now" : `${secondsPast} seconds ago`;
  }

  const minutesPast = Math.floor(secondsPast / 60);
  if (minutesPast < 60) {
    return minutesPast === 1 ? "1 minute ago" : `${minutesPast} minutes ago`;
  }

  const hoursPast = Math.floor(minutesPast / 60);
  if (hoursPast < 24) {
    return hoursPast === 1 ? "1 hour ago" : `${hoursPast} hours ago`;
  }

  const daysPast = Math.floor(hoursPast / 24);
  if (daysPast < 30) {
    return daysPast === 1 ? "1 day ago" : `${daysPast} days ago`;
  }

  const monthsPast = Math.floor(daysPast / 30);
  if (monthsPast < 12) {
    return monthsPast === 1 ? "1 month ago" : `${monthsPast} months ago`;
  }

  const yearsPast = Math.floor(monthsPast / 12);
  return yearsPast === 1 ? "1 year ago" : `${yearsPast} years ago`;
}
