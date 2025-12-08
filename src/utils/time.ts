/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
const DAYS_PER_YEAR = 365;
const DAYS_PER_MONTH = 30;

/**
 * Calculate days between two dates
 */
export function daysBetween(date1: Date, date2: Date): number {
  const diff = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diff / MILLISECONDS_PER_DAY);
}

/**
 * Convert days to human-readable format
 */
export function daysToHuman(days: number): string {
  if (days < 1) {
    return 'today';
  }

  if (days === 1) {
    return '1 day';
  }

  if (days < 7) {
    return `${days} days`;
  }

  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return weeks === 1 ? '1 week' : `${weeks} weeks`;
  }

  if (days < 365) {
    const months = Math.floor(days / DAYS_PER_MONTH);
    return months === 1 ? '1 month' : `${months} months`;
  }

  const years = Math.floor(days / DAYS_PER_YEAR);
  const remainingMonths = Math.floor((days % DAYS_PER_YEAR) / DAYS_PER_MONTH);

  if (remainingMonths === 0) {
    return years === 1 ? '1 year' : `${years} years`;
  }

  const yearStr = years === 1 ? '1 year' : `${years} years`;
  const monthStr =
    remainingMonths === 1 ? '1 month' : `${remainingMonths} months`;

  return `${yearStr} ${monthStr}`;
}

/**
 * Parse time threshold string (e.g., "2y", "6m", "90d")
 */
export function parseTimeThreshold(threshold: string): number {
  const match = threshold.match(/^(\d+)([ymd])$/i);

  if (!match) {
    throw new Error(
      `Invalid time threshold format: ${threshold}. Use format like "2y", "6m", or "90d"`
    );
  }

  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case 'y':
      return value * DAYS_PER_YEAR;
    case 'm':
      return value * DAYS_PER_MONTH;
    case 'd':
      return value;
    default:
      throw new Error(`Invalid time unit: ${unit}`);
  }
}

/**
 * Format date to ISO string
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]!;
}

/**
 * Calculate age from ISO date string
 */
export function calculateAge(isoDateString: string): {
  days: number;
  human: string;
} {
  const publishDate = new Date(isoDateString);
  const now = new Date();
  const days = daysBetween(publishDate, now);

  return {
    days,
    human: daysToHuman(days),
  };
}
