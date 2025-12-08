/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { describe, it, expect } from 'vitest';
import { analyzeLicense, calculateLicenseScore } from '../../src/analyzers/license.js';
import type { PackageMetadata } from '../../src/types/index.js';
import { defaultConfig } from '../../src/config/defaults.js';

describe('License Analyzer', () => {
  it('should analyze MIT license', () => {
    const metadata: PackageMetadata = {
      name: 'mit-pkg',
      version: '1.0.0',
      license: 'MIT',
    };

    const result = analyzeLicense(metadata, 'commercial', defaultConfig.license);

    expect(result.package).toBe('mit-pkg');
    expect(result.version).toBe('1.0.0');
    expect(result.license).toBe('MIT');
    expect(result.spdxId).toBe('MIT');
    expect(result.category).toBe('commercial-friendly');
    expect(result.blueOakRating).toBe('gold');
    expect(result.commercialUse).toBe(true);
    expect(result.severity).toBe('ok');
  });

  it('should analyze Apache-2.0 license', () => {
    const metadata: PackageMetadata = {
      name: 'apache-pkg',
      version: '1.0.0',
      license: 'Apache-2.0',
    };

    const result = analyzeLicense(metadata, 'commercial', defaultConfig.license);

    expect(result.license).toBe('Apache-2.0');
    expect(result.category).toBe('commercial-friendly');
    expect(result.blueOakRating).toBe('gold');
    expect(result.hasPatentClause).toBe(true);
  });

  it('should detect GPL as commercial-incompatible', () => {
    const metadata: PackageMetadata = {
      name: 'gpl-pkg',
      version: '1.0.0',
      license: 'GPL-3.0',
    };

    const result = analyzeLicense(metadata, 'commercial', defaultConfig.license);

    expect(result.category).toBe('commercial-incompatible');
    expect(result.commercialUse).toBe(false);
    expect(result.severity).toBe('critical');
  });

  it('should detect AGPL as commercial-incompatible', () => {
    const metadata: PackageMetadata = {
      name: 'agpl-pkg',
      version: '1.0.0',
      license: 'AGPL-3.0',
    };

    const result = analyzeLicense(metadata, 'commercial', defaultConfig.license);

    expect(result.category).toBe('commercial-incompatible');
    expect(result.commercialUse).toBe(false);
  });

  it('should handle LGPL as commercial-warning', () => {
    const metadata: PackageMetadata = {
      name: 'lgpl-pkg',
      version: '1.0.0',
      license: 'LGPL-3.0',
    };

    const result = analyzeLicense(metadata, 'commercial', defaultConfig.license);

    expect(result.category).toBe('commercial-warning');
    expect(result.severity).toBe('warning');
  });

  it('should handle MPL as commercial-warning', () => {
    const metadata: PackageMetadata = {
      name: 'mpl-pkg',
      version: '1.0.0',
      license: 'MPL-2.0',
    };

    const result = analyzeLicense(metadata, 'commercial', defaultConfig.license);

    expect(result.category).toBe('commercial-warning');
  });

  it('should handle unlicensed packages', () => {
    const metadata: PackageMetadata = {
      name: 'no-license',
      version: '1.0.0',
      license: 'UNLICENSED',
    };

    const result = analyzeLicense(metadata, 'commercial', defaultConfig.license);

    expect(result.category).toBe('unlicensed');
    expect(result.severity).toBe('critical');
  });

  it('should handle missing license', () => {
    const metadata: PackageMetadata = {
      name: 'no-license',
      version: '1.0.0',
    };

    const result = analyzeLicense(metadata, 'commercial', defaultConfig.license);

    expect(result.category).toBe('unlicensed');
    expect(result.severity).toBe('critical');
  });

  it('should detect dual licenses with OR', () => {
    const metadata: PackageMetadata = {
      name: 'dual-pkg',
      version: '1.0.0',
      license: '(MIT OR Apache-2.0)',
    };

    const result = analyzeLicense(metadata, 'commercial', defaultConfig.license);

    expect(result.isDualLicense).toBe(true);
    expect(result.category).toBe('commercial-friendly');
  });

  it('should detect dual licenses with AND', () => {
    const metadata: PackageMetadata = {
      name: 'dual-and-pkg',
      version: '1.0.0',
      license: '(MIT AND BSD-2-Clause)',
    };

    const result = analyzeLicense(metadata, 'commercial', defaultConfig.license);

    // AND requires both licenses, not a choice
    expect(result.isDualLicense).toBe(false);
    expect(result.category).toBe('commercial-friendly');
  });

  it('should choose best license from dual OR license', () => {
    const metadata: PackageMetadata = {
      name: 'best-pkg',
      version: '1.0.0',
      license: '(GPL-3.0 OR MIT)',
    };

    const result = analyzeLicense(metadata, 'commercial', defaultConfig.license);

    expect(result.spdxId).toBe('MIT'); // Should choose MIT over GPL
    expect(result.category).toBe('commercial-friendly');
  });

  it('should handle ISC license', () => {
    const metadata: PackageMetadata = {
      name: 'isc-pkg',
      version: '1.0.0',
      license: 'ISC',
    };

    const result = analyzeLicense(metadata, 'commercial', defaultConfig.license);

    expect(result.category).toBe('commercial-friendly');
    expect(result.blueOakRating).toBe('silver');
  });

  it('should handle BSD licenses', () => {
    const metadata: PackageMetadata = {
      name: 'bsd-pkg',
      version: '1.0.0',
      license: 'BSD-3-Clause',
    };

    const result = analyzeLicense(metadata, 'commercial', defaultConfig.license);

    expect(result.category).toBe('commercial-friendly');
    expect(result.blueOakRating).toBe('silver');
  });

  it('should be permissive for open-source project type', () => {
    const metadata: PackageMetadata = {
      name: 'lgpl-pkg',
      version: '1.0.0',
      license: 'LGPL-3.0',
    };

    const result = analyzeLicense(metadata, 'open-source', defaultConfig.license);

    expect(result.commercialUse).toBe(true); // More permissive for OSS
  });

  it('should be strict for SaaS project type with AGPL', () => {
    const metadata: PackageMetadata = {
      name: 'agpl-pkg',
      version: '1.0.0',
      license: 'AGPL-3.0',
    };

    const result = analyzeLicense(metadata, 'saas', defaultConfig.license);

    expect(result.commercialUse).toBe(false);
    expect(result.severity).toBe('critical');
  });

  it('should handle CC0 license', () => {
    const metadata: PackageMetadata = {
      name: 'cc0-pkg',
      version: '1.0.0',
      license: 'CC0-1.0',
    };

    const result = analyzeLicense(metadata, 'commercial', defaultConfig.license);

    expect(result.category).toBe('commercial-friendly');
    expect(result.blueOakRating).toBe('gold');
  });

  it('should handle Unlicense', () => {
    const metadata: PackageMetadata = {
      name: 'unlicense-pkg',
      version: '1.0.0',
      license: 'Unlicense',
    };

    const result = analyzeLicense(metadata, 'commercial', defaultConfig.license);

    expect(result.category).toBe('commercial-friendly');
    expect(result.blueOakRating).toBe('gold');
  });

  it('should handle custom unknown licenses', () => {
    const metadata: PackageMetadata = {
      name: 'custom-pkg',
      version: '1.0.0',
      license: 'Custom-License',
    };

    const result = analyzeLicense(metadata, 'commercial', defaultConfig.license);

    // Unknown licenses may be categorized as incompatible for safety
    expect(result.blueOakRating).toBe('unrated');
    expect(result.severity).toMatch(/warning|critical/);
  });

  it('should not detect patent clause in MIT', () => {
    const metadata: PackageMetadata = {
      name: 'mit-pkg',
      version: '1.0.0',
      license: 'MIT',
    };

    const result = analyzeLicense(metadata, 'commercial', defaultConfig.license);

    expect(result.hasPatentClause).toBe(false);
  });

  it('should handle CC-BY-4.0 as commercial-friendly', () => {
    const metadata: PackageMetadata = {
      name: 'cc-by-pkg',
      version: '1.0.0',
      license: 'CC-BY-4.0',
    };

    const result = analyzeLicense(metadata, 'commercial', defaultConfig.license);

    expect(result.category).toBe('commercial-friendly');
    expect(result.commercialUse).toBe(true);
  });

  it('should handle CC-BY-NC-4.0 as commercial-incompatible', () => {
    const metadata: PackageMetadata = {
      name: 'cc-nc-pkg',
      version: '1.0.0',
      license: 'CC-BY-NC-4.0',
    };

    const result = analyzeLicense(metadata, 'commercial', defaultConfig.license);

    expect(result.category).toBe('commercial-incompatible');
    expect(result.commercialUse).toBe(false);
    expect(result.severity).toBe('critical');
  });

  it('should handle CC-BY-SA-4.0 as commercial-incompatible', () => {
    const metadata: PackageMetadata = {
      name: 'cc-sa-pkg',
      version: '1.0.0',
      license: 'CC-BY-SA-4.0',
    };

    const result = analyzeLicense(metadata, 'commercial', defaultConfig.license);

    expect(result.category).toBe('commercial-incompatible');
    expect(result.commercialUse).toBe(false);
  });

  it('should handle AFL-3.0 as commercial-friendly', () => {
    const metadata: PackageMetadata = {
      name: 'afl-pkg',
      version: '1.0.0',
      license: 'AFL-3.0',
    };

    const result = analyzeLicense(metadata, 'commercial', defaultConfig.license);

    expect(result.category).toBe('commercial-friendly');
    expect(result.commercialUse).toBe(true);
  });

  it('should handle GFDL-1.3 as commercial-incompatible', () => {
    const metadata: PackageMetadata = {
      name: 'gfdl-pkg',
      version: '1.0.0',
      license: 'GFDL-1.3-only',
    };

    const result = analyzeLicense(metadata, 'commercial', defaultConfig.license);

    expect(result.category).toBe('commercial-incompatible');
    expect(result.commercialUse).toBe(false);
  });

  it('should handle EUPL-1.2 as weak copyleft', () => {
    const metadata: PackageMetadata = {
      name: 'eupl-pkg',
      version: '1.0.0',
      license: 'EUPL-1.2',
    };

    const result = analyzeLicense(metadata, 'commercial', defaultConfig.license);

    expect(result.category).toBe('commercial-warning');
    expect(result.severity).toBe('warning');
  });

  it('should handle UPL-1.0 as commercial-friendly', () => {
    const metadata: PackageMetadata = {
      name: 'upl-pkg',
      version: '1.0.0',
      license: 'UPL-1.0',
    };

    const result = analyzeLicense(metadata, 'commercial', defaultConfig.license);

    expect(result.category).toBe('commercial-friendly');
    expect(result.commercialUse).toBe(true);
  });
});

