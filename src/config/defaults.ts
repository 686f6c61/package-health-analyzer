/**
 * package-health-analyzer - Default Configuration Values
 *
 * Defines the baseline configuration settings and license categorizations used when no custom configuration is provided.
 * This module establishes sensible defaults optimized for commercial software projects while providing comprehensive
 * license databases categorizing all major open source licenses by permissiveness, copyleft strength, and commercial
 * restrictions. The defaults balance security (enabling deprecation checks, vulnerability scanning) with practicality
 * (reasonable age thresholds, common permissive licenses), serving as both a ready-to-use configuration and a template
 * for customization.
 *
 * Key responsibilities:
 * - Provide complete default configuration for all analyzer features
 * - Categorize 100+ licenses into permissive/weak-copyleft/commercial-restrictive groups
 * - Define standard allowed licenses for commercial use (MIT, Apache-2.0, BSD, etc.)
 * - List copyleft licenses that may restrict commercial distribution (GPL, AGPL, CC-BY-NC)
 * - Configure default scoring boosters and minimum score thresholds
 * - Set reasonable cache TTLs and feature toggles for optimal performance
 * - Establish baseline age thresholds (2y warning, 5y critical) for package maintenance
 *
 * @module config/defaults
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import type { Config, PartialConfig } from '../types/config.js';
import type { ProjectType } from '../types/index.js';

export const defaultConfig: Config = {
  projectType: 'commercial',
  age: {
    warn: '2y',
    critical: '5y',
    checkDeprecated: true,
    checkRepository: true,
  },
  license: {
    allow: [
      'MIT',
      'ISC',
      'BSD-2-Clause',
      'BSD-3-Clause',
      'Apache-2.0',
      'Unlicense',
      'CC0-1.0',
      '0BSD',
      'Zlib',
      'BSL-1.0',
    ],
    deny: [],
    warn: ['LGPL-2.1', 'LGPL-3.0', 'MPL-2.0', 'EPL-1.0', 'EPL-2.0'],
    warnOnUnknown: true,
    checkPatentClauses: true,
  },
  scoring: {
    enabled: true,
    minimumScore: 0,
    boosters: {
      age: 1.5,
      deprecation: 4.0,
      license: 3.0,
      vulnerability: 2.0,
      popularity: 1.0,
      repository: 2.0,
      updateFrequency: 1.5,
    },
  },
  ignore: {
    scopes: [],
    prefixes: [],
    authors: [],
    packages: [],
  },
  includeDevDependencies: false,
  failOn: 'critical',
  output: 'cli',
  cache: {
    enabled: true,
    ttl: 3600,
  },
  github: {
    enabled: false,
    security: {
      enabled: true, // Enable vulnerability scanning by default when GitHub is enabled
      cacheTtl: 86400, // 24 hours
    },
  },
  monitor: {
    enabled: false,
  },
  upgradePath: {
    enabled: true,
    analyzeBreakingChanges: true,
    suggestAlternatives: true,
    fetchChangelogs: false,
    estimateEffort: true,
  },
  dependencyTree: {
    enabled: true,
    maxDepth: 3, // Layer 0 (root) + Layer 1 (direct) + Layer 2 (transitive level 2)
    analyzeTransitive: true,
    detectCircular: true,
    detectDuplicates: true,
    stopOnCircular: false,
    cacheTrees: true,
  },
  notice: {
    format: 'apache',
    outputPath: 'NOTICE.txt',
    groupByLicense: false,
    includeDevDependencies: false,
    includeTransitive: true,
    includeCopyright: true,
    includeUrls: true,
  },
};

export const commercialRestrictiveLicenses = [
  // GPL variants (SPDX standard forms)
  'GPL-1.0-only',
  'GPL-1.0-or-later',
  'GPL-2.0-only',
  'GPL-2.0-or-later',
  'GPL-3.0-only',
  'GPL-3.0-or-later',
  // AGPL variants (SPDX standard forms)
  'AGPL-1.0-only',
  'AGPL-1.0-or-later',
  'AGPL-3.0-only',
  'AGPL-3.0-or-later',
  // Server Side Public License
  'SSPL-1.0',
  // Creative Commons Share-Alike (copyleft)
  'CC-BY-SA-1.0',
  'CC-BY-SA-2.0',
  'CC-BY-SA-2.5',
  'CC-BY-SA-3.0',
  'CC-BY-SA-4.0',
  // Creative Commons Non-Commercial (commercial restrictive)
  'CC-BY-NC-1.0',
  'CC-BY-NC-2.0',
  'CC-BY-NC-2.5',
  'CC-BY-NC-3.0',
  'CC-BY-NC-4.0',
  'CC-BY-NC-SA-1.0',
  'CC-BY-NC-SA-2.0',
  'CC-BY-NC-SA-2.5',
  'CC-BY-NC-SA-3.0',
  'CC-BY-NC-SA-4.0',
  'CC-BY-NC-ND-1.0',
  'CC-BY-NC-ND-2.0',
  'CC-BY-NC-ND-2.5',
  'CC-BY-NC-ND-3.0',
  'CC-BY-NC-ND-4.0',
  // Free Documentation Licenses (copyleft)
  'GFDL-1.1',
  'GFDL-1.1-only',
  'GFDL-1.1-or-later',
  'GFDL-1.2',
  'GFDL-1.2-only',
  'GFDL-1.2-or-later',
  'GFDL-1.3',
  'GFDL-1.3-only',
  'GFDL-1.3-or-later',
  // Other copyleft
  'ODbL-1.0',
  'OPL-1.0',
  'SimPL-2.0',
];

export const permissiveLicenses = [
  // Standard permissive
  'MIT',
  'ISC',
  'BSD-2-Clause',
  'BSD-3-Clause',
  'BSD-3-Clause-Clear',
  'BSD-4-Clause',
  'Apache-2.0',
  'Apache-1.1',
  'Unlicense',
  'CC0-1.0',
  '0BSD',
  'Zlib',
  'BSL-1.0',
  'PostgreSQL',
  'X11',
  'Artistic-2.0',
  'WTFPL',
  'FTL',
  'IJG',
  'Libpng',
  'libtiff',
  'NTP',
  'OpenSSL',
  'PHP-3.0',
  'PHP-3.01',
  'Python-2.0',
  'Ruby',
  'SGI-B-2.0',
  'Spencer-86',
  'Spencer-94',
  'Unicode-DFS-2016',
  'Vim',
  'W3C',
  'Xnet',
  // Creative Commons Attribution (permissive)
  'CC-BY-1.0',
  'CC-BY-2.0',
  'CC-BY-2.5',
  'CC-BY-3.0',
  'CC-BY-4.0',
  // Academic Free License
  'AFL-3.0',
  'AFL-2.1',
  'AFL-2.0',
  'AFL-1.2',
  'AFL-1.1',
  // Open Software License
  'OSL-3.0',
  'OSL-2.1',
  'OSL-2.0',
  'OSL-1.1',
  'OSL-1.0',
  // Other permissive
  'UPL-1.0',
  'NCSA',
  'ECL-2.0',
  'ECL-1.0',
  'EFL-2.0',
  'EFL-1.0',
  'Fair',
  'MS-PL',
  'MIT-0',
  'MIT-Modern-Variant',
  'Abstyles',
  'AdaCore-doc',
  'Entessa',
  'HPND',
  'HPND-sell-variant',
  'Unicode-TOU',
];

export const weakCopyleftLicenses = [
  // LGPL variants
  'LGPL-2.0',
  'LGPL-2.0-only',
  'LGPL-2.0-or-later',
  'LGPL-2.1',
  'LGPL-2.1-only',
  'LGPL-2.1-or-later',
  'LGPL-3.0',
  'LGPL-3.0-only',
  'LGPL-3.0-or-later',
  // Mozilla Public License
  'MPL-1.0',
  'MPL-1.1',
  'MPL-2.0',
  'MPL-2.0-no-copyleft-exception',
  // Eclipse Public License
  'EPL-1.0',
  'EPL-2.0',
  // Common Development and Distribution License
  'CDDL-1.0',
  'CDDL-1.1',
  // Common Public License
  'CPL-1.0',
  // European Union Public License
  'EUPL-1.0',
  'EUPL-1.1',
  'EUPL-1.2',
  // Other weak copyleft
  'MS-RL',
  'APSL-2.0',
  'APSL-1.0',
  'Nokia',
  'RPSL-1.0',
  'RSCPL',
  'SPL-1.0',
  'Watcom-1.0',
  'wxWindows',
  'LPL-1.02',
  'LPL-1.0',
  'QPL-1.0',
  'Sleepycat',
];

/**
 * Get project-type-specific configuration overrides
 * Returns a partial config that will be merged with defaultConfig
 */
