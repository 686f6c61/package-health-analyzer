/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { describe, it, expect } from 'vitest';
import { formatCliOutput } from '../../src/reporters/cli.js';
import { formatCsvOutput, formatSummaryCsv } from '../../src/reporters/csv.js';
import type { ScanResult } from '../../src/types/index.js';

const mockScanResult: ScanResult = {
  meta: {
    version: '0.1.0',
    timestamp: '2025-12-08T10:00:00Z',
    projectType: 'commercial',
    scanDuration: 2.5,
  },
  project: {
    name: 'test-project',
    version: '1.0.0',
    path: '/test/path',
  },
  summary: {
    total: 3,
    excellent: 1,
    good: 1,
    fair: 1,
    poor: 0,
    averageScore: 75,
    riskLevel: 'medium',
    issues: {
      critical: 0,
      warning: 1,
      info: 2,
    },
  },
  packages: [
    {
      package: 'test-pkg-1',
      version: '1.0.0',
      age: {
        package: 'test-pkg-1',
        version: '1.0.0',
        ageDays: 100,
        ageHuman: '3 months',
        lastPublish: '2024-09-01',
        deprecated: false,
        deprecationMessage: undefined,
        severity: 'ok',
        hasRepository: true,
        repositoryUrl: 'https://github.com/test/pkg1',
      },
      license: {
        package: 'test-pkg-1',
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
        overall: 95,
        rating: 'excellent',
        dimensions: {
          age: 1,
          deprecation: 1,
          license: 1,
          vulnerability: 1,
          popularity: 0.8,
          repository: 0.9,
          updateFrequency: 0.85,
        },
      },
      overallSeverity: 'ok',
    },
    {
      package: 'test-pkg-2',
      version: '2.5.0',
      age: {
        package: 'test-pkg-2',
        version: '2.5.0',
        ageDays: 730,
        ageHuman: '2 years',
        lastPublish: '2023-12-08',
        deprecated: false,
        deprecationMessage: undefined,
        severity: 'warning',
        hasRepository: true,
        repositoryUrl: 'https://github.com/test/pkg2',
      },
      license: {
        package: 'test-pkg-2',
        version: '2.5.0',
        license: 'Apache-2.0',
        spdxId: 'Apache-2.0',
        category: 'commercial-friendly',
        blueOakRating: 'gold',
        commercialUse: true,
        isDualLicense: false,
        hasPatentClause: false,
        severity: 'ok',
      },
      score: {
        overall: 70,
        rating: 'good',
        dimensions: {
          age: 0.6,
          deprecation: 1,
          license: 1,
          vulnerability: 1,
          popularity: 0.7,
          repository: 0.8,
          updateFrequency: 0.5,
        },
      },
      overallSeverity: 'warning',
    },
    {
      package: 'test-pkg-3',
      version: '0.5.0',
      age: {
        package: 'test-pkg-3',
        version: '0.5.0',
        ageDays: 1095,
        ageHuman: '3 years',
        lastPublish: '2022-12-08',
        deprecated: true,
        deprecationMessage: 'Use new-pkg instead',
        severity: 'critical',
        hasRepository: false,
        repositoryUrl: undefined,
      },
      license: {
        package: 'test-pkg-3',
        version: '0.5.0',
        license: 'ISC',
        spdxId: 'ISC',
        category: 'commercial-friendly',
        blueOakRating: 'silver',
        commercialUse: true,
        isDualLicense: false,
        hasPatentClause: false,
        severity: 'ok',
      },
      score: {
        overall: 45,
        rating: 'fair',
        dimensions: {
          age: 0.3,
          deprecation: 0,
          license: 1,
          vulnerability: 1,
          popularity: 0.5,
          repository: 0.4,
          updateFrequency: 0.2,
        },
      },
      overallSeverity: 'critical',
    },
  ],
  recommendations: [
    {
      package: 'test-pkg-3',
      reason: 'Package is deprecated: Use new-pkg instead',
      priority: 'high',
      estimatedEffort: '2-4 hours',
    },
  ],
  exitCode: 1,
};

describe('CLI Reporter', () => {
  it('should format scan result to CLI output', () => {
    const output = formatCliOutput(mockScanResult);

    expect(output).toContain('test-project');
    expect(output).toContain('1.0.0');
    // Only packages with warnings/critical issues are shown in tables
    expect(output).toContain('test-pkg-2'); // warning
    expect(output).toContain('test-pkg-3'); // critical
  });

  it('should include summary information', () => {
    const output = formatCliOutput(mockScanResult);

    expect(output).toContain('SUMMARY');
    expect(output).toContain('Excellent');
    expect(output).toContain('Good');
    expect(output).toContain('Fair');
  });

  it('should include health ratings', () => {
    const output = formatCliOutput(mockScanResult);

    // Summary section includes ratings count
    expect(output).toContain('Excellent:');
    expect(output).toContain('Good:');
    expect(output).toContain('Fair:');
  });

  it('should include license information', () => {
    const output = formatCliOutput(mockScanResult);

    // CLI reporter shows license ratings
    expect(output).toContain('★'); // Star for gold/silver ratings
  });

  it('should show recommendations section', () => {
    const output = formatCliOutput(mockScanResult);

    expect(output).toContain('RECOMMENDATIONS');
    expect(output).toContain('test-pkg-3');
    expect(output).toContain('deprecated');
  });

  it('should handle empty packages list', () => {
    const emptyResult: ScanResult = {
      ...mockScanResult,
      packages: [],
      summary: {
        ...mockScanResult.summary,
        total: 0,
        excellent: 0,
        good: 0,
        fair: 0,
        poor: 0,
      },
    };

    const output = formatCliOutput(emptyResult);
    expect(output).toBeDefined();
    expect(output).toContain('0');
  });
});

