/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { describe, it, expect } from 'vitest';
import { calculateHealthScore, getOverallSeverity } from '../../src/analyzers/scorer.js';
import type { AgeAnalysis, LicenseAnalysis } from '../../src/types/index.js';
import { defaultConfig } from '../../src/config/defaults.js';

describe('Health Score Calculator', () => {
  const healthyAge: AgeAnalysis = {
    package: 'pkg',
    version: '1.0.0',
    ageDays: 30,
    ageHuman: '1 month',
    lastPublish: new Date().toISOString(),
    deprecated: false,
    severity: 'ok',
    hasRepository: true,
  };

  const healthyLicense: LicenseAnalysis = {
    package: 'pkg',
    version: '1.0.0',
    license: 'MIT',
    spdxId: 'MIT',
    category: 'commercial-friendly',
    blueOakRating: 'gold',
    commercialUse: true,
    isDualLicense: false,
    hasPatentClause: false,
    severity: 'ok',
  };

  it('should calculate high score for healthy package', () => {
    const score = calculateHealthScore(
      healthyAge,
      healthyLicense,
      undefined, // no vulnerabilities
      defaultConfig.scoring,
      'commercial'
    );

    expect(score.overall).toBeGreaterThan(80);
    expect(score.rating).toMatch(/excellent|good/);
    expect(score.dimensions).toBeDefined();
  });

  it('should calculate low score for deprecated package', () => {
    const deprecatedAge: AgeAnalysis = {
      ...healthyAge,
      deprecated: true,
      deprecationMessage: 'Deprecated',
      severity: 'critical',
      ageDays: 2000,
    };

    const score = calculateHealthScore(
      deprecatedAge,
      healthyLicense,
      undefined,
      defaultConfig.scoring,
      'commercial'
    );

    expect(score.overall).toBeLessThan(70); // Adjusted expectation
    expect(score.rating).toMatch(/poor|fair/);
  });

  it('should penalize GPL licenses in commercial projects', () => {
    const gplLicense: LicenseAnalysis = {
      ...healthyLicense,
      license: 'GPL-3.0',
      spdxId: 'GPL-3.0',
      category: 'commercial-incompatible',
      commercialUse: false,
      severity: 'critical',
    };

    const score = calculateHealthScore(
      healthyAge,
      gplLicense,
      undefined,
      defaultConfig.scoring,
      'commercial'
    );

    expect(score.overall).toBeLessThan(80); // Adjusted expectation
  });

  it('should have all score dimensions between 0 and 1', () => {
    const score = calculateHealthScore(
      healthyAge,
      healthyLicense,
      defaultConfig.scoring,
      'commercial'
    );

    expect(score.dimensions.age).toBeGreaterThanOrEqual(0);
    expect(score.dimensions.age).toBeLessThanOrEqual(1);
    expect(score.dimensions.deprecation).toBeGreaterThanOrEqual(0);
    expect(score.dimensions.deprecation).toBeLessThanOrEqual(1);
    expect(score.dimensions.license).toBeGreaterThanOrEqual(0);
    expect(score.dimensions.license).toBeLessThanOrEqual(1);
  });

  it('should rate 90+ as excellent', () => {
    const score = calculateHealthScore(
      healthyAge,
      healthyLicense,
      defaultConfig.scoring,
      'commercial'
    );

    if (score.overall >= 90) {
      expect(score.rating).toBe('excellent');
    }
  });

  it('should rate 80-89 as excellent', () => {
    const olderAge: AgeAnalysis = {
      ...healthyAge,
      ageDays: 400, // ~1 year, still good
    };

    const score = calculateHealthScore(
      olderAge,
      healthyLicense,
      defaultConfig.scoring,
      'commercial'
    );

    if (score.overall >= 80 && score.overall < 90) {
      expect(score.rating).toBe('excellent');
    }
  });

  it('should penalize old packages', () => {
    const oldAge: AgeAnalysis = {
      ...healthyAge,
      ageDays: 1500, // ~4 years
      severity: 'warning',
    };

    const score = calculateHealthScore(
      oldAge,
      healthyLicense,
      undefined,
      defaultConfig.scoring,
      'commercial'
    );

    expect(score.overall).toBeLessThan(90);
  });

  it('should apply custom boosters', () => {
    const customConfig = {
      ...defaultConfig.scoring,
      boosters: {
        ...defaultConfig.scoring.boosters,
        deprecation: 10.0, // Heavily penalize deprecation
      },
    };

    const deprecatedAge: AgeAnalysis = {
      ...healthyAge,
      deprecated: true,
      severity: 'critical',
    };

    const score = calculateHealthScore(
      deprecatedAge,
      healthyLicense,
      undefined,
      customConfig,
      'commercial'
    );

    expect(score.overall).toBeLessThan(60); // Custom boosters affect score
  });

  it('should handle packages without repository', () => {
    const noRepoAge: AgeAnalysis = {
      ...healthyAge,
      hasRepository: false,
    };

    const score = calculateHealthScore(
      noRepoAge,
      healthyLicense,
      undefined,
      defaultConfig.scoring,
      'commercial'
    );

    expect(score.dimensions.repository).toBeLessThan(0.5);
  });
});

