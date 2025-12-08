/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analyzePackageUpgrade } from '../../src/analyzers/upgrade.js';
import { analyzeUpgradePath } from '../../src/utils/upgrade-path.js';
import { defaultConfig } from '../../src/config/defaults.js';

vi.mock('../../src/utils/upgrade-path.js', () => ({
  analyzeUpgradePath: vi.fn(),
}));

describe('Upgrade Analyzer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return undefined when config is disabled', async () => {
    const disabledConfig = {
      ...defaultConfig.upgradePath,
      enabled: false,
    };

    const result = await analyzePackageUpgrade(
      'test-pkg',
      '1.0.0',
      '2.0.0',
      disabledConfig
    );

    expect(result).toBeUndefined();
    expect(vi.mocked(analyzeUpgradePath)).not.toHaveBeenCalled();
  });

  it('should analyze upgrade path when enabled', async () => {
    const mockUpgradePath = {
      package: 'test-pkg',
      currentVersion: '1.0.0',
      latestVersion: '2.0.0',
      type: 'major' as const,
      risk: 'high' as const,
      steps: ['Upgrade to 2.0.0'],
      breakingChanges: 5,
      estimatedEffort: '1-2 days',
    };

    vi.mocked(analyzeUpgradePath).mockResolvedValue(mockUpgradePath);

    const result = await analyzePackageUpgrade(
      'test-pkg',
      '1.0.0',
      '2.0.0',
      defaultConfig.upgradePath
    );

    expect(result).toEqual(mockUpgradePath);
    expect(vi.mocked(analyzeUpgradePath)).toHaveBeenCalledWith(
      'test-pkg',
      '1.0.0',
      '2.0.0',
      defaultConfig.upgradePath
    );
  });

  it('should handle errors gracefully and return undefined', async () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    vi.mocked(analyzeUpgradePath).mockRejectedValue(
      new Error('Failed to analyze upgrade path')
    );

    const result = await analyzePackageUpgrade(
      'test-pkg',
      '1.0.0',
      '2.0.0',
      defaultConfig.upgradePath
    );

    expect(result).toBeUndefined();
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Warning: Could not analyze upgrade path for test-pkg:',
      'Failed to analyze upgrade path'
    );

    consoleWarnSpy.mockRestore();
  });

  it('should handle non-Error exceptions', async () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    vi.mocked(analyzeUpgradePath).mockRejectedValue('string error');

    const result = await analyzePackageUpgrade(
      'test-pkg',
      '1.0.0',
      '2.0.0',
      defaultConfig.upgradePath
    );

    expect(result).toBeUndefined();
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Warning: Could not analyze upgrade path for test-pkg:',
      'string error'
    );

    consoleWarnSpy.mockRestore();
  });
});
