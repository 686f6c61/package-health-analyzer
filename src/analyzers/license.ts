/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import type {
  LicenseAnalysis,
  LicenseCategory,
  PackageMetadata,
  Severity,
  ProjectType,
} from '../types/index.js';
import type { LicenseConfig } from '../types/config.js';
import {
  commercialRestrictiveLicenses,
  permissiveLicenses,
  weakCopyleftLicenses,
} from '../config/defaults.js';
import {
  getBlueOakRating,
  isLegallySound,
} from '../utils/blue-oak.js';
import {
  parseSpdxExpression,
  normalizeLicense,
  isValidSpdx,
  hasPatentClause as checkPatentClause,
} from '../utils/spdx.js';

/**
 * Determine license category based on SPDX ID and project type
 */
function determineLicenseCategory(
  spdxId: string,
  projectType: ProjectType,
  config: LicenseConfig
): { category: LicenseCategory; reason?: string } {
  // Check if explicitly denied
  if (config.deny.some((pattern) => matchesLicensePattern(spdxId, pattern))) {
    return {
      category: 'commercial-incompatible',
      reason: 'Explicitly denied in configuration',
    };
  }

  // Check if explicitly allowed
  if (config.allow.some((pattern) => matchesLicensePattern(spdxId, pattern))) {
    return {
      category: 'commercial-friendly',
      reason: 'Explicitly allowed in configuration',
    };
  }

  // Check commercial restrictive licenses
  if (commercialRestrictiveLicenses.includes(spdxId)) {
    if (projectType === 'commercial' || projectType === 'saas') {
      return {
        category: 'commercial-incompatible',
        reason: 'Strong copyleft license incompatible with commercial use',
      };
    }
    return {
      category: 'commercial-warning',
      reason: 'Copyleft license',
    };
  }

  // Check weak copyleft licenses
  if (weakCopyleftLicenses.includes(spdxId)) {
    if (projectType === 'commercial') {
      return {
        category: 'commercial-warning',
        reason: 'Weak copyleft license, review required',
      };
    }
    return {
      category: 'commercial-friendly',
      reason: 'Weak copyleft acceptable for non-commercial',
    };
  }

  // Check permissive licenses
  if (permissiveLicenses.includes(spdxId)) {
    return {
      category: 'commercial-friendly',
      reason: 'Permissive license',
    };
  }

  // Special case for AGPL in SaaS projects
  if (spdxId.startsWith('AGPL') && projectType === 'saas') {
    return {
      category: 'commercial-incompatible',
      reason: 'AGPL requires source disclosure for network services',
    };
  }

  // Unknown license - valid SPDX but not in our categorization
  return {
    category: 'unknown',
    reason: `License "${spdxId}" is a valid SPDX license but not categorized for commercial use analysis. Please review manually or add to configuration allow/deny list.`,
  };
}

/**
 * Match license against pattern (supports wildcards)
 */
function matchesLicensePattern(license: string, pattern: string): boolean {
  const regexPattern = pattern.replace(/\*/g, '.*');
  const regex = new RegExp(`^${regexPattern}$`, 'i');
  return regex.test(license);
}

/**
 * Determine severity based on category and configuration
 */
function determineSeverity(
  category: LicenseCategory,
  projectType: ProjectType,
  config: LicenseConfig
): Severity {
  switch (category) {
    case 'commercial-friendly':
      return 'ok';

    case 'commercial-warning':
      return 'warning';

    case 'commercial-incompatible':
      return 'critical';

    case 'unknown':
      return config.warnOnUnknown ? 'warning' : 'info';

    case 'unlicensed':
      return 'critical';
  }
}

/**
 * Analyze package license
 */
