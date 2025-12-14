/**
 * package-health-analyzer - Semantic Versioning Analysis
 *
 * Provides semantic versioning analysis utilities that classify version differences and estimate migration complexity.
 * This module extends the standard semver library with business logic specific to dependency health assessment,
 * including breaking change estimation and intermediate version discovery. It abstracts semver complexity into
 * actionable insights about update risk, helping teams understand the difference between a safe patch update
 * and a potentially breaking major version upgrade.
 *
 * Key responsibilities:
 * - Determine update classification (patch/minor/major) between version pairs
 * - Estimate breaking change count based on major version jumps
 * - Extract intermediate versions for incremental upgrade paths
 * - Find the last stable version within a major release line
 * - Normalize and clean version strings for consistent comparison
 * - Handle pre-release versions and version range resolution
 *
 * @module utils/semver
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import semver from 'semver';

/**
 * Determine update type between two versions
 */
export function getUpdateType(
  current: string,
  latest: string
): 'patch' | 'minor' | 'major' | null {
  const currentVersion = semver.clean(current);
  const latestVersion = semver.clean(latest);

  if (!currentVersion || !latestVersion) {
    return null;
  }

  const diff = semver.diff(currentVersion, latestVersion);

  if (!diff) {
    return null;
  }

  if (diff === 'major' || diff === 'premajor') {
    return 'major';
  }

  if (diff === 'minor' || diff === 'preminor') {
    return 'minor';
  }

  return 'patch';
}

/**
 * Estimate breaking changes based on semver diff
 */
export function estimateBreakingChanges(
  current: string,
  latest: string
): number {
  const updateType = getUpdateType(current, latest);

  if (!updateType) {
    return 0;
  }

  const currentClean = semver.clean(current);
  const latestClean = semver.clean(latest);

  if (!currentClean || !latestClean) {
    return 0;
  }

  const currentMajor = semver.major(currentClean);
  const latestMajor = semver.major(latestClean);

  if (updateType === 'major') {
    const majorJump = latestMajor - currentMajor;
    // Estimate: each major version typically has 10-20 breaking changes
    return majorJump * 15;
  }

  if (updateType === 'minor') {
    // Minor versions occasionally have breaking changes in rare cases
    return 0;
  }

  return 0;
}

/**
 * Get intermediate versions between current and latest
 */
export function getIntermediateVersions(
  versions: string[],
  current: string,
  latest: string
): string[] {
  const currentClean = semver.clean(current);
  const latestClean = semver.clean(latest);

  if (!currentClean || !latestClean) {
    return [];
  }

  // Filter and sort versions between current and latest
  const intermediate = versions
    .map((v) => semver.clean(v))
    .filter((v): v is string => v !== null)
    .filter((v) => {
      return semver.gt(v, currentClean) && semver.lte(v, latestClean);
    })
    .sort(semver.compare);

  return intermediate;
}

/**
 * Get last version of a major release
 */
export function getLastVersionOfMajor(
  versions: string[],
  majorVersion: number
): string | null {
  const cleaned = versions
    .map((v) => semver.clean(v))
    .filter((v): v is string => v !== null)
    .filter((v) => semver.major(v) === majorVersion)
    .sort(semver.rcompare);

  return cleaned[0] || null;
}