describe('CSV Reporter', () => {
  it('should format scan result to CSV output', () => {
    const output = formatCsvOutput(mockScanResult);

    expect(output).toContain('package,version');
    expect(output).toContain('test-pkg-1,1.0.0');
    expect(output).toContain('test-pkg-2,2.5.0');
    expect(output).toContain('test-pkg-3,0.5.0');
  });

  it('should include all required columns', () => {
    const output = formatCsvOutput(mockScanResult);

    expect(output).toContain('package');
    expect(output).toContain('version');
    expect(output).toContain('age_days');
    expect(output).toContain('age_human');
    expect(output).toContain('deprecated');
    expect(output).toContain('license');
    expect(output).toContain('license_category');
    expect(output).toContain('blue_oak_rating');
    expect(output).toContain('commercial_use');
    expect(output).toContain('health_score');
    expect(output).toContain('health_rating');
    expect(output).toContain('severity');
  });

  it('should properly escape CSV values', () => {
    const result: ScanResult = {
      ...mockScanResult,
      packages: [
        {
          ...mockScanResult.packages[0],
          package: 'test,pkg',
          age: {
            ...mockScanResult.packages[0].age,
            deprecationMessage: 'Message with "quotes"',
          },
        },
      ],
    };

    const output = formatCsvOutput(result);
    expect(output).toContain('"test,pkg"');
  });

  it('should handle deprecated packages', () => {
    const output = formatCsvOutput(mockScanResult);

    const lines = output.split('\n');
    const deprecatedLine = lines.find((line) => line.includes('test-pkg-3'));

    expect(deprecatedLine).toContain('true'); // deprecated flag
    expect(deprecatedLine).toContain('critical'); // severity
  });

  it('should show Blue Oak ratings', () => {
    const output = formatCsvOutput(mockScanResult);

    expect(output).toContain('gold');
    expect(output).toContain('silver');
  });

  it('should handle empty packages list', () => {
    const emptyResult: ScanResult = {
      ...mockScanResult,
      packages: [],
    };

    const output = formatCsvOutput(emptyResult);
    const lines = output.split('\n').filter((line) => line.trim());

    expect(lines.length).toBe(1); // Only header
    expect(lines[0]).toContain('package,version');
  });

  it('should include repository information when available', () => {
    const output = formatCsvOutput(mockScanResult);

    expect(output).toContain('has_repository');
    expect(output).toContain('repository_url');
    expect(output).toContain('true');
    expect(output).toContain('https://github.com/test/pkg1');
  });

  it('should handle missing repository information', () => {
    const output = formatCsvOutput(mockScanResult);

    const lines = output.split('\n');
    const noRepoLine = lines.find((line) => line.includes('test-pkg-3'));

    expect(noRepoLine).toContain('false');
  });
});

describe('formatSummaryCsv', () => {
  it('should format summary as CSV', () => {
    const mockResult = {
      summary: {
        total: 10,
        passed: 8,
        warnings: 1,
        critical: 1,
        excellent: 5,
        good: 3,
        fair: 1,
        poor: 1,
        averageScore: 82,
        riskLevel: 'low' as const,
        issues: {
          critical: 1,
          warning: 1,
          info: 0,
        },
      },
      packages: [],
      exitCode: 0,
    };

    const output = formatSummaryCsv(mockResult);

    expect(output).toContain('metric,value');
    expect(output).toContain('total_packages,10');
    expect(output).toContain('excellent,5');
    expect(output).toContain('good,3');
    expect(output).toContain('fair,1');
    expect(output).toContain('poor,1');
    expect(output).toContain('average_score,82');
    expect(output).toContain('risk_level,low');
    expect(output).toContain('critical_issues,1');
    expect(output).toContain('warnings,1');
    expect(output).toContain('info,0');
    expect(output).toContain('exit_code,0');
  });

  it('should handle high risk level', () => {
    const mockResult = {
      summary: {
        total: 10,
        passed: 2,
        warnings: 3,
        critical: 5,
        excellent: 0,
        good: 2,
        fair: 3,
        poor: 5,
        averageScore: 45,
        riskLevel: 'high' as const,
        issues: {
          critical: 5,
          warning: 3,
          info: 2,
        },
      },
      packages: [],
      exitCode: 2,
    };

    const output = formatSummaryCsv(mockResult);

    expect(output).toContain('risk_level,high');
    expect(output).toContain('critical_issues,5');
    expect(output).toContain('exit_code,2');
  });
});