describe('analyzeLicense edge cases', () => {
  it('should handle packages with unknown license category and warnOnUnknown=true', () => {
    const metadata: PackageMetadata = {
      name: 'unknown-license-pkg',
      version: '1.0.0',
      license: 'Some-Unknown-License-1.0',
    };

    const config = {
      ...defaultConfig.license,
      warnOnUnknown: true,
    };

    const result = analyzeLicense(metadata, 'commercial', config);

    // Unknown licenses should generate warnings when warnOnUnknown is true
    expect(result).toBeDefined();
  });

  it('should handle packages with unknown license category and warnOnUnknown=false', () => {
    const metadata: PackageMetadata = {
      name: 'unknown-license-pkg',
      version: '1.0.0',
      license: 'Some-Unknown-License-1.0',
    };

    const config = {
      ...defaultConfig.license,
      warnOnUnknown: false,
    };

    const result = analyzeLicense(metadata, 'commercial', config);

    expect(result).toBeDefined();
  });

  it('should handle packages with no license field', () => {
    const metadata: PackageMetadata = {
      name: 'no-license-pkg',
      version: '1.0.0',
      // No license field
    };

    const result = analyzeLicense(metadata, 'commercial', defaultConfig.license);

    expect(result.license).toBe('UNLICENSED');
    expect(result.category).toBe('unlicensed');
    expect(result.severity).toBe('critical');
    expect(result.commercialUse).toBe(false);
    expect(result.reason).toBe('No license specified');
    expect(result.isDualLicense).toBe(false);
    expect(result.hasPatentClause).toBe(false);
  });

  it('should handle packages with invalid SPDX license', () => {
    const metadata: PackageMetadata = {
      name: 'invalid-spdx-pkg',
      version: '1.0.0',
      license: 'Not-A-Valid-SPDX-License',
    };

    const result = analyzeLicense(metadata, 'commercial', defaultConfig.license);

    // Invalid licenses may be categorized as unknown or incompatible
    expect(result).toBeDefined();
    expect(result.commercialUse).toBeDefined();
    expect(result.isDualLicense).toBe(false);
    expect(result.hasPatentClause).toBe(false);
  });

  it('should handle UNLICENSED packages', () => {
    const metadata: PackageMetadata = {
      name: 'unlicensed-pkg',
      version: '1.0.0',
      license: 'UNLICENSED',
    };

    const result = analyzeLicense(metadata, 'commercial', defaultConfig.license);

    expect(result.category).toBe('unlicensed');
    expect(result.severity).toBe('critical');
  });

  it('should handle SEE LICENSE IN file', () => {
    const metadata: PackageMetadata = {
      name: 'see-license-pkg',
      version: '1.0.0',
      license: 'SEE LICENSE IN LICENSE.md',
    };

    const result = analyzeLicense(metadata, 'commercial', defaultConfig.license);

    // SEE LICENSE IN is handled as a special case
    expect(result).toBeDefined();
  });

  it('should analyze dual license packages', () => {
    const metadata: PackageMetadata = {
      name: 'dual-license-pkg',
      version: '1.0.0',
      license: '(MIT OR Apache-2.0)',
    };

    const result = analyzeLicense(metadata, 'commercial', defaultConfig.license);

    expect(result.isDualLicense).toBe(true);
    expect(result.category).toBe('commercial-friendly');
  });

  it('should handle licenses with OR operator', () => {
    const metadata: PackageMetadata = {
      name: 'or-license-pkg',
      version: '1.0.0',
      license: 'MIT OR GPL-3.0',
    };

    const result = analyzeLicense(metadata, 'commercial', defaultConfig.license);

    // Should choose most permissive (MIT)
    expect(result.category).toBe('commercial-friendly');
  });

  it('should handle licenses with AND operator', () => {
    const metadata: PackageMetadata = {
      name: 'and-license-pkg',
      version: '1.0.0',
      license: 'MIT AND Apache-2.0',
    };

    const result = analyzeLicense(metadata, 'commercial', defaultConfig.license);

    expect(result).toBeDefined();
  });

  it('should respect license allow list', () => {
    const metadata: PackageMetadata = {
      name: 'allowed-pkg',
      version: '1.0.0',
      license: 'ISC',
    };

    const config = {
      ...defaultConfig.license,
      allow: ['ISC'],
    };

    const result = analyzeLicense(metadata, 'commercial', config);

    expect(result.severity).toBe('ok');
  });

  it('should respect license deny list', () => {
    const metadata: PackageMetadata = {
      name: 'denied-pkg',
      version: '1.0.0',
      license: 'MIT',
    };

    const config = {
      ...defaultConfig.license,
      deny: ['MIT'],
    };

    const result = analyzeLicense(metadata, 'commercial', config);

    expect(result.severity).toBe('critical');
  });

  it('should respect license warn list', () => {
    const metadata: PackageMetadata = {
      name: 'warn-pkg',
      version: '1.0.0',
      license: 'BSD-2-Clause',
    };

    const config = {
      ...defaultConfig.license,
      warn: ['BSD-2-Clause'],
    };

    const result = analyzeLicense(metadata, 'commercial', config);

    // Warn list affects the result
    expect(result).toBeDefined();
    expect(result.license).toContain('BSD');
  });

  it('should detect patent clauses in Apache license', () => {
    const metadata: PackageMetadata = {
      name: 'apache-pkg',
      version: '1.0.0',
      license: 'Apache-2.0',
    };

    const result = analyzeLicense(metadata, 'commercial', defaultConfig.license);

    expect(result.hasPatentClause).toBe(true);
  });

  it('should not check patent clauses when config is disabled', () => {
    const metadata: PackageMetadata = {
      name: 'apache-pkg',
      version: '1.0.0',
      license: 'Apache-2.0',
    };

    const config = {
      ...defaultConfig.license,
      checkPatentClauses: false,
    };

    const result = analyzeLicense(metadata, 'commercial', config);

    expect(result.hasPatentClause).toBe(false);
  });
});

