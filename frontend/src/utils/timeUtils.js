/**
 * Converts a date to a simple relative time string
 * @param {string|Date} date - The date to convert
 * @returns {string} - Relative time string (e.g., "1 day ago", "52 minutes ago", "3 hours ago")
 */
export function getRelativeTime(date) {
  if (!date) return "";

  const now = new Date();
  const targetDate = new Date(date);
  const diffInMs = now - targetDate;

  // If the date is in the future, return "just now"
  if (diffInMs < 0) return "just now";

  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  // Return the largest unit that makes sense
  if (diffInYears > 0) {
    return `${diffInYears} year${diffInYears === 1 ? "" : "s"} ago`;
  }

  if (diffInMonths > 0) {
    return `${diffInMonths} month${diffInMonths === 1 ? "" : "s"} ago`;
  }

  if (diffInWeeks > 0) {
    return `${diffInWeeks} week${diffInWeeks === 1 ? "" : "s"} ago`;
  }

  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  }

  if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  }

  if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
  }

  return "just now";
}