export function analyzeLicense(
  metadata: PackageMetadata,
  projectType: ProjectType,
  config: LicenseConfig
): LicenseAnalysis {
  // Handle missing license
  if (!metadata.license) {
    return {
      package: metadata.name,
      version: metadata.version,
      license: 'UNLICENSED',
      category: 'unlicensed',
      blueOakRating: 'unrated',
      severity: 'critical',
      isDualLicense: false,
      hasPatentClause: false,
      commercialUse: false,
      reason: 'No license specified',
    };
  }

  // Normalize and parse license
  const normalized = normalizeLicense(metadata.license);

  // Check for UNLICENSED or explicitly marked as unlicensed
  if (normalized === 'UNLICENSED') {
    return {
      package: metadata.name,
      version: metadata.version,
      license: normalized,
      category: 'unlicensed',
      blueOakRating: 'unrated',
      severity: 'critical',
      isDualLicense: false,
      hasPatentClause: false,
      commercialUse: false,
      reason: 'Package is explicitly marked as unlicensed',
    };
  }

  // Check if it's a valid SPDX license or expression
  if (!isValidSpdx(normalized)) {
    return {
      package: metadata.name,
      version: metadata.version,
      license: normalized,
      category: 'unlicensed',
      blueOakRating: 'unrated',
      severity: 'critical',
      isDualLicense: false,
      hasPatentClause: false,
      commercialUse: false,
      reason: `License "${normalized}" is not a valid SPDX license identifier. Check https://spdx.org/licenses/ for valid licenses.`,
    };
  }

  // Parse SPDX expression
  const parsed = parseSpdxExpression(normalized);

  // For dual licenses, analyze the most permissive option
  let bestCategory: LicenseCategory = 'commercial-incompatible';
  let bestSpdxId = parsed.licenses[0]!;
  let bestReason: string | undefined;

  for (const licenseId of parsed.licenses) {
    // Normalize each license ID in the expression
    const spdxId = normalizeLicense(licenseId);

    const { category, reason } = determineLicenseCategory(
      spdxId,
      projectType,
      config
    );

    // Prefer more permissive licenses
    if (
      category === 'commercial-friendly' ||
      (category === 'commercial-warning' &&
        bestCategory === 'commercial-incompatible')
    ) {
      bestCategory = category;
      bestSpdxId = spdxId;
      bestReason = reason;
    }
  }

  // Get Blue Oak rating (use first license if dual)
  const blueOakRating = getBlueOakRating(bestSpdxId);

  // Check patent clause
  const hasPatentClause = config.checkPatentClauses
    ? checkPatentClause(bestSpdxId)
    : false;

  // Determine if commercial use is allowed
  const commercialUse =
    bestCategory === 'commercial-friendly' ||
    (bestCategory === 'commercial-warning' &&
      projectType === 'open-source');

  // Determine severity
  const severity = determineSeverity(bestCategory, projectType, config);

  return {
    package: metadata.name,
    version: metadata.version,
    license: normalized,
    spdxId: bestSpdxId,
    category: bestCategory,
    blueOakRating,
    severity,
    isDualLicense: parsed.isDual,
    hasPatentClause,
    commercialUse,
    reason: bestReason,
  };
}

/**
 * Calculate license score (0-1, higher is better)
 */
export function calculateLicenseScore(
  category: LicenseCategory,
  blueOakRating: string,
  projectType: ProjectType
): number {
  // Base score from category
  let baseScore: number;

  switch (category) {
    case 'commercial-friendly':
      baseScore = 1.0;
      break;
    case 'commercial-warning':
      baseScore = projectType === 'open-source' ? 0.8 : 0.5;
      break;
    case 'commercial-incompatible':
      baseScore = projectType === 'open-source' ? 0.6 : 0.0;
      break;
    case 'unknown':
      baseScore = 0.3;
      break;
    case 'unlicensed':
      baseScore = 0.0;
      break;
  }

  // Adjust based on Blue Oak rating (legal quality)
  if (isLegallySound(blueOakRating as any)) {
    baseScore = Math.min(1.0, baseScore * 1.1);
  } else if (blueOakRating === 'lead') {
    baseScore = Math.max(0.0, baseScore * 0.8);
  }

  return baseScore;
}