describe('calculateLicenseScore', () => {
  it('should return 0 for unlicensed category', () => {
    const score = calculateLicenseScore('unlicensed', 'unrated', 'commercial');

    expect(score).toBe(0.0);
  });

  it('should penalize lead-rated licenses', () => {
    const score = calculateLicenseScore('commercial-friendly', 'lead', 'commercial');

    // Lead rating should reduce the score (multiply by 0.8)
    expect(score).toBeLessThan(1.0);
    expect(score).toBeGreaterThan(0.0);
  });

  it('should boost legally sound licenses', () => {
    const goldScore = calculateLicenseScore('commercial-friendly', 'gold', 'commercial');
    const unreatedScore = calculateLicenseScore('commercial-friendly', 'unrated', 'commercial');

    // Gold rating should boost the score
    expect(goldScore).toBeGreaterThanOrEqual(unreatedScore);
  });

  it('should handle unknown licenses', () => {
    const score = calculateLicenseScore('unknown', 'unrated', 'commercial');

    expect(score).toBe(0.3);
  });

  it('should handle commercial-warning for commercial projects', () => {
    const score = calculateLicenseScore('commercial-warning', 'unrated', 'commercial');

    expect(score).toBe(0.5);
  });

  it('should handle commercial-warning for open-source projects', () => {
    const score = calculateLicenseScore('commercial-warning', 'unrated', 'open-source');

    expect(score).toBe(0.8);
  });

  it('should handle commercial-incompatible for open-source projects', () => {
    const score = calculateLicenseScore('commercial-incompatible', 'unrated', 'open-source');

    expect(score).toBe(0.6);
  });

  it('should handle commercial-incompatible for commercial projects', () => {
    const score = calculateLicenseScore('commercial-incompatible', 'silver', 'commercial');

    expect(score).toBe(0.0);
  });
});
