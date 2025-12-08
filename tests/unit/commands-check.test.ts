/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkPackage, formatCheckOutput } from '../../src/commands/check.js';
import { fetchPackageMetadata } from '../../src/services/npm-registry.js';
import { defaultConfig } from '../../src/config/defaults.js';

vi.mock('../../src/services/npm-registry.js', () => ({
  fetchPackageMetadata: vi.fn(),
  fetchDownloadStats: vi.fn().mockResolvedValue(1000000),
}));

vi.mock('../../src/services/github-api.js', () => ({
  analyzeGitHubRepository: vi.fn().mockResolvedValue({
    package: 'test',
    version: '1.0.0',
    stars: 1000,
    forks: 100,
    openIssues: 10,
    isArchived: false,
    severity: 'ok',
  }),
}));

describe('Check Command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should check a package', async () => {
    const mockMetadata = {
      name: 'test-package',
      version: '1.0.0',
      license: 'MIT',
      time: {
        '1.0.0': new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      repository: {
        type: 'git',
        url: 'https://github.com/user/repo',
      },
    };

    vi.mocked(fetchPackageMetadata).mockResolvedValue(mockMetadata);

    const result = await checkPackage('test-package', defaultConfig);

    expect(result.package).toBe('test-package');
    expect(result.version).toBe('1.0.0');
    expect(result.age).toBeDefined();
    expect(result.license).toBeDefined();
    expect(result.score).toBeDefined();
  });

  it('should analyze age correctly', async () => {
    const mockMetadata = {
      name: 'old-package',
      version: '1.0.0',
      license: 'MIT',
      time: {
        '1.0.0': new Date(Date.now() - 2000 * 24 * 60 * 60 * 1000).toISOString(),
      },
    };

    vi.mocked(fetchPackageMetadata).mockResolvedValue(mockMetadata);

    const result = await checkPackage('old-package', defaultConfig);

    expect(result.age.ageDays).toBeGreaterThan(1900);
    expect(result.age.severity).toBe('critical');
  });

  it('should detect deprecated packages', async () => {
    const mockMetadata = {
      name: 'deprecated-pkg',
      version: '1.0.0',
      license: 'MIT',
      deprecated: 'Use new-pkg instead',
      time: {
        '1.0.0': new Date().toISOString(),
      },
    };

    vi.mocked(fetchPackageMetadata).mockResolvedValue(mockMetadata);

    const result = await checkPackage('deprecated-pkg', defaultConfig);

    expect(result.age.deprecated).toBe(true);
    expect(result.age.deprecationMessage).toBe('Use new-pkg instead');
  });

  it('should analyze license', async () => {
    const mockMetadata = {
      name: 'apache-pkg',
      version: '1.0.0',
      license: 'Apache-2.0',
      time: {
        '1.0.0': new Date().toISOString(),
      },
    };

    vi.mocked(fetchPackageMetadata).mockResolvedValue(mockMetadata);

    const result = await checkPackage('apache-pkg', defaultConfig);

    expect(result.license.license).toBe('Apache-2.0');
    expect(result.license.category).toBe('commercial-friendly');
    expect(result.license.blueOakRating).toBe('gold');
  });

  it('should calculate health score', async () => {
    const mockMetadata = {
      name: 'healthy-pkg',
      version: '1.0.0',
      license: 'MIT',
      time: {
        '1.0.0': new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    };

    vi.mocked(fetchPackageMetadata).mockResolvedValue(mockMetadata);

    const result = await checkPackage('healthy-pkg', defaultConfig);

    expect(result.score.overall).toBeGreaterThanOrEqual(0);
    expect(result.score.overall).toBeLessThanOrEqual(100);
    expect(result.score.rating).toMatch(/excellent|good|fair|poor/);
  });

  it('should handle packages without repository', async () => {
    const mockMetadata = {
      name: 'no-repo-pkg',
      version: '1.0.0',
      license: 'MIT',
      time: {
        '1.0.0': new Date().toISOString(),
      },
    };

    vi.mocked(fetchPackageMetadata).mockResolvedValue(mockMetadata);

    const result = await checkPackage('no-repo-pkg', defaultConfig);

    expect(result.age.hasRepository).toBe(false);
    expect(result.repository).toBeUndefined();
  });

  it('should handle GPL licenses', async () => {
    const mockMetadata = {
      name: 'gpl-pkg',
      version: '1.0.0',
      license: 'GPL-3.0',
      time: {
        '1.0.0': new Date().toISOString(),
      },
    };

    vi.mocked(fetchPackageMetadata).mockResolvedValue(mockMetadata);

    const result = await checkPackage('gpl-pkg', defaultConfig);

    expect(result.license.category).toBe('commercial-incompatible');
    expect(result.license.commercialUse).toBe(false);
  });

  describe('formatCheckOutput', () => {
    const mockAnalysis = {
      package: 'test-pkg',
      version: '1.0.0',
      age: {
        package: 'test-pkg',
        version: '1.0.0',
        ageDays: 30,
        ageHuman: '1 month',
        lastPublish: new Date().toISOString(),
        deprecated: false,
        severity: 'ok' as const,
        hasRepository: true,
        repositoryUrl: 'https://github.com/user/repo',
      },
      license: {
        package: 'test-pkg',
        version: '1.0.0',
        license: 'MIT',
        spdxId: 'MIT',
        category: 'commercial-friendly' as const,
        blueOakRating: 'gold' as const,
        commercialUse: true,
        isDualLicense: false,
        hasPatentClause: false,
        severity: 'ok' as const,
      },
      score: {
        overall: 95,
        rating: 'excellent' as const,
        dimensions: {
          age: 1,
          deprecation: 1,
          license: 1,
          vulnerability: 1,
          popularity: 0.9,
          repository: 0.9,
          updateFrequency: 0.9,
        },
      },
      overallSeverity: 'ok' as const,
    };

    it('should format check output', () => {
      const output = formatCheckOutput(mockAnalysis);

      expect(output).toContain('test-pkg');
      expect(output).toContain('1.0.0');
      expect(output).toContain('MIT');
    });

    it('should include severity information', () => {
      const output = formatCheckOutput(mockAnalysis);

      expect(output).toContain('HEALTH SCORE');
    });

    it('should show repository information when available', () => {
      const output = formatCheckOutput(mockAnalysis);

      expect(output).toContain('Repository:');
      expect(output).toContain('github.com/user/repo');
    });

    it('should handle deprecated packages in output', () => {
      const deprecatedAnalysis = {
        ...mockAnalysis,
        age: {
          ...mockAnalysis.age,
          deprecated: true,
          deprecationMessage: 'Use new-pkg instead',
          severity: 'critical' as const,
        },
      };

      const output = formatCheckOutput(deprecatedAnalysis);

      expect(output).toContain('DEPRECATED');
    });

    it('should show license reason when available', () => {
      const licenseWithReason = {
        ...mockAnalysis,
        license: {
          ...mockAnalysis.license,
          reason: 'Explicitly allowed in configuration',
        },
      };

      const output = formatCheckOutput(licenseWithReason);

      expect(output).toContain('Note:');
      expect(output).toContain('Explicitly allowed in configuration');
    });

    it('should handle info severity level', () => {
      const infoAnalysis = {
        ...mockAnalysis,
        overallSeverity: 'info' as const,
      };

      const output = formatCheckOutput(infoAnalysis);

      expect(output).toContain('Informational notices');
    });

    it('should handle warning severity level', () => {
      const warningAnalysis = {
        ...mockAnalysis,
        overallSeverity: 'warning' as const,
      };

      const output = formatCheckOutput(warningAnalysis);

      expect(output).toContain('Warnings detected');
    });

    it('should handle critical severity level', () => {
      const criticalAnalysis = {
        ...mockAnalysis,
        overallSeverity: 'critical' as const,
      };

      const output = formatCheckOutput(criticalAnalysis);

      expect(output).toContain('Critical issues detected');
    });

    it('should show patent clause when present', () => {
      const patentAnalysis = {
        ...mockAnalysis,
        license: {
          ...mockAnalysis.license,
          hasPatentClause: true,
        },
      };

      const output = formatCheckOutput(patentAnalysis);

      expect(output).toContain('Patent clause: Yes');
    });

    it('should show dual license indicator when present', () => {
      const dualLicenseAnalysis = {
        ...mockAnalysis,
        license: {
          ...mockAnalysis.license,
          isDualLicense: true,
        },
      };

      const output = formatCheckOutput(dualLicenseAnalysis);

      expect(output).toContain('Dual license: Yes');
    });
  });
});