export function getProjectTypeDefaults(projectType: ProjectType): PartialConfig {
  switch (projectType) {
    case 'commercial':
    case 'saas':
      // Strictest settings for commercial/SaaS projects
      return {
        license: {
          allow: [
            'MIT',
            'ISC',
            'BSD-2-Clause',
            'BSD-3-Clause',
            'Apache-2.0',
            'Unlicense',
            'CC0-1.0',
            '0BSD',
            'Zlib',
            'BSL-1.0',
          ],
          deny: [
            ...commercialRestrictiveLicenses,
            'GPL-1.0',
            'GPL-2.0',
            'GPL-3.0',
            'AGPL-1.0',
            'AGPL-3.0',
            'SSPL-1.0',
          ],
          warn: ['LGPL-2.1', 'LGPL-3.0', 'MPL-2.0', 'EPL-1.0', 'EPL-2.0'],
          warnOnUnknown: true,
          checkPatentClauses: true,
        },
        scoring: {
          enabled: true,
          minimumScore: 70, // Higher threshold for commercial
          boosters: {
            age: 1.5,
            deprecation: 4.0,
            license: 3.5, // Higher weight on license compliance
            vulnerability: 2.5, // Higher weight on security
            popularity: 1.0,
            repository: 2.0,
            updateFrequency: 1.5,
          },
        },
        failOn: 'critical',
        upgradePath: {
          enabled: true,
          analyzeBreakingChanges: true,
          suggestAlternatives: true,
          fetchChangelogs: false, // Can be slow
          estimateEffort: true,
        },
      };

    case 'open-source':
    case 'library':
      // More permissive for open-source projects
      return {
        license: {
          allow: [
            ...permissiveLicenses,
            ...weakCopyleftLicenses,
            'GPL-3.0-only',
            'GPL-3.0-or-later',
            'LGPL-3.0-only',
            'LGPL-3.0-or-later',
          ],
          deny: [
            'CC-BY-NC-1.0',
            'CC-BY-NC-2.0',
            'CC-BY-NC-3.0',
            'CC-BY-NC-4.0', // No commercial restrictions
          ],
          warn: ['AGPL-3.0-only', 'AGPL-3.0-or-later', 'SSPL-1.0'],
          warnOnUnknown: true,
          checkPatentClauses: false, // Less critical for open-source
        },
        scoring: {
          enabled: true,
          minimumScore: 50,
          boosters: {
            age: 1.5,
            deprecation: 3.0,
            license: 1.5, // Lower weight on license
            vulnerability: 2.0,
            popularity: 1.5, // Higher weight on community
            repository: 2.5, // Higher weight on community health
            updateFrequency: 1.5,
          },
        },
        failOn: 'warning',
        upgradePath: {
          enabled: true,
          analyzeBreakingChanges: true,
          suggestAlternatives: true,
          fetchChangelogs: true, // More useful for open-source
          estimateEffort: true,
        },
      };

    case 'personal':
    case 'educational':
      // Most permissive for personal/educational use
      return {
        license: {
          allow: [...permissiveLicenses, ...weakCopyleftLicenses, ...commercialRestrictiveLicenses],
          deny: [],
          warn: [],
          warnOnUnknown: false,
          checkPatentClauses: false,
        },
        scoring: {
          enabled: true,
          minimumScore: 30,
          boosters: {
            age: 1.0,
            deprecation: 2.0,
            license: 0.5, // Very low weight
            vulnerability: 1.5,
            popularity: 0.8,
            repository: 1.0,
            updateFrequency: 1.0,
          },
        },
        failOn: 'none', // Don't fail builds
        upgradePath: {
          enabled: true,
          analyzeBreakingChanges: false,
          suggestAlternatives: true,
          fetchChangelogs: false,
          estimateEffort: false,
        },
      };

    case 'startup':
      // Balanced for startups (speed vs. compliance)
      return {
        license: {
          allow: [
            'MIT',
            'ISC',
            'BSD-2-Clause',
            'BSD-3-Clause',
            'Apache-2.0',
            'Unlicense',
            'CC0-1.0',
            '0BSD',
          ],
          deny: [
            'AGPL-3.0-only',
            'AGPL-3.0-or-later',
            'SSPL-1.0',
            'GPL-3.0-only',
            'GPL-3.0-or-later',
          ],
          warn: ['LGPL-2.1', 'LGPL-3.0', 'MPL-2.0'],
          warnOnUnknown: true,
          checkPatentClauses: true,
        },
        scoring: {
          enabled: true,
          minimumScore: 60,
          boosters: {
            age: 1.5,
            deprecation: 3.5,
            license: 2.5,
            vulnerability: 2.5,
            popularity: 1.2, // Slightly favor popular packages
            repository: 1.8,
            updateFrequency: 1.5,
          },
        },
        failOn: 'critical',
        upgradePath: {
          enabled: true,
          analyzeBreakingChanges: true,
          suggestAlternatives: true,
          fetchChangelogs: false,
          estimateEffort: true,
        },
      };

    case 'government':
    case 'internal':
      // Security-focused for government/enterprise
      return {
        license: {
          allow: [
            'MIT',
            'ISC',
            'BSD-2-Clause',
            'BSD-3-Clause',
            'Apache-2.0',
            'CC0-1.0',
            '0BSD',
          ],
          deny: [...commercialRestrictiveLicenses, 'Unlicense', 'WTFPL'],
          warn: ['LGPL-2.1', 'LGPL-3.0', 'MPL-2.0', 'EPL-1.0', 'EPL-2.0'],
          warnOnUnknown: true,
          checkPatentClauses: true,
        },
        scoring: {
          enabled: true,
          minimumScore: 80, // Highest threshold
          boosters: {
            age: 2.0, // Higher weight on maintenance
            deprecation: 4.5, // Critical importance
            license: 4.0, // Critical importance
            vulnerability: 3.0, // Highest weight on security
            popularity: 0.8, // Lower weight (may use niche packages)
            repository: 2.5, // High weight on maintenance
            updateFrequency: 2.0,
          },
        },
        failOn: 'warning', // Stricter than most
        upgradePath: {
          enabled: true,
          analyzeBreakingChanges: true,
          suggestAlternatives: true,
          fetchChangelogs: true,
          estimateEffort: true,
        },
      };

    case 'custom':
      // Return empty object - let user configure everything
      return {};

    default:
      // Default to commercial settings
      return {};
  }
}
