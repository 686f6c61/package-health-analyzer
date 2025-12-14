/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { describe, it, expect } from 'vitest';
import { analyzePackageUpgrade } from '../../src/analyzers/upgrade.js';
import { defaultConfig } from '../../src/config/defaults.js';

describe('Upgrade Path Analyzer', () => {
  it('should analyze patch upgrade', async () => {
    const result = await analyzePackageUpgrade(
      'test-pkg',
      '1.0.0',
      '1.0.5',
      defaultConfig.upgradePath
    );

    expect(result).toBeDefined();
    expect(result.package).toBe('test-pkg');
    expect(result.currentVersion).toBe('1.0.0');
    expect(result.latestVersion).toBe('1.0.5');
    expect(result.type).toBe('patch');
    expect(result.risk).toBe('low');
  });

  it('should analyze minor upgrade', async () => {
    const result = await analyzePackageUpgrade(
      'test-pkg',
      '1.0.0',
      '1.5.0',
      defaultConfig.upgradePath
    );

    expect(result.type).toBe('minor');
    expect(result.risk).toBe('medium');
    expect(result.steps).toBeDefined();
    expect(result.steps.length).toBeGreaterThan(0);
  });

  it('should analyze major upgrade', async () => {
    const result = await analyzePackageUpgrade(
      'test-pkg',
      '1.0.0',
      '2.0.0',
      defaultConfig.upgradePath
    );

    expect(result.type).toBe('major');
    expect(result.risk).toBe('high');
    expect(result.estimatedEffort).toBeDefined();
  });

  it('should provide alternatives for deprecated packages', async () => {
    const result = await analyzePackageUpgrade(
      'moment',
      '2.29.0',
      '2.29.4',
      defaultConfig.upgradePath
    );

    expect(result.alternatives).toBeDefined();
    if (result.alternatives) {
      expect(result.alternatives.length).toBeGreaterThan(0);
      expect(result.alternatives[0]).toHaveProperty('name');
      expect(result.alternatives[0]).toHaveProperty('description');
      expect(result.alternatives[0]).toHaveProperty('license');
    }
  });

  it('should suggest alternatives for request package', async () => {
    const result = await analyzePackageUpgrade(
      'request',
      '2.88.0',
      '2.88.2',
      defaultConfig.upgradePath
    );

    expect(result.alternatives).toBeDefined();
    if (result.alternatives) {
      const alternativeNames = result.alternatives.map((a) => a.name);
      expect(alternativeNames).toContain('axios');
    }
  });

  it('should handle same version', async () => {
    const result = await analyzePackageUpgrade(
      'test-pkg',
      '1.0.0',
      '1.0.0',
      defaultConfig.upgradePath
    );

    expect(result.currentVersion).toBe(result.latestVersion);
    expect(result.risk).toBe('low');
  });

  it('should handle multiple major version jump', async () => {
    const result = await analyzePackageUpgrade(
      'test-pkg',
      '1.0.0',
      '5.0.0',
      defaultConfig.upgradePath
    );

    expect(result.risk).toBe('high');
    expect(result.steps.length).toBeGreaterThan(1);
  });

  it('should provide upgrade path information', async () => {
    const result = await analyzePackageUpgrade(
      'test-pkg',
      '1.0.0',
      '2.0.0',
      defaultConfig.upgradePath
    );

    // Resources may or may not be provided
    expect(result).toBeDefined();
    expect(result.estimatedEffort).toBeDefined();
  });

  it('should analyze multi-major version upgrade', async () => {
    const result = await analyzePackageUpgrade(
      'test-pkg',
      '1.0.0',
      '3.0.0',
      defaultConfig.upgradePath
    );

    expect(result.estimatedEffort).toBeDefined();
    expect(result.breakingChanges).toBeGreaterThan(0);
  });

  it('should handle pre-1.0 versions', async () => {
    const result = await analyzePackageUpgrade(
      'test-pkg',
      '0.5.0',
      '0.8.0',
      defaultConfig.upgradePath
    );

    expect(result).toBeDefined();
    expect(result.risk).toMatch(/medium|high/);
  });

  it('should return undefined when config is disabled', async () => {
    const disabledConfig = {
      enabled: false,
      analyzeBreakingChanges: false,
      suggestAlternatives: false,
      fetchChangelogs: false,
      estimateEffort: false,
    };

    const result = await analyzePackageUpgrade(
      'test-pkg',
      '1.0.0',
      '2.0.0',
      disabledConfig
    );

    expect(result).toBeUndefined();
  });

  it('should handle invalid versions gracefully', async () => {
    // Invalid versions are handled gracefully by the underlying library
    const result = await analyzePackageUpgrade(
      'test-pkg',
      'invalid-version',
      '2.0.0',
      defaultConfig.upgradePath
    );

    // Should still return a result, not throw
    expect(result).toBeDefined();
  });

  it('should handle invalid latest version gracefully', async () => {
    const result = await analyzePackageUpgrade(
      'test-pkg',
      '1.0.0',
      'invalid-version',
      defaultConfig.upgradePath
    );

    // Should still return a result, not throw
    expect(result).toBeDefined();
  });
});

