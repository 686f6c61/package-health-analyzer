/**
 * package-health-analyzer - Popularity Analysis Module
 *
 * This module analyzes package popularity based on npm download statistics, providing
 * insights into adoption, community trust, and ecosystem significance. It uses weekly
 * download counts from the npm registry API to calculate normalized popularity scores,
 * considering package age to avoid penalizing newer packages.
 *
 * Key responsibilities:
 * - Fetch weekly download statistics from npm registry API
 * - Calculate normalized popularity scores (0-1) based on download thresholds
 * - Adjust scores for package age (newer packages get proportional scoring)
 * - Categorize packages into popularity tiers (unpopular, niche, moderate, popular, very popular)
 * - Determine severity levels based on download counts (very low downloads = warning)
 * - Handle packages with zero or unavailable download stats gracefully
 *
 * Scoring algorithm:
 * - Uses logarithmic scale to handle wide range of download counts
 * - Baseline: 1,000 downloads/week = 0.5 score (moderate)
 * - Popular: 100,000+ downloads/week = 0.9+ score
 * - Very popular: 1,000,000+ downloads/week = 1.0 score (perfect)
 * - Age adjustment: packages <1 year old get proportional boost
 *
 * @module analyzers/popularity
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { fetchDownloadStats } from '../services/npm-registry.js';

export interface PopularityAnalysis {
  package: string;
  version: string;
  weeklyDownloads: number;
  score: number; // 0-1
  tier: 'unpopular' | 'niche' | 'moderate' | 'popular' | 'very-popular';
  severity: 'ok' | 'info' | 'warning';
  ageAdjusted: boolean;
}

/**
 * Download thresholds for popularity tiers (minimum downloads per week)
 */
const THRESHOLDS = {
  VERY_POPULAR: 1_000_000, // 1M+/week
  POPULAR: 100_000,        // 100k-1M/week
  MODERATE: 10_000,        // 10k-100k/week
  NICHE: 1_000,            // 1k-10k/week
  UNPOPULAR: 100,          // 100-1k/week
  // < 100/week = very unpopular (returns 'unpopular')
};

/**
 * Analyze package popularity based on npm download statistics
 */
export async function analyzePopularity(
  packageName: string,
  version: string,
  ageDays?: number
): Promise<PopularityAnalysis> {
  try {
    // Fetch weekly download stats
    const weeklyDownloads = await fetchDownloadStats(packageName, 'last-week');

    // Calculate base score using logarithmic scale
    const score = calculatePopularityScore(weeklyDownloads, ageDays);

    // Determine tier
    const tier = determineTier(weeklyDownloads);

    // Determine severity (warn on very low downloads)
    const severity = determineSeverity(weeklyDownloads);

    // Check if age adjustment was applied
    const ageAdjusted = ageDays !== undefined && ageDays < 365;

    return {
      package: packageName,
      version,
      weeklyDownloads,
      score,
      tier,
      severity,
      ageAdjusted,
    };
  } catch {
    // If download stats unavailable, return neutral score
    return {
      package: packageName,
      version,
      weeklyDownloads: 0,
      score: 0.5, // Neutral score when data unavailable
      tier: 'niche',
      severity: 'info',
      ageAdjusted: false,
    };
  }
}

/**
 * Calculate popularity score from download counts
 * Uses logarithmic scale to handle wide range
 * Returns score from 0 to 1
 */
export function calculatePopularityScore(
  weeklyDownloads: number,
  ageDays?: number
): number {
  if (weeklyDownloads === 0) {
    return 0;
  }

  // Logarithmic scoring
  // Base formula: score = log10(downloads) / log10(1M)
  // This gives: 100 downloads = ~0.33, 1k = 0.5, 10k = 0.67, 100k = 0.83, 1M = 1.0
  const logDownloads = Math.log10(weeklyDownloads);
  const logMax = Math.log10(THRESHOLDS.VERY_POPULAR);
  let score = logDownloads / logMax;

  // Age adjustment for newer packages
  // Packages less than 1 year old get a boost proportional to their age
  if (ageDays !== undefined && ageDays < 365) {
    const ageFactor = ageDays / 365; // 0 to 1
    const ageBoost = (1 - ageFactor) * 0.2; // Up to 20% boost for very new packages
    score = Math.min(1.0, score + ageBoost);
  }

  // Clamp to 0-1 range
  return Math.max(0, Math.min(1, score));
}

/**
 * Determine popularity tier from download counts
 */
function determineTier(weeklyDownloads: number): PopularityAnalysis['tier'] {
  if (weeklyDownloads >= THRESHOLDS.VERY_POPULAR) {
    return 'very-popular';
  }
  if (weeklyDownloads >= THRESHOLDS.POPULAR) {
    return 'popular';
  }
  if (weeklyDownloads >= THRESHOLDS.MODERATE) {
    return 'moderate';
  }
  if (weeklyDownloads >= THRESHOLDS.NICHE) {
    return 'niche';
  }
  return 'unpopular';
}

/**
 * Determine severity based on download counts
 */
function determineSeverity(weeklyDownloads: number): PopularityAnalysis['severity'] {
  // Very low downloads might indicate abandoned or untrusted package
  if (weeklyDownloads < THRESHOLDS.UNPOPULAR) {
    return 'warning';
  }

  // Low but acceptable
  if (weeklyDownloads < THRESHOLDS.NICHE) {
    return 'info';
  }

  return 'ok';
}
