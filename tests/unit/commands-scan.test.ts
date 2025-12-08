/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { scanDependencies } from '../../src/commands/scan.js';
import * as packageReader from '../../src/services/package-reader.js';
import * as npmRegistry from '../../src/services/npm-registry.js';
import * as ageAnalyzer from '../../src/analyzers/age.js';
import * as licenseAnalyzer from '../../src/analyzers/license.js';
import * as scorer from '../../src/analyzers/scorer.js';
import * as upgradeAnalyzer from '../../src/analyzers/upgrade.js';
import * as githubApi from '../../src/services/github-api.js';
import { defaultConfig } from '../../src/config/defaults.js';

// Mock all dependencies
vi.mock('../../src/services/package-reader.js');
vi.mock('../../src/services/npm-registry.js');
vi.mock('../../src/analyzers/age.js');
vi.mock('../../src/analyzers/license.js');
vi.mock('../../src/analyzers/scorer.js');
vi.mock('../../src/analyzers/upgrade.js');
vi.mock('../../src/services/github-api.js');

describe('Scan Command', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mocks
    vi.mocked(packageReader.readPackageJson).mockResolvedValue({
      name: 'test-project',
      version: '1.0.0',
      dependencies: {
        'test-pkg-1': '^1.0.0',
        'test-pkg-2': '^2.0.0',
      },
    });

    vi.mocked(packageReader.getAllDependencies).mockReturnValue(
      new Map([
        ['test-pkg-1', '^1.0.0'],
        ['test-pkg-2', '^2.0.0'],
      ])
    );
  });

  it('should scan all dependencies successfully', async () => {
    // Mock npm registry responses
    vi.mocked(npmRegistry.fetchPackageMetadata)
      .mockResolvedValueOnce({
        name: 'test-pkg-1',
        version: '1.5.0',
        license: 'MIT',
        time: {
          '1.5.0': new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        repository: {
          type: 'git',
          url: 'https://github.com/user/repo1',
        },
      })
      .mockResolvedValueOnce({
        name: 'test-pkg-2',
        version: '2.1.0',
        license: 'Apache-2.0',
        time: {
          '2.1.0': new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        },
      });

    // Mock analyzers
    vi.mocked(ageAnalyzer.analyzeAge).mockReturnValue({
      package: 'test-pkg-1',
      version: '1.5.0',
      ageDays: 30,
      ageHuman: '1 month',
      lastPublish: new Date().toISOString(),
      deprecated: false,
      severity: 'ok',
      hasRepository: true,
      repositoryUrl: 'https://github.com/user/repo1',
    });

    vi.mocked(licenseAnalyzer.analyzeLicense).mockReturnValue({
      package: 'test-pkg-1',
      version: '1.5.0',
      license: 'MIT',
      spdxId: 'MIT',
      category: 'commercial-friendly',
      blueOakRating: 'gold',
      commercialUse: true,
      isDualLicense: false,
      hasPatentClause: false,
      severity: 'ok',
    });

    vi.mocked(scorer.calculateHealthScore).mockReturnValue({
      overall: 95,
      rating: 'excellent',
      dimensions: {
        age: 1,
        deprecation: 1,
        license: 1,
        vulnerability: 1,
        popularity: 0.9,
        repository: 0.9,
        updateFrequency: 0.9,
      },
    });

    vi.mocked(scorer.getOverallSeverity).mockReturnValue('ok');
    vi.mocked(upgradeAnalyzer.analyzePackageUpgrade).mockResolvedValue(undefined);

    const result = await scanDependencies(defaultConfig);

    expect(result.packages.length).toBe(2);
    expect(result.summary.total).toBe(2);
    expect(result.exitCode).toBe(0);
    expect(result.project.name).toBe('test-project');
  });

  it('should calculate summary with different ratings', async () => {
    vi.mocked(npmRegistry.fetchPackageMetadata).mockResolvedValue({
      name: 'test-pkg',
      version: '1.0.0',
      license: 'MIT',
      time: {
        '1.0.0': new Date().toISOString(),
      },
    });

    // Mock different ratings
    vi.mocked(ageAnalyzer.analyzeAge).mockReturnValue({
      package: 'test-pkg',
      version: '1.0.0',
      ageDays: 30,
      ageHuman: '1 month',
      lastPublish: new Date().toISOString(),
      deprecated: false,
      severity: 'ok',
      hasRepository: false,
    });

    vi.mocked(licenseAnalyzer.analyzeLicense).mockReturnValue({
      package: 'test-pkg',
      version: '1.0.0',
      license: 'MIT',
      spdxId: 'MIT',
      category: 'commercial-friendly',
      blueOakRating: 'gold',
      commercialUse: true,
      isDualLicense: false,
      hasPatentClause: false,
      severity: 'ok',
    });

    let callCount = 0;
    vi.mocked(scorer.calculateHealthScore).mockImplementation(() => {
      const ratings = ['excellent', 'good', 'fair', 'poor'] as const;
      const scores = [95, 75, 55, 35];
      const rating = ratings[callCount % 4];
      const score = scores[callCount % 4];
      callCount++;
      return {
        overall: score,
        rating,
        dimensions: {
          age: 1,
          deprecation: 1,
          license: 1,
          vulnerability: 1,
          popularity: 0.9,
          repository: 0.9,
          updateFrequency: 0.9,
        },
      };
    });

    vi.mocked(scorer.getOverallSeverity).mockReturnValue('ok');
    vi.mocked(upgradeAnalyzer.analyzePackageUpgrade).mockResolvedValue(undefined);

    // Scan with 4 packages
    vi.mocked(packageReader.getAllDependencies).mockReturnValue(
      new Map([
        ['pkg1', '^1.0.0'],
        ['pkg2', '^1.0.0'],
        ['pkg3', '^1.0.0'],
        ['pkg4', '^1.0.0'],
      ])
    );

    const result = await scanDependencies(defaultConfig);

    expect(result.summary.excellent).toBeGreaterThan(0);
    expect(result.summary.good).toBeGreaterThan(0);
    expect(result.summary.fair).toBeGreaterThan(0);
    expect(result.summary.poor).toBeGreaterThan(0);
  });

  it('should count severity levels correctly', async () => {
    vi.mocked(npmRegistry.fetchPackageMetadata).mockResolvedValue({
      name: 'test-pkg',
      version: '1.0.0',
      license: 'MIT',
      time: {
        '1.0.0': new Date().toISOString(),
      },
    });

    vi.mocked(ageAnalyzer.analyzeAge).mockReturnValue({
      package: 'test-pkg',
      version: '1.0.0',
      ageDays: 30,
      ageHuman: '1 month',
      lastPublish: new Date().toISOString(),
      deprecated: false,
      severity: 'ok',
      hasRepository: false,
    });

    vi.mocked(licenseAnalyzer.analyzeLicense).mockReturnValue({
      package: 'test-pkg',
      version: '1.0.0',
      license: 'MIT',
      spdxId: 'MIT',
      category: 'commercial-friendly',
      blueOakRating: 'gold',
      commercialUse: true,
      isDualLicense: false,
      hasPatentClause: false,
      severity: 'ok',
    });

    vi.mocked(scorer.calculateHealthScore).mockReturnValue({
      overall: 50,
      rating: 'fair',
      dimensions: {
        age: 0.5,
        deprecation: 0.5,
        license: 0.5,
        vulnerability: 0.5,
        popularity: 0.5,
        repository: 0.5,
        updateFrequency: 0.5,
      },
    });

    let severityCallCount = 0;
    vi.mocked(scorer.getOverallSeverity).mockImplementation(() => {
      const severities = ['critical', 'warning', 'info', 'ok'] as const;
      return severities[severityCallCount++ % 4];
    });

    vi.mocked(upgradeAnalyzer.analyzePackageUpgrade).mockResolvedValue(undefined);

    vi.mocked(packageReader.getAllDependencies).mockReturnValue(
      new Map([
        ['pkg1', '^1.0.0'],
        ['pkg2', '^1.0.0'],
        ['pkg3', '^1.0.0'],
        ['pkg4', '^1.0.0'],
      ])
    );

    const result = await scanDependencies(defaultConfig);

    expect(result.summary.issues.critical).toBeGreaterThan(0);
    expect(result.summary.issues.warning).toBeGreaterThan(0);
    expect(result.summary.issues.info).toBeGreaterThan(0);
  });

  it('should determine risk level correctly - critical', async () => {
    vi.mocked(npmRegistry.fetchPackageMetadata).mockResolvedValue({
      name: 'test-pkg',
      version: '1.0.0',
      license: 'GPL-3.0',
      time: {
        '1.0.0': new Date().toISOString(),
      },
    });

    vi.mocked(ageAnalyzer.analyzeAge).mockReturnValue({
      package: 'test-pkg',
      version: '1.0.0',
      ageDays: 30,
      ageHuman: '1 month',
      lastPublish: new Date().toISOString(),
      deprecated: false,
      severity: 'ok',
      hasRepository: false,
    });

    vi.mocked(licenseAnalyzer.analyzeLicense).mockReturnValue({
      package: 'test-pkg',
      version: '1.0.0',
      license: 'GPL-3.0',
      spdxId: 'GPL-3.0',
      category: 'commercial-incompatible',
      blueOakRating: 'bronze',
      commercialUse: false,
      isDualLicense: false,
      hasPatentClause: false,
      severity: 'critical',
    });

    vi.mocked(scorer.calculateHealthScore).mockReturnValue({
      overall: 20,
      rating: 'poor',
      dimensions: {
        age: 0.2,
        deprecation: 0.2,
        license: 0,
        vulnerability: 0.2,
        popularity: 0.2,
        repository: 0.2,
        updateFrequency: 0.2,
      },
    });

    vi.mocked(scorer.getOverallSeverity).mockReturnValue('critical');
    vi.mocked(upgradeAnalyzer.analyzePackageUpgrade).mockResolvedValue(undefined);

    vi.mocked(packageReader.getAllDependencies).mockReturnValue(
      new Map([['test-pkg', '^1.0.0']])
    );

    const result = await scanDependencies(defaultConfig);

    expect(result.summary.riskLevel).toBe('critical');
    expect(result.summary.issues.critical).toBeGreaterThan(0);
  });

  it('should determine risk level - high', async () => {
    vi.mocked(npmRegistry.fetchPackageMetadata).mockResolvedValue({
      name: 'test-pkg',
      version: '1.0.0',
      license: 'MIT',
      time: {
        '1.0.0': new Date().toISOString(),
      },
    });

    vi.mocked(ageAnalyzer.analyzeAge).mockReturnValue({
      package: 'test-pkg',
      version: '1.0.0',
      ageDays: 30,
      ageHuman: '1 month',
      lastPublish: new Date().toISOString(),
      deprecated: false,
      severity: 'warning',
      hasRepository: false,
    });

    vi.mocked(licenseAnalyzer.analyzeLicense).mockReturnValue({
      package: 'test-pkg',
      version: '1.0.0',
      license: 'MIT',
      spdxId: 'MIT',
      category: 'commercial-friendly',
      blueOakRating: 'gold',
      commercialUse: true,
      isDualLicense: false,
      hasPatentClause: false,
      severity: 'ok',
    });

    vi.mocked(scorer.calculateHealthScore).mockReturnValue({
      overall: 55,
      rating: 'fair',
      dimensions: {
        age: 0.5,
        deprecation: 0.5,
        license: 0.7,
        vulnerability: 0.6,
        popularity: 0.5,
        repository: 0.4,
        updateFrequency: 0.5,
      },
    });

    vi.mocked(scorer.getOverallSeverity).mockReturnValue('warning');
    vi.mocked(upgradeAnalyzer.analyzePackageUpgrade).mockResolvedValue(undefined);

    vi.mocked(packageReader.getAllDependencies).mockReturnValue(
      new Map(Array.from({ length: 7 }, (_, i) => [`pkg${i}`, '^1.0.0']))
    );

    const result = await scanDependencies(defaultConfig);

    expect(result.summary.riskLevel).toBe('high');
  });

  it('should determine risk level - medium', async () => {
    vi.mocked(npmRegistry.fetchPackageMetadata).mockResolvedValue({
      name: 'test-pkg',
      version: '1.0.0',
      license: 'MIT',
      time: {
        '1.0.0': new Date().toISOString(),
      },
    });

    vi.mocked(ageAnalyzer.analyzeAge).mockReturnValue({
      package: 'test-pkg',
      version: '1.0.0',
      ageDays: 30,
      ageHuman: '1 month',
      lastPublish: new Date().toISOString(),
      deprecated: false,
      severity: 'ok',
      hasRepository: false,
    });

    vi.mocked(licenseAnalyzer.analyzeLicense).mockReturnValue({
      package: 'test-pkg',
      version: '1.0.0',
      license: 'MIT',
      spdxId: 'MIT',
      category: 'commercial-friendly',
      blueOakRating: 'gold',
      commercialUse: true,
      isDualLicense: false,
      hasPatentClause: false,
      severity: 'warning',
    });

    vi.mocked(scorer.calculateHealthScore).mockReturnValue({
      overall: 75,
      rating: 'good',
      dimensions: {
        age: 0.8,
        deprecation: 0.8,
        license: 0.8,
        vulnerability: 0.8,
        popularity: 0.7,
        repository: 0.7,
        updateFrequency: 0.7,
      },
    });

    vi.mocked(scorer.getOverallSeverity).mockReturnValue('warning');
    vi.mocked(upgradeAnalyzer.analyzePackageUpgrade).mockResolvedValue(undefined);

    vi.mocked(packageReader.getAllDependencies).mockReturnValue(
      new Map([['test-pkg', '^1.0.0']])
    );

    const result = await scanDependencies(defaultConfig);

    expect(result.summary.riskLevel).toBe('medium');
  });

  it('should determine risk level - low', async () => {
    vi.mocked(npmRegistry.fetchPackageMetadata).mockResolvedValue({
      name: 'test-pkg',
      version: '1.0.0',
      license: 'MIT',
      time: {
        '1.0.0': new Date().toISOString(),
      },
    });

    vi.mocked(ageAnalyzer.analyzeAge).mockReturnValue({
      package: 'test-pkg',
      version: '1.0.0',
      ageDays: 30,
      ageHuman: '1 month',
      lastPublish: new Date().toISOString(),
      deprecated: false,
      severity: 'ok',
      hasRepository: false,
    });

    vi.mocked(licenseAnalyzer.analyzeLicense).mockReturnValue({
      package: 'test-pkg',
      version: '1.0.0',
      license: 'MIT',
      spdxId: 'MIT',
      category: 'commercial-friendly',
      blueOakRating: 'gold',
      commercialUse: true,
      isDualLicense: false,
      hasPatentClause: false,
      severity: 'ok',
    });

    vi.mocked(scorer.calculateHealthScore).mockReturnValue({
      overall: 92,
      rating: 'excellent',
      dimensions: {
        age: 0.95,
        deprecation: 1,
        license: 1,
        vulnerability: 1,
        popularity: 0.9,
        repository: 0.85,
        updateFrequency: 0.9,
      },
    });

    vi.mocked(scorer.getOverallSeverity).mockReturnValue('ok');
    vi.mocked(upgradeAnalyzer.analyzePackageUpgrade).mockResolvedValue(undefined);

    vi.mocked(packageReader.getAllDependencies).mockReturnValue(
      new Map([['test-pkg', '^1.0.0']])
    );

    const result = await scanDependencies(defaultConfig);

    expect(result.summary.riskLevel).toBe('low');
    expect(result.exitCode).toBe(0);
  });

  it('should handle packages with errors', async () => {
    vi.mocked(npmRegistry.fetchPackageMetadata)
      .mockResolvedValueOnce({
        name: 'good-pkg',
        version: '1.0.0',
        license: 'MIT',
        time: {
          '1.0.0': new Date().toISOString(),
        },
      })
      .mockRejectedValueOnce(new Error('Package not found'));

    vi.mocked(ageAnalyzer.analyzeAge).mockReturnValue({
      package: 'good-pkg',
      version: '1.0.0',
      ageDays: 30,
      ageHuman: '1 month',
      lastPublish: new Date().toISOString(),
      deprecated: false,
      severity: 'ok',
      hasRepository: false,
    });

    vi.mocked(licenseAnalyzer.analyzeLicense).mockReturnValue({
      package: 'good-pkg',
      version: '1.0.0',
      license: 'MIT',
      spdxId: 'MIT',
      category: 'commercial-friendly',
      blueOakRating: 'gold',
      commercialUse: true,
      isDualLicense: false,
      hasPatentClause: false,
      severity: 'ok',
    });

    vi.mocked(scorer.calculateHealthScore).mockReturnValue({
      overall: 95,
      rating: 'excellent',
      dimensions: {
        age: 1,
        deprecation: 1,
        license: 1,
        vulnerability: 1,
        popularity: 0.9,
        repository: 0.9,
        updateFrequency: 0.9,
      },
    });

    vi.mocked(scorer.getOverallSeverity).mockReturnValue('ok');
    vi.mocked(upgradeAnalyzer.analyzePackageUpgrade).mockResolvedValue(undefined);

    const result = await scanDependencies(defaultConfig);

    // Should have 1 successful analysis (error package should be filtered out)
    expect(result.packages.length).toBe(1);
    expect(result.summary.total).toBe(1);
  });

  it('should determine exit code based on failOn config - critical', async () => {
    vi.mocked(npmRegistry.fetchPackageMetadata).mockResolvedValue({
      name: 'test-pkg',
      version: '1.0.0',
      license: 'GPL-3.0',
      time: {
        '1.0.0': new Date().toISOString(),
      },
    });

    vi.mocked(ageAnalyzer.analyzeAge).mockReturnValue({
      package: 'test-pkg',
      version: '1.0.0',
      ageDays: 30,
      ageHuman: '1 month',
      lastPublish: new Date().toISOString(),
      deprecated: false,
      severity: 'ok',
      hasRepository: false,
    });

    vi.mocked(licenseAnalyzer.analyzeLicense).mockReturnValue({
      package: 'test-pkg',
      version: '1.0.0',
      license: 'GPL-3.0',
      spdxId: 'GPL-3.0',
      category: 'commercial-incompatible',
      blueOakRating: 'bronze',
      commercialUse: false,
      isDualLicense: false,
      hasPatentClause: false,
      severity: 'critical',
    });

    vi.mocked(scorer.calculateHealthScore).mockReturnValue({
      overall: 20,
      rating: 'poor',
      dimensions: {
        age: 0.2,
        deprecation: 0.2,
        license: 0,
        vulnerability: 0.2,
        popularity: 0.2,
        repository: 0.2,
        updateFrequency: 0.2,
      },
    });

    vi.mocked(scorer.getOverallSeverity).mockReturnValue('critical');
    vi.mocked(upgradeAnalyzer.analyzePackageUpgrade).mockResolvedValue(undefined);

    vi.mocked(packageReader.getAllDependencies).mockReturnValue(
      new Map([['test-pkg', '^1.0.0']])
    );

    const config = { ...defaultConfig, failOn: 'critical' as const };
    const result = await scanDependencies(config);

    expect(result.exitCode).toBe(2);
  });

  it('should determine exit code based on failOn config - warning', async () => {
    vi.mocked(npmRegistry.fetchPackageMetadata).mockResolvedValue({
      name: 'test-pkg',
      version: '1.0.0',
      license: 'MIT',
      time: {
        '1.0.0': new Date().toISOString(),
      },
    });

    vi.mocked(ageAnalyzer.analyzeAge).mockReturnValue({
      package: 'test-pkg',
      version: '1.0.0',
      ageDays: 30,
      ageHuman: '1 month',
      lastPublish: new Date().toISOString(),
      deprecated: false,
      severity: 'warning',
      hasRepository: false,
    });

    vi.mocked(licenseAnalyzer.analyzeLicense).mockReturnValue({
      package: 'test-pkg',
      version: '1.0.0',
      license: 'MIT',
      spdxId: 'MIT',
      category: 'commercial-friendly',
      blueOakRating: 'gold',
      commercialUse: true,
      isDualLicense: false,
      hasPatentClause: false,
      severity: 'ok',
    });

    vi.mocked(scorer.calculateHealthScore).mockReturnValue({
      overall: 65,
      rating: 'fair',
      dimensions: {
        age: 0.6,
        deprecation: 0.6,
        license: 0.8,
        vulnerability: 0.7,
        popularity: 0.6,
        repository: 0.5,
        updateFrequency: 0.6,
      },
    });

    vi.mocked(scorer.getOverallSeverity).mockReturnValue('warning');
    vi.mocked(upgradeAnalyzer.analyzePackageUpgrade).mockResolvedValue(undefined);

    vi.mocked(packageReader.getAllDependencies).mockReturnValue(
      new Map([['test-pkg', '^1.0.0']])
    );

    const config = { ...defaultConfig, failOn: 'warning' as const };
    const result = await scanDependencies(config);

    expect(result.exitCode).toBe(1);
  });

  it('should analyze with GitHub integration enabled', async () => {
    vi.mocked(npmRegistry.fetchPackageMetadata).mockResolvedValue({
      name: 'test-pkg',
      version: '1.0.0',
      license: 'MIT',
      time: {
        '1.0.0': new Date().toISOString(),
      },
      repository: {
        type: 'git',
        url: 'https://github.com/user/repo',
      },
    });

    vi.mocked(ageAnalyzer.analyzeAge).mockReturnValue({
      package: 'test-pkg',
      version: '1.0.0',
      ageDays: 30,
      ageHuman: '1 month',
      lastPublish: new Date().toISOString(),
      deprecated: false,
      severity: 'ok',
      hasRepository: true,
      repositoryUrl: 'https://github.com/user/repo',
    });

    vi.mocked(licenseAnalyzer.analyzeLicense).mockReturnValue({
      package: 'test-pkg',
      version: '1.0.0',
      license: 'MIT',
      spdxId: 'MIT',
      category: 'commercial-friendly',
      blueOakRating: 'gold',
      commercialUse: true,
      isDualLicense: false,
      hasPatentClause: false,
      severity: 'ok',
    });

    vi.mocked(scorer.calculateHealthScore).mockReturnValue({
      overall: 95,
      rating: 'excellent',
      dimensions: {
        age: 1,
        deprecation: 1,
        license: 1,
        vulnerability: 1,
        popularity: 0.9,
        repository: 0.9,
        updateFrequency: 0.9,
      },
    });

    vi.mocked(scorer.getOverallSeverity).mockReturnValue('ok');
    vi.mocked(upgradeAnalyzer.analyzePackageUpgrade).mockResolvedValue(undefined);

    vi.mocked(githubApi.analyzeGitHubRepository).mockResolvedValue({
      package: 'test-pkg',
      version: '1.0.0',
      url: 'https://github.com/user/repo',
      stars: 1000,
      forks: 100,
      openIssues: 10,
      isArchived: false,
      severity: 'ok',
    });

    vi.mocked(packageReader.getAllDependencies).mockReturnValue(
      new Map([['test-pkg', '^1.0.0']])
    );

    const config = {
      ...defaultConfig,
      github: {
        enabled: true,
        token: 'test-token',
      },
    };

    const result = await scanDependencies(config);

    expect(result.packages[0].repository).toBeDefined();
    expect(githubApi.analyzeGitHubRepository).toHaveBeenCalled();
  });

  it('should return exit code 0 when failOn is none', async () => {
    vi.mocked(npmRegistry.fetchPackageMetadata).mockResolvedValue({
      name: 'test-pkg',
      version: '1.0.0',
      license: 'GPL-3.0',
      time: {
        '1.0.0': new Date().toISOString(),
      },
    });

    vi.mocked(ageAnalyzer.analyzeAge).mockReturnValue({
      package: 'test-pkg',
      version: '1.0.0',
      ageDays: 30,
      ageHuman: '1 month',
      lastPublish: new Date().toISOString(),
      deprecated: false,
      severity: 'critical',
      hasRepository: false,
    });

    vi.mocked(licenseAnalyzer.analyzeLicense).mockReturnValue({
      package: 'test-pkg',
      version: '1.0.0',
      license: 'GPL-3.0',
      spdxId: 'GPL-3.0',
      category: 'commercial-incompatible',
      blueOakRating: 'bronze',
      commercialUse: false,
      isDualLicense: false,
      hasPatentClause: false,
      severity: 'critical',
    });

    vi.mocked(scorer.calculateHealthScore).mockReturnValue({
      overall: 20,
      rating: 'poor',
      dimensions: {
        age: 0.2,
        deprecation: 0.2,
        license: 0,
        vulnerability: 0.2,
        popularity: 0.2,
        repository: 0.2,
        updateFrequency: 0.2,
      },
    });

    vi.mocked(scorer.getOverallSeverity).mockReturnValue('critical');
    vi.mocked(upgradeAnalyzer.analyzePackageUpgrade).mockResolvedValue(undefined);

    vi.mocked(packageReader.getAllDependencies).mockReturnValue(
      new Map([['test-pkg', '^1.0.0']])
    );

    const config = { ...defaultConfig, failOn: 'none' as const };
    const result = await scanDependencies(config);

    // Even with critical issues, failOn: 'none' should return 0
    expect(result.exitCode).toBe(0);
  });

  it('should return exit code 1 when failOn is info and has info severity', async () => {
    vi.mocked(npmRegistry.fetchPackageMetadata).mockResolvedValue({
      name: 'test-pkg',
      version: '1.0.0',
      license: 'MIT',
      time: {
        '1.0.0': new Date().toISOString(),
      },
    });

    vi.mocked(ageAnalyzer.analyzeAge).mockReturnValue({
      package: 'test-pkg',
      version: '1.0.0',
      ageDays: 30,
      ageHuman: '1 month',
      lastPublish: new Date().toISOString(),
      deprecated: false,
      severity: 'info',
      hasRepository: true,
    });

    vi.mocked(licenseAnalyzer.analyzeLicense).mockReturnValue({
      package: 'test-pkg',
      version: '1.0.0',
      license: 'MIT',
      spdxId: 'MIT',
      category: 'commercial-friendly',
      blueOakRating: 'gold',
      commercialUse: true,
      isDualLicense: false,
      hasPatentClause: false,
      severity: 'ok',
    });

    vi.mocked(scorer.calculateHealthScore).mockReturnValue({
      overall: 85,
      rating: 'good',
      dimensions: {
        age: 0.8,
        deprecation: 0.9,
        license: 0.9,
        vulnerability: 0.9,
        popularity: 0.8,
        repository: 0.8,
        updateFrequency: 0.8,
      },
    });

    vi.mocked(scorer.getOverallSeverity).mockReturnValue('info');
    vi.mocked(upgradeAnalyzer.analyzePackageUpgrade).mockResolvedValue(undefined);

    vi.mocked(packageReader.getAllDependencies).mockReturnValue(
      new Map([['test-pkg', '^1.0.0']])
    );

    const config = { ...defaultConfig, failOn: 'info' as const };
    const result = await scanDependencies(config);

    expect(result.exitCode).toBe(1);
  });

  it('should generate recommendations for deprecated packages', async () => {
    vi.mocked(npmRegistry.fetchPackageMetadata).mockResolvedValue({
      name: 'deprecated-pkg',
      version: '1.0.0',
      license: 'MIT',
      deprecated: 'Use new-pkg instead',
      time: {
        '1.0.0': new Date().toISOString(),
      },
    });

    vi.mocked(ageAnalyzer.analyzeAge).mockReturnValue({
      package: 'deprecated-pkg',
      version: '1.0.0',
      ageDays: 100,
      ageHuman: '3 months',
      lastPublish: new Date().toISOString(),
      deprecated: true,
      deprecationMessage: 'Use new-pkg instead',
      severity: 'critical',
      hasRepository: true,
    });

    vi.mocked(licenseAnalyzer.analyzeLicense).mockReturnValue({
      package: 'deprecated-pkg',
      version: '1.0.0',
      license: 'MIT',
      spdxId: 'MIT',
      category: 'commercial-friendly',
      blueOakRating: 'gold',
      commercialUse: true,
      isDualLicense: false,
      hasPatentClause: false,
      severity: 'ok',
    });

    vi.mocked(scorer.calculateHealthScore).mockReturnValue({
      overall: 40,
      rating: 'poor',
      dimensions: {
        age: 0.4,
        deprecation: 0,
        license: 1.0,
        vulnerability: 0.5,
        popularity: 0.4,
        repository: 0.5,
        updateFrequency: 0.3,
      },
    });

    vi.mocked(scorer.getOverallSeverity).mockReturnValue('critical');
    vi.mocked(upgradeAnalyzer.analyzePackageUpgrade).mockResolvedValue(undefined);

    vi.mocked(packageReader.getAllDependencies).mockReturnValue(
      new Map([['deprecated-pkg', '^1.0.0']])
    );

    const result = await scanDependencies(defaultConfig);

    expect(result.recommendations).toBeDefined();
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.recommendations[0].reason).toContain('deprecated');
    expect(result.recommendations[0].priority).toBe('high');
  });

  it('should generate recommendations for unlicensed packages', async () => {
    vi.mocked(npmRegistry.fetchPackageMetadata).mockResolvedValue({
      name: 'unlicensed-pkg',
      version: '1.0.0',
      time: {
        '1.0.0': new Date().toISOString(),
      },
    });

    vi.mocked(ageAnalyzer.analyzeAge).mockReturnValue({
      package: 'unlicensed-pkg',
      version: '1.0.0',
      ageDays: 30,
      ageHuman: '1 month',
      lastPublish: new Date().toISOString(),
      deprecated: false,
      severity: 'ok',
      hasRepository: true,
    });

    vi.mocked(licenseAnalyzer.analyzeLicense).mockReturnValue({
      package: 'unlicensed-pkg',
      version: '1.0.0',
      license: 'UNLICENSED',
      category: 'unlicensed',
      blueOakRating: 'unrated',
      commercialUse: false,
      isDualLicense: false,
      hasPatentClause: false,
      severity: 'critical',
    });

    vi.mocked(scorer.calculateHealthScore).mockReturnValue({
      overall: 50,
      rating: 'poor',
      dimensions: {
        age: 0.8,
        deprecation: 1.0,
        license: 0,
        vulnerability: 0.8,
        popularity: 0.6,
        repository: 0.8,
        updateFrequency: 0.7,
      },
    });

    vi.mocked(scorer.getOverallSeverity).mockReturnValue('critical');
    vi.mocked(upgradeAnalyzer.analyzePackageUpgrade).mockResolvedValue(undefined);

    vi.mocked(packageReader.getAllDependencies).mockReturnValue(
      new Map([['unlicensed-pkg', '^1.0.0']])
    );

    const result = await scanDependencies(defaultConfig);

    expect(result.recommendations).toBeDefined();
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.recommendations[0].reason).toContain('no license');
    expect(result.recommendations[0].priority).toBe('high');
  });
});