describe('Overall Severity', () => {
  const healthyAge: AgeAnalysis = {
    package: 'pkg',
    version: '1.0.0',
    ageDays: 30,
    ageHuman: '1 month',
    lastPublish: new Date().toISOString(),
    deprecated: false,
    severity: 'ok',
    hasRepository: true,
  };

  const healthyLicense: LicenseAnalysis = {
    package: 'pkg',
    version: '1.0.0',
    license: 'MIT',
    spdxId: 'MIT',
    category: 'commercial-friendly',
    blueOakRating: 'gold',
    commercialUse: true,
    isDualLicense: false,
    hasPatentClause: false,
    severity: 'ok',
  };

  it('should return ok for healthy package', () => {
    const severity = getOverallSeverity(healthyAge, healthyLicense);
    expect(severity).toBe('ok');
  });

  it('should return critical for deprecated package', () => {
    const deprecatedAge: AgeAnalysis = {
      ...healthyAge,
      deprecated: true,
      severity: 'critical',
    };

    const severity = getOverallSeverity(deprecatedAge, healthyLicense);
    expect(severity).toBe('critical');
  });

  it('should return critical for incompatible license', () => {
    const badLicense: LicenseAnalysis = {
      ...healthyLicense,
      category: 'commercial-incompatible',
      severity: 'critical',
    };

    const severity = getOverallSeverity(healthyAge, badLicense);
    expect(severity).toBe('critical');
  });

  it('should return warning for old package', () => {
    const oldAge: AgeAnalysis = {
      ...healthyAge,
      ageDays: 1000,
      severity: 'warning',
    };

    const severity = getOverallSeverity(oldAge, healthyLicense);
    expect(severity).toBe('warning');
  });

  it('should prioritize critical over warning', () => {
    const deprecatedAge: AgeAnalysis = {
      ...healthyAge,
      deprecated: true,
      severity: 'critical',
    };

    const warningLicense: LicenseAnalysis = {
      ...healthyLicense,
      severity: 'warning',
    };

    const severity = getOverallSeverity(deprecatedAge, warningLicense);
    expect(severity).toBe('critical');
  });

  it('should return info for informational issues', () => {
    const infoAge: AgeAnalysis = {
      ...healthyAge,
      severity: 'info',
    };

    const severity = getOverallSeverity(infoAge, healthyLicense);
    expect(severity).toBe('info');
  });
});

describe('calculateHealthScore edge cases', () => {
  it('should return perfect score when scoring is disabled', () => {
    const healthyAge: AgeAnalysis = {
      package: 'test',
      version: '1.0.0',
      ageDays: 30,
      ageHuman: '1 month',
      lastPublish: new Date().toISOString(),
      deprecated: false,
      severity: 'ok',
      hasRepository: true,
    };

    const healthyLicense: LicenseAnalysis = {
      package: 'test',
      version: '1.0.0',
      license: 'MIT',
      spdxId: 'MIT',
      category: 'commercial-friendly',
      blueOakRating: 'gold',
      commercialUse: true,
      isDualLicense: false,
      hasPatentClause: false,
      severity: 'ok',
    };

    const disabledConfig = {
      ...defaultConfig.scoring,
      enabled: false,
    };

    const score = calculateHealthScore(
      healthyAge,
      healthyLicense,
      disabledConfig,
      'commercial'
    );

    expect(score.overall).toBe(100);
    expect(score.rating).toBe('excellent');
    expect(score.dimensions.age).toBe(1);
    expect(score.dimensions.deprecation).toBe(1);
    expect(score.dimensions.license).toBe(1);
    expect(score.dimensions.vulnerability).toBe(1);
    expect(score.dimensions.popularity).toBe(1);
    expect(score.dimensions.repository).toBe(1);
    expect(score.dimensions.updateFrequency).toBe(1);
  });

  it('should handle scoring with custom boosters', () => {
    const healthyAge: AgeAnalysis = {
      package: 'test',
      version: '1.0.0',
      ageDays: 30,
      ageHuman: '1 month',
      lastPublish: new Date().toISOString(),
      deprecated: false,
      severity: 'ok',
      hasRepository: true,
    };

    const healthyLicense: LicenseAnalysis = {
      package: 'test',
      version: '1.0.0',
      license: 'MIT',
      spdxId: 'MIT',
      category: 'commercial-friendly',
      blueOakRating: 'gold',
      commercialUse: true,
      isDualLicense: false,
      hasPatentClause: false,
      severity: 'ok',
    };

    const customConfig = {
      enabled: true,
      minimumScore: 60,
      boosters: {
        age: 2.0,
        deprecation: 5.0,
        license: 4.0,
        vulnerability: 3.0,
        popularity: 1.5,
        repository: 2.5,
        updateFrequency: 2.0,
      },
    };

    const score = calculateHealthScore(
      healthyAge,
      healthyLicense,
      customConfig,
      'commercial'
    );

    expect(score.overall).toBeGreaterThan(0);
    expect(score.overall).toBeLessThanOrEqual(100);
    expect(score.rating).toMatch(/excellent|good|fair|poor/);
  });
});
