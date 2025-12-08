/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * Blue Oak Council license ratings
 * Based on https://blueoakcouncil.org/list
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import type { BlueOakRating } from '../types/index.js';

/**
 * Gold: Perfectly drafted, legally unambiguous licenses
 */
const goldLicenses = new Set([
  'MIT',
  'MIT-0',
  'Apache-2.0',
  'Apache-1.1',
  'BSD-2-Clause',
  'BSD-2-Clause-Patent',
  'BlueOak-1.0.0',
  'CC0-1.0',
  'Unlicense',
  '0BSD',
  'UPL-1.0',
  'NCSA',
  'FTL',
  'Fair',
]);

/**
 * Silver: Very good licenses with minor issues
 */
const silverLicenses = new Set([
  'BSD-3-Clause',
  'BSD-3-Clause-Clear',
  'ISC',
  'PostgreSQL',
  'Zlib',
  'X11',
  'Python-2.0',
  'Ruby',
  'PHP-3.0',
  'PHP-3.01',
  'ECL-2.0',
  'EFL-2.0',
  'Vim',
  'W3C',
  'Unicode-DFS-2016',
  'NTP',
  'OpenSSL',
  'MS-PL',
]);

/**
 * Bronze: Acceptable licenses but with drafting problems
 */
const bronzeLicenses = new Set([
  'Artistic-2.0',
  'LGPL-2.1',
  'LGPL-2.1-only',
  'LGPL-2.1-or-later',
  'LGPL-3.0',
  'LGPL-3.0-only',
  'LGPL-3.0-or-later',
  'MPL-2.0',
  'MPL-1.1',
  'EPL-1.0',
  'EPL-2.0',
  'CDDL-1.0',
  'CDDL-1.1',
  'EUPL-1.1',
  'EUPL-1.2',
  'AFL-3.0',
  'OSL-3.0',
  'APSL-2.0',
  'CPL-1.0',
  'MS-RL',
]);

/**
 * Lead: Problematic licenses with poor drafting or confusing terms
 */
const leadLicenses = new Set([
  'JSON',
  'WTFPL',
  'Beerware',
  'CC-BY-3.0',
  'CC-BY-4.0',
  'BSL-1.0',
  'QPL-1.0',
  'Artistic-1.0',
  'Artistic-1.0-Perl',
  'Artistic-1.0-cl8',
  'BSD-4-Clause',
  'OFL-1.1',
  'OPL-1.0',
]);

/**
 * Get Blue Oak Council rating for a license
 */
export function getBlueOakRating(spdxId: string): BlueOakRating {
  const normalized = spdxId.trim();

  if (goldLicenses.has(normalized)) {
    return 'gold';
  }

  if (silverLicenses.has(normalized)) {
    return 'silver';
  }

  if (bronzeLicenses.has(normalized)) {
    return 'bronze';
  }

  if (leadLicenses.has(normalized)) {
    return 'lead';
  }

  return 'unrated';
}

/**
 * Get description for a Blue Oak rating
 */
export function getBlueOakDescription(rating: BlueOakRating): string {
  switch (rating) {
    case 'gold':
      return 'Perfectly drafted, legally unambiguous';
    case 'silver':
      return 'Very good with minor issues';
    case 'bronze':
      return 'Acceptable but with drafting problems';
    case 'lead':
      return 'Problematic, poorly written or confusing terms';
    case 'unrated':
      return 'Not rated by Blue Oak Council';
  }
}

/**
 * Check if license is recommended by legal quality
 */
export function isLegallySound(rating: BlueOakRating): boolean {
  return rating === 'gold' || rating === 'silver';
}
