/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
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
