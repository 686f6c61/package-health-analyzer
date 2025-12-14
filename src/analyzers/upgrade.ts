/**
 * package-health-analyzer - Upgrade Path Analysis Module
 *
 * This module analyzes the upgrade path dimension of package health by evaluating the
 * feasibility and risk of upgrading from the current version to the latest version. It
 * detects breaking changes through semantic versioning analysis and provides actionable
 * upgrade recommendations.
 *
 * Key responsibilities:
 * - Analyze semantic version differences between current and latest versions
 * - Identify breaking changes (major version bumps) and feature additions (minor bumps)
 * - Calculate upgrade difficulty scores based on version distance and change type
 * - Generate intermediate upgrade paths for safer multi-step migrations
 * - Provide upgrade recommendations with severity assessments
 * - Handle upgrade analysis failures gracefully with warning messages
 *
 * The upgrade path algorithm uses semantic versioning to assess risk: major version changes
 * indicate breaking changes requiring careful migration planning, minor versions suggest
 * new features with backward compatibility, and patch versions indicate low-risk bug fixes.
 * For large version gaps, the module recommends intermediate upgrade steps to reduce risk.
 * All upgrade analysis is optional and controlled by configuration flags.
 *
 * @module analyzers/upgrade
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import type { UpgradePath } from '../types/index.js';
import type { UpgradePathConfig } from '../types/config.js';
import { analyzeUpgradePath } from '../utils/upgrade-path.js';

/**
 * Analyze upgrade path for a package
 */
export async function analyzePackageUpgrade(
  packageName: string,
  currentVersion: string,
  latestVersion: string,
  config: UpgradePathConfig
): Promise<UpgradePath | undefined> {
  if (!config.enabled) {
    return undefined;
  }

  try {
    return await analyzeUpgradePath(
      packageName,
      currentVersion,
      latestVersion,
      config
    );
  } catch (error) {
    console.warn(
      `Warning: Could not analyze upgrade path for ${packageName}:`,
      error instanceof Error ? error.message : String(error)
    );
    return undefined;
  }
}
