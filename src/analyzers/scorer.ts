/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import type { HealthScore, HealthRating, AgeAnalysis, LicenseAnalysis } from '../types/index.js';
import type { ScoringConfig } from '../types/config.js';
import { calculateAgeScore } from './age.js';
import { calculateLicenseScore } from './license.js';

/**
 * Calculate overall health score for a package
 */
export function calculateHealthScore(
  ageAnalysis: AgeAnalysis,
  licenseAnalysis: LicenseAnalysis,
  config: ScoringConfig,
  projectType: string
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

  // Placeholder scores for dimensions not yet implemented
  const vulnerabilityScore = 1.0; // TODO: Implement vulnerability analysis
  const popularityScore = 0.7; // TODO: Implement popularity analysis
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
 * Get overall severity from all analyses
 */
export function getOverallSeverity(
  ageAnalysis: AgeAnalysis,
  licenseAnalysis: LicenseAnalysis
): 'ok' | 'info' | 'warning' | 'critical' {
  const severities = [ageAnalysis.severity, licenseAnalysis.severity];

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
