/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { describe, it, expect } from 'vitest';
import { formatCliOutput } from '../../src/reporters/cli.js';
import type { ScanResult, PackageAnalysis } from '../../src/types/index.js';

describe('CLI Reporter', () => {
  const createMockPackage = (
    name: string,
    overrides: Partial<PackageAnalysis> = {}
  ): PackageAnalysis => ({
    package: name,
    version: '1.0.0',
    age: {
      package: name,
      version: '1.0.0',
      ageDays: 30,
      ageHuman: '1 month',
      lastPublish: new Date().toISOString(),
      deprecated: false,
      severity: 'ok',
      hasRepository: true,
    },
    license: {
      package: name,
      version: '1.0.0',
      license: 'MIT',
      spdxId: 'MIT',
      category: 'commercial-friendly',
      blueOakRating: 'gold',
      commercialUse: true,
      isDualLicense: false,
      hasPatentClause: false,
      severity: 'ok',
    },
    score: {
      overall: 85,
      rating: 'good',
      dimensions: {
        age: 0.9,
        deprecation: 1.0,
        license: 1.0,
        vulnerability: 1.0,
        popularity: 0.8,
        repository: 1.0,
        updateFrequency: 0.8,
      },
    },
    overallSeverity: 'ok',
    ...overrides,
  });

  const createMockResult = (packages: PackageAnalysis[]): ScanResult => ({
    project: {
      name: 'test-project',
      version: '1.0.0',
      type: 'commercial',
    },
    packages,
    summary: {
      total: packages.length,
      excellent: 0,
      good: 0,
      fair: 0,
      poor: 0,
      averageScore: 75,
      riskLevel: 'low',
      issues: {
        critical: 0,
        warning: 0,
        info: 0,
      },
    },
    recommendations: [],
    meta: {
      scanDuration: 1.23,
      timestamp: new Date().toISOString(),
      configSource: 'default',
    },
  });

  it('should format output with critical packages', () => {
    const criticalPkg = createMockPackage('critical-pkg', {
      overallSeverity: 'critical',
      age: {
        package: 'critical-pkg',
        version: '1.0.0',
        ageDays: 2000,
        ageHuman: '5 years',
        lastPublish: new Date().toISOString(),
        deprecated: true,
        deprecationMessage: 'Use new-pkg instead',
        severity: 'critical',
        hasRepository: false,
      },
    });

    const result = createMockResult([criticalPkg]);
    const output = formatCliOutput(result);

    expect(output).toContain('CRITICAL ISSUES');
    expect(output).toContain('critical-pkg');
  });

  it('should format output with warning packages', () => {
    const warningPkg = createMockPackage('warning-pkg', {
      overallSeverity: 'warning',
      age: {
        package: 'warning-pkg',
        version: '1.0.0',
        ageDays: 800,
        ageHuman: '2 years',
        lastPublish: new Date().toISOString(),
        deprecated: false,
        severity: 'warning',
        hasRepository: true,
      },
    });

    const result = createMockResult([warningPkg]);
    const output = formatCliOutput(result);

    expect(output).toContain('WARNINGS');
    expect(output).toContain('warning-pkg');
  });

  it('should format output with recommendations', () => {
    const result = createMockResult([]);
    result.recommendations = [
      {
        package: 'old-pkg',
        reason: 'Package is deprecated',
        priority: 'high',
        estimatedEffort: '2 hours',
      },
      {
        package: 'another-pkg',
        reason: 'License incompatible',
        priority: 'low',
      },
    ];

    const output = formatCliOutput(result);

    expect(output).toContain('RECOMMENDATIONS');
    expect(output).toContain('old-pkg');
    expect(output).toContain('Estimated effort: 2 hours');
  });

  it('should format summary with low risk level', () => {
    const result = createMockResult([]);
    result.summary.riskLevel = 'low';
    result.summary.averageScore = 85;

    const output = formatCliOutput(result);

    expect(output).toContain('SUMMARY');
    expect(output).toContain('Risk level:');
  });

  it('should format summary with medium risk level', () => {
    const result = createMockResult([]);
    result.summary.riskLevel = 'medium';
    result.summary.averageScore = 65;

    const output = formatCliOutput(result);

    expect(output).toContain('SUMMARY');
    expect(output).toContain('Risk level:');
  });

  it('should format summary with high risk level', () => {
    const result = createMockResult([]);
    result.summary.riskLevel = 'high';
    result.summary.averageScore = 45;

    const output = formatCliOutput(result);

    expect(output).toContain('SUMMARY');
    expect(output).toContain('Risk level:');
  });

  it('should format summary with critical risk level', () => {
    const result = createMockResult([]);
    result.summary.riskLevel = 'critical';
    result.summary.averageScore = 25;

    const output = formatCliOutput(result);

    expect(output).toContain('SUMMARY');
    expect(output).toContain('Risk level:');
  });

  it('should show deprecated package issues', () => {
    const deprecatedPkg = createMockPackage('deprecated-pkg', {
      age: {
        package: 'deprecated-pkg',
        version: '1.0.0',
        ageDays: 100,
        ageHuman: '3 months',
        lastPublish: new Date().toISOString(),
        deprecated: true,
        deprecationMessage: 'Use new-pkg',
        severity: 'critical',
        hasRepository: true,
      },
      overallSeverity: 'critical',
    });

    const result = createMockResult([deprecatedPkg]);
    const output = formatCliOutput(result);

    expect(output).toContain('Deprecated');
  });

  it('should show old package warnings', () => {
    const oldPkg = createMockPackage('old-pkg', {
      age: {
        package: 'old-pkg',
        version: '1.0.0',
        ageDays: 1000,
        ageHuman: '3 years',
        lastPublish: new Date().toISOString(),
        deprecated: false,
        severity: 'warning',
        hasRepository: true,
      },
      overallSeverity: 'warning',
    });

    const result = createMockResult([oldPkg]);
    const output = formatCliOutput(result);

    expect(output).toContain('Old');
  });

  it('should show very old package critical issues', () => {
    const veryOldPkg = createMockPackage('very-old-pkg', {
      age: {
        package: 'very-old-pkg',
        version: '1.0.0',
        ageDays: 2500,
        ageHuman: '7 years',
        lastPublish: new Date().toISOString(),
        deprecated: false,
        severity: 'critical',
        hasRepository: true,
      },
      overallSeverity: 'critical',
    });

    const result = createMockResult([veryOldPkg]);
    const output = formatCliOutput(result);

    expect(output).toContain('Very old');
  });

  it('should show license incompatibility issues', () => {
    const incompatiblePkg = createMockPackage('gpl-pkg', {
      license: {
        package: 'gpl-pkg',
        version: '1.0.0',
        license: 'GPL-3.0',
        spdxId: 'GPL-3.0',
        category: 'commercial-incompatible',
        blueOakRating: 'silver',
        commercialUse: false,
        isDualLicense: false,
        hasPatentClause: false,
        severity: 'critical',
      },
      overallSeverity: 'critical',
    });

    const result = createMockResult([incompatiblePkg]);
    const output = formatCliOutput(result);

    expect(output).toContain('License:');
  });

  it('should show unlicensed package issues', () => {
    const unlicensedPkg = createMockPackage('no-license-pkg', {
      license: {
        package: 'no-license-pkg',
        version: '1.0.0',
        license: 'UNLICENSED',
        category: 'unlicensed',
        blueOakRating: 'unrated',
        commercialUse: false,
        isDualLicense: false,
        hasPatentClause: false,
        severity: 'critical',
      },
      overallSeverity: 'critical',
    });

    const result = createMockResult([unlicensedPkg]);
    const output = formatCliOutput(result);

    expect(output).toContain('No license');
  });

  it('should show license warnings', () => {
    const warningLicensePkg = createMockPackage('lgpl-pkg', {
      license: {
        package: 'lgpl-pkg',
        version: '1.0.0',
        license: 'LGPL-3.0',
        spdxId: 'LGPL-3.0',
        category: 'commercial-warning',
        blueOakRating: 'silver',
        commercialUse: true,
        isDualLicense: false,
        hasPatentClause: false,
        severity: 'warning',
      },
      overallSeverity: 'warning',
    });

    const result = createMockResult([warningLicensePkg]);
    const output = formatCliOutput(result);

    expect(output).toContain('License:');
  });

  it('should show poor license quality warning', () => {
    const leadLicensePkg = createMockPackage('lead-pkg', {
      license: {
        package: 'lead-pkg',
        version: '1.0.0',
        license: 'Custom-License',
        spdxId: 'Custom-License',
        category: 'unknown',
        blueOakRating: 'lead',
        commercialUse: false,
        isDualLicense: false,
        hasPatentClause: false,
        severity: 'warning',
      },
      overallSeverity: 'warning',
    });

    const result = createMockResult([leadLicensePkg]);
    const output = formatCliOutput(result);

    expect(output).toContain('Poor license quality');
  });

  it('should format scores with colors', () => {
    const mediumScorePkg = createMockPackage('medium-score-pkg', {
      score: {
        overall: 70,
        rating: 'good',
        dimensions: {
          age: 0.7,
          deprecation: 0.8,
          license: 0.9,
          vulnerability: 0.8,
          popularity: 0.6,
          repository: 0.8,
          updateFrequency: 0.7,
        },
      },
      overallSeverity: 'warning',
    });

    const lowScorePkg = createMockPackage('low-score-pkg', {
      score: {
        overall: 45,
        rating: 'poor',
        dimensions: {
          age: 0.4,
          deprecation: 0.5,
          license: 0.6,
          vulnerability: 0.5,
          popularity: 0.3,
          repository: 0.4,
          updateFrequency: 0.3,
        },
      },
      overallSeverity: 'critical',
    });

    const result = createMockResult([mediumScorePkg, lowScorePkg]);
    const output = formatCliOutput(result);

    // Only warning and critical packages appear in the output
    expect(output).toContain('medium-score-pkg');
    expect(output).toContain('low-score-pkg');
  });

  it('should include project metadata', () => {
    const result = createMockResult([]);
    const output = formatCliOutput(result);

    expect(output).toContain('Project: test-project@1.0.0');
    expect(output).toContain('Scan duration:');
  });

  it('should handle empty package list', () => {
    const result = createMockResult([]);
    const output = formatCliOutput(result);

    expect(output).toContain('SUMMARY');
    expect(output).not.toContain('CRITICAL ISSUES');
    expect(output).not.toContain('WARNINGS');
  });
});
