/**
 * package-health-analyzer - Scoring Aggregation Module
 *
 * This module serves as the central scoring engine that aggregates individual dimension
 * analyses (age, license, vulnerabilities) into a unified health score. It implements a
 * weighted scoring algorithm with configurable boosters to reflect organizational priorities
 * and generates actionable health ratings.
 *
 * Key responsibilities:
 * - Aggregate scores from age, license, and vulnerability analyzers
 * - Apply configurable dimension weights (boosters) to reflect organizational priorities
 * - Calculate normalized dimension scores (0-1 scale) for each health aspect
 * - Compute weighted overall health scores (0-100 scale) using booster-weighted averages
 * - Determine health ratings (excellent ≥80, good ≥60, fair ≥40, poor <40)
 * - Evaluate vulnerability severity using weighted penalties by CVE severity level
 * - Determine overall severity status across all dimensions
 *
 * The scoring algorithm uses a weighted average approach: each dimension score (0-1) is
 * multiplied by its booster weight, then normalized by total weight to produce an overall
 * score (0-100). Vulnerabilities use exponential penalties: critical CVEs subtract 0.5,
 * high 0.3, moderate 0.15, low 0.05 per vulnerability. The overall severity prioritizes
 * the worst case across all dimensions (critical > warning > info > ok).
 *
 * @module analyzers/scorer
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import type { HealthScore, HealthRating, AgeAnalysis, LicenseAnalysis, VulnerabilityAnalysis } from '../types/index.js';
import type { ScoringConfig } from '../types/config.js';
import type { PopularityAnalysis } from './popularity.js';
import { calculateAgeScore } from './age.js';
import { calculateLicenseScore } from './license.js';

/**
 * Calculate overall health score for a package
 */
export function calculateHealthScore(
  ageAnalysis: AgeAnalysis,
  licenseAnalysis: LicenseAnalysis,
  vulnerabilityAnalysis: VulnerabilityAnalysis | undefined,
  config: ScoringConfig,
  projectType: string,
  popularityAnalysis?: PopularityAnalysis
): HealthScore {
  if (!config.enabled) {
    return {
      overall: 100,
      rating: 'excellent',
      dimensions: {
        age: 1,
        deprecation: 1,
        license: 1,
        vulnerability: 1,
        popularity: 1,
        repository: 1,
        updateFrequency: 1,
      },
    };
  }

  // Calculate individual dimension scores (0-1)
  const ageScore = calculateAgeScore(ageAnalysis.ageDays, {
    warn: '2y',
    critical: '5y',
    checkDeprecated: true,
    checkRepository: true,
  });

  const deprecationScore = ageAnalysis.deprecated ? 0 : 1;

  const licenseScore = calculateLicenseScore(
    licenseAnalysis.category,
    licenseAnalysis.blueOakRating,
    projectType as any
  );

  // Calculate vulnerability score from GitHub Advisory Database
  const vulnerabilityScore = calculateVulnerabilityScore(vulnerabilityAnalysis);

  // Calculate popularity score from npm download stats
  const popularityScore = popularityAnalysis?.score ?? 0.5; // Default to neutral if unavailable

  // Repository and update frequency scores
  const repositoryScore = ageAnalysis.hasRepository ? 0.8 : 0.3;
  const updateFrequencyScore = ageScore; // Correlated with age for now

  // Apply boosters
  const boosters = config.boosters;
  const weightedSum =
    ageScore * boosters.age +
    deprecationScore * boosters.deprecation +
    licenseScore * boosters.license +
    vulnerabilityScore * boosters.vulnerability +
    popularityScore * boosters.popularity +
    repositoryScore * boosters.repository +
    updateFrequencyScore * boosters.updateFrequency;

  const totalWeight =
    boosters.age +
    boosters.deprecation +
    boosters.license +
    boosters.vulnerability +
    boosters.popularity +
    boosters.repository +
    boosters.updateFrequency;

  // Calculate overall score (0-100)
  const overall = Math.round((weightedSum / totalWeight) * 100);

  // Determine rating
  const rating = determineRating(overall);

  return {
    overall,
    rating,
    dimensions: {
      age: ageScore,
      deprecation: deprecationScore,
      license: licenseScore,
      vulnerability: vulnerabilityScore,
      popularity: popularityScore,
      repository: repositoryScore,
      updateFrequency: updateFrequencyScore,
    },
  };
}

/**
 * Determine health rating from score
 */
function determineRating(score: number): HealthRating {
  if (score >= 80) {
    return 'excellent';
  }
  if (score >= 60) {
    return 'good';
  }
  if (score >= 40) {
    return 'fair';
  }
  return 'poor';
}

/**
 * Calculate vulnerability score from GitHub Advisory Database
 * Returns a score from 0 to 1, where 1 is perfect (no vulnerabilities)
 */
function calculateVulnerabilityScore(
  vulnerabilityAnalysis: VulnerabilityAnalysis | undefined
): number {
  if (!vulnerabilityAnalysis || vulnerabilityAnalysis.totalCount === 0) {
    return 1.0; // No vulnerabilities = perfect score
  }

  // Weighted penalty based on severity
  // Critical: -0.5, High: -0.3, Moderate: -0.15, Low: -0.05 per vulnerability
  const criticalPenalty = vulnerabilityAnalysis.criticalCount * 0.5;
  const highPenalty = vulnerabilityAnalysis.highCount * 0.3;
  const moderatePenalty = vulnerabilityAnalysis.moderateCount * 0.15;
  const lowPenalty = vulnerabilityAnalysis.lowCount * 0.05;

  const totalPenalty = criticalPenalty + highPenalty + moderatePenalty + lowPenalty;

  // Score is 1.0 minus penalty, minimum 0
  return Math.max(0, 1.0 - totalPenalty);
}

/**
 * Get overall severity from all analyses
 */
export function getOverallSeverity(
  ageAnalysis: AgeAnalysis,
  licenseAnalysis: LicenseAnalysis,
  vulnerabilityAnalysis?: VulnerabilityAnalysis
): 'ok' | 'info' | 'warning' | 'critical' {
  const severities = [
    ageAnalysis.severity,
    licenseAnalysis.severity,
    vulnerabilityAnalysis?.severity,
  ].filter((s): s is 'ok' | 'info' | 'warning' | 'critical' => s !== undefined);

  if (severities.includes('critical')) {
    return 'critical';
  }
  if (severities.includes('warning')) {
    return 'warning';
  }
  if (severities.includes('info')) {
    return 'info';
  }
  return 'ok';
}