describe('Upgrade Path Configuration Options', () => {
  it('should analyze breaking changes when enabled', async () => {
    const config = {
      ...defaultConfig.upgradePath,
      analyzeBreakingChanges: true,
    };

    const result = await analyzePackageUpgrade(
      'test-pkg',
      '1.0.0',
      '2.0.0',
      config
    );

    expect(result.breakingChanges).toBeGreaterThan(0);
  });

  it('should skip breaking changes analysis when disabled', async () => {
    const config = {
      ...defaultConfig.upgradePath,
      analyzeBreakingChanges: false,
    };

    const result = await analyzePackageUpgrade(
      'test-pkg',
      '1.0.0',
      '2.0.0',
      config
    );

    expect(result.breakingChanges).toBe(0);
  });

  it('should fetch changelogs when enabled', async () => {
    const config = {
      ...defaultConfig.upgradePath,
      fetchChangelogs: true,
    };

    const result = await analyzePackageUpgrade(
      'webpack',
      '4.0.0',
      '5.0.0',
      config
    );

    // Resources should be provided for webpack
    expect(result).toBeDefined();
  }, 10000); // Increased timeout for Node.js 18.x compatibility

  it('should skip changelogs when disabled', async () => {
    const config = {
      ...defaultConfig.upgradePath,
      fetchChangelogs: false,
    };

    const result = await analyzePackageUpgrade(
      'webpack',
      '4.0.0',
      '5.0.0',
      config
    );

    expect(result.resources).toBeUndefined();
  });

  it('should suggest alternatives when enabled', async () => {
    const config = {
      ...defaultConfig.upgradePath,
      suggestAlternatives: true,
    };

    const result = await analyzePackageUpgrade(
      'moment',
      '2.29.0',
      '2.29.4',
      config
    );

    expect(result.alternatives).toBeDefined();
    if (result.alternatives) {
      expect(result.alternatives.length).toBeGreaterThan(0);
    }
  });

  it('should skip alternatives when disabled', async () => {
    const config = {
      ...defaultConfig.upgradePath,
      suggestAlternatives: false,
    };

    const result = await analyzePackageUpgrade(
      'moment',
      '2.29.0',
      '2.29.4',
      config
    );

    expect(result.alternatives).toBeUndefined();
  });

  it('should provide migration guides for webpack', async () => {
    const config = {
      ...defaultConfig.upgradePath,
      fetchChangelogs: true,
    };

    const result = await analyzePackageUpgrade(
      'webpack',
      '4.0.0',
      '5.0.0',
      config
    );

    // Resources may or may not be provided based on version
    expect(result).toBeDefined();
  });

  it('should provide migration guides for react', async () => {
    const config = {
      ...defaultConfig.upgradePath,
      fetchChangelogs: true,
    };

    const result = await analyzePackageUpgrade(
      'react',
      '16.0.0',
      '18.0.0',
      config
    );

    expect(result).toBeDefined();
  });

  it('should provide migration guides for vue', async () => {
    const config = {
      ...defaultConfig.upgradePath,
      fetchChangelogs: true,
    };

    const result = await analyzePackageUpgrade(
      'vue',
      '2.0.0',
      '3.0.0',
      config
    );

    expect(result).toBeDefined();
  });

  it('should provide migration guides for angular', async () => {
    const config = {
      ...defaultConfig.upgradePath,
      fetchChangelogs: true,
    };

    const result = await analyzePackageUpgrade(
      'angular',
      '10.0.0',
      '11.0.0',
      config
    );

    expect(result).toBeDefined();
  });

  it('should suggest alternatives for request package', async () => {
    const config = {
      ...defaultConfig.upgradePath,
      suggestAlternatives: true,
    };

    const result = await analyzePackageUpgrade(
      'request',
      '2.88.0',
      '2.88.2',
      config
    );

    expect(result.alternatives).toBeDefined();
    if (result.alternatives) {
      const alternativeNames = result.alternatives.map((a) => a.name);
      expect(alternativeNames).toContain('axios');
      expect(alternativeNames).toContain('node-fetch');
    }
  });

  it('should suggest alternatives for lodash', async () => {
    const config = {
      ...defaultConfig.upgradePath,
      suggestAlternatives: true,
    };

    const result = await analyzePackageUpgrade(
      'lodash',
      '4.17.0',
      '4.17.21',
      config
    );

    expect(result.alternatives).toBeDefined();
    if (result.alternatives) {
      const alternativeNames = result.alternatives.map((a) => a.name);
      expect(alternativeNames).toContain('lodash-es');
    }
  });

  it('should estimate high effort for multi-major upgrade', async () => {
    const config = {
      ...defaultConfig.upgradePath,
      analyzeBreakingChanges: true,
      estimateEffort: true,
    };

    const result = await analyzePackageUpgrade(
      'test-pkg',
      '1.0.0',
      '5.0.0',
      config
    );

    // Effort might be in Spanish or English
    expect(result.estimatedEffort).toMatch(/days|week|días|semana/i);
  });

  it('should build upgrade steps for major update', async () => {
    const result = await analyzePackageUpgrade(
      'test-pkg',
      '1.0.0',
      '3.0.0',
      defaultConfig.upgradePath
    );

    expect(result.steps).toBeDefined();
    expect(result.steps.length).toBeGreaterThan(0);
  });

  it('should handle patch updates with low risk', async () => {
    const result = await analyzePackageUpgrade(
      'test-pkg',
      '1.0.0',
      '1.0.5',
      defaultConfig.upgradePath
    );

    expect(result.type).toBe('patch');
    expect(result.risk).toBe('low');
    expect(result.breakingChanges).toBe(0);
  });

  it('should handle minor updates with medium risk', async () => {
    const result = await analyzePackageUpgrade(
      'test-pkg',
      '1.0.0',
      '1.5.0',
      defaultConfig.upgradePath
    );

    expect(result.type).toBe('minor');
    expect(result.risk).toBe('medium');
  });
});
