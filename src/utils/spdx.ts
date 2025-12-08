/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const spdxLicenseIds = require('spdx-license-ids') as string[];

/**
 * Parse SPDX license expression
 * Handles: MIT, (MIT OR Apache-2.0), MIT AND Apache-2.0, etc.
 */
export function parseSpdxExpression(license: string): {
  spdxId: string;
  isDual: boolean;
  licenses: string[];
} {
  const normalized = license.trim();

  // Check for dual license (OR operator)
  if (normalized.includes(' OR ')) {
    const licenses = normalized
      .replace(/[()]/g, '')
      .split(' OR ')
      .map((l) => l.trim());

    return {
      spdxId: normalized,
      isDual: true,
      licenses,
    };
  }

  // Check for AND operator
  if (normalized.includes(' AND ')) {
    const licenses = normalized
      .replace(/[()]/g, '')
      .split(' AND ')
      .map((l) => l.trim());

    return {
      spdxId: normalized,
      isDual: false,
      licenses,
    };
  }

  // Single license
  return {
    spdxId: normalized.replace(/[()]/g, '').trim(),
    isDual: false,
    licenses: [normalized.replace(/[()]/g, '').trim()],
  };
}

/**
 * Check if license has patent clause
 */
export function hasPatentClause(spdxId: string): boolean {
  const patentLicenses = new Set([
    'Apache-2.0',
    'Apache-1.1',
    'MPL-2.0',
    'MPL-2.0-no-copyleft-exception',
    'EPL-1.0',
    'EPL-2.0',
    'GPL-3.0-only',
    'GPL-3.0-or-later',
    'LGPL-3.0-only',
    'LGPL-3.0-or-later',
    'AGPL-3.0-only',
    'AGPL-3.0-or-later',
  ]);

  return patentLicenses.has(spdxId);
}

/**
 * Normalize license string
 * Handles common variations and mistakes
 */
export function normalizeLicense(license: string): string {
  const normalized = license.trim();

  // Common variations
  const variations: Record<string, string> = {
    'MIT License': 'MIT',
    'The MIT License': 'MIT',
    'Apache License 2.0': 'Apache-2.0',
    'Apache License, Version 2.0': 'Apache-2.0',
    'Apache-2': 'Apache-2.0',
    'Apache 2.0': 'Apache-2.0',
    'Apache 2': 'Apache-2.0',
    'BSD': 'BSD-3-Clause',
    'BSD License': 'BSD-3-Clause',
    'BSD-3': 'BSD-3-Clause',
    'BSD-2': 'BSD-2-Clause',
    '3-Clause BSD': 'BSD-3-Clause',
    '2-Clause BSD': 'BSD-2-Clause',
    'ISC License': 'ISC',
    // GPL variations - map to -only for compatibility
    'GPL-1.0': 'GPL-1.0-only',
    'GPL-2.0': 'GPL-2.0-only',
    'GPL-3.0': 'GPL-3.0-only',
    'GPL-3': 'GPL-3.0-only',
    'GPL-2': 'GPL-2.0-only',
    'GPL-1': 'GPL-1.0-only',
    'GPLv3': 'GPL-3.0-only',
    'GPLv2': 'GPL-2.0-only',
    'GPLv1': 'GPL-1.0-only',
    'GNU GPL v3': 'GPL-3.0-only',
    'GNU GPL v2': 'GPL-2.0-only',
    'GNU GPL v1': 'GPL-1.0-only',
    // LGPL variations
    'LGPL-2.0': 'LGPL-2.0-only',
    'LGPL-2.1': 'LGPL-2.1-only',
    'LGPL-3.0': 'LGPL-3.0-only',
    'LGPL-3': 'LGPL-3.0-only',
    'LGPL-2': 'LGPL-2.0-only',
    'LGPLv3': 'LGPL-3.0-only',
    'LGPLv2.1': 'LGPL-2.1-only',
    'LGPLv2': 'LGPL-2.0-only',
    // AGPL variations
    'AGPL-1.0': 'AGPL-1.0-only',
    'AGPL-3.0': 'AGPL-3.0-only',
    'AGPL-3': 'AGPL-3.0-only',
    'AGPL-1': 'AGPL-1.0-only',
    'AGPLv3': 'AGPL-3.0-only',
    'AGPLv1': 'AGPL-1.0-only',
    // Other
    'MPL-2': 'MPL-2.0',
    'MPL 2.0': 'MPL-2.0',
    'CC0': 'CC0-1.0',
    'Public Domain': 'Unlicense',
    'Unlicensed': 'UNLICENSED',
  };

  return variations[normalized] || normalized;
}

/**
 * Set of all valid SPDX license IDs for fast lookup
 */
const spdxLicenseSet = new Set(spdxLicenseIds);

/**
 * Check if a single license ID is valid SPDX
 */
export function isSpdxLicense(license: string): boolean {
  return spdxLicenseSet.has(license.trim());
}

/**
 * Check if license string is valid SPDX or expression
 */
export function isValidSpdx(license: string): boolean {
  const trimmed = license.trim();

  // Check for explicitly invalid values
  const invalid = [
    '',
    'UNLICENSED',
    'SEE LICENSE IN',
    'UNKNOWN',
    'NONE',
    'N/A',
  ];

  if (invalid.includes(trimmed.toUpperCase())) {
    return false;
  }

  // If it's a simple license, normalize and check against SPDX list
  if (!trimmed.includes(' OR ') && !trimmed.includes(' AND ')) {
    const cleanLicense = trimmed.replace(/[()]/g, '').trim();
    const normalized = normalizeLicense(cleanLicense);
    return isSpdxLicense(normalized);
  }

  // For expressions (OR/AND), parse, normalize, and validate each license
  const parsed = parseSpdxExpression(trimmed);
  return parsed.licenses.every(l => {
    const normalized = normalizeLicense(l);
    return isSpdxLicense(normalized);
  });
}

/**
 * Get all valid SPDX license IDs
 */
export function getAllSpdxLicenses(): string[] {
  return spdxLicenseIds;
}
