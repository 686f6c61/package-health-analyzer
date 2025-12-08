/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import type { Config } from '../types/config.js';

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
