/**
 * package-health-analyzer - Age Analysis Module
 *
 * This module analyzes the age dimension of package health by evaluating when a package
 * was last published and assessing its maintenance status. It determines whether packages
 * are actively maintained, deprecated, or potentially abandoned based on configurable
 * time thresholds and repository presence.
 *
 * Key responsibilities:
 * - Calculate days since last publish using package metadata timestamps
 * - Determine severity levels (ok/warning/critical) based on age thresholds
 * - Check deprecation status and extract deprecation messages from package metadata
 * - Verify repository presence and extract repository URLs
 * - Calculate normalized age scores (0-1 scale) using linear decay algorithms
 * - Generate human-readable age descriptions for reporting
 *
 * The scoring algorithm uses a linear decay model: packages receive a perfect score (1.0)
 * if less than 1 year old, then linearly decrease to 0 as they approach the critical
 * threshold. Very old packages beyond the critical threshold receive minimal scores
 * (approaching 0.2) to reflect abandonment risk. Deprecated packages automatically
 * receive critical severity regardless of age.
 *
 * @module analyzers/age
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import type { AgeAnalysis, PackageMetadata, Severity } from '../types/index.js';
import type { AgeConfig } from '../types/config.js';
import { calculateAge, parseTimeThreshold } from '../utils/time.js';

/**
 * Determine severity based on age and thresholds
 */
function determineSeverity(
  ageDays: number,
  config: AgeConfig,
  isDeprecated: boolean
): Severity {
  if (isDeprecated) {
    return 'critical';
  }

  const warnThreshold = parseTimeThreshold(config.warn);
  const criticalThreshold = parseTimeThreshold(config.critical);

  if (ageDays >= criticalThreshold) {
    return 'critical';
  }

  if (ageDays >= warnThreshold) {
    return 'warning';
  }

  return 'ok';
}

/**
 * Extract repository URL from metadata
 */
function extractRepositoryUrl(
  repository?: PackageMetadata['repository']
): string | undefined {
  if (!repository) {
    return undefined;
  }

  if (typeof repository === 'string') {
    return repository;
  }

  return repository.url;
}

/**
 * Analyze package age and maintenance status
 */
export function analyzeAge(
  metadata: PackageMetadata,
  config: AgeConfig
): AgeAnalysis {
  // Get last publish date
  const lastPublishDate =
    metadata.time?.modified ||
    metadata.time?.[metadata.version] ||
    metadata.time?.created;

  if (!lastPublishDate) {
    return {
      package: metadata.name,
      version: metadata.version,
      lastPublish: 'unknown',
      ageDays: 0,
      ageHuman: 'unknown',
      deprecated: false,
      severity: 'warning',
      hasRepository: false,
    };
  }

  // Calculate age
  const age = calculateAge(lastPublishDate);

  // Check if deprecated
  const isDeprecated = Boolean(metadata.deprecated);
  const deprecationMessage =
    typeof metadata.deprecated === 'string'
      ? metadata.deprecated
      : undefined;

  // Check repository
  const repositoryUrl = extractRepositoryUrl(metadata.repository);
  const hasRepository = Boolean(repositoryUrl);

  // Determine severity
  const severity = determineSeverity(age.days, config, isDeprecated);

  return {
    package: metadata.name,
    version: metadata.version,
    lastPublish: lastPublishDate,
    ageDays: age.days,
    ageHuman: age.human,
    deprecated: isDeprecated,
    deprecationMessage,
    severity,
    hasRepository,
    repositoryUrl,
  };
}

/**
 * Calculate age score (0-1, higher is better)
 */
export function calculateAgeScore(ageDays: number, config: AgeConfig): number {
  const criticalThreshold = parseTimeThreshold(config.critical);

  // Perfect score for packages less than 1 year old
  if (ageDays <= DAYS_PER_YEAR) {
    return 1.0;
  }

  // Linear decay from 1 year to critical threshold
  if (ageDays <= criticalThreshold) {
    const ratio = (ageDays - DAYS_PER_YEAR) / (criticalThreshold - DAYS_PER_YEAR);
    return Math.max(0, 1.0 - ratio);
  }

  // Very old packages get minimal score
  return Math.max(0, 0.2 - (ageDays - criticalThreshold) / (criticalThreshold * 2));
}

const DAYS_PER_YEAR = 365;
