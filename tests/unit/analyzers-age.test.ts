/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { describe, it, expect } from 'vitest';
import { analyzeAge } from '../../src/analyzers/age.js';
import type { PackageMetadata } from '../../src/types/index.js';
import { defaultConfig } from '../../src/config/defaults.js';

describe('Age Analyzer', () => {
  it('should analyze recent package', () => {
    const metadata: PackageMetadata = {
      name: 'recent-pkg',
      version: '1.0.0',
      time: {
        '1.0.0': new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    };

    const result = analyzeAge(metadata, defaultConfig.age);

    expect(result.package).toBe('recent-pkg');
    expect(result.version).toBe('1.0.0');
    expect(result.deprecated).toBe(false);
    expect(result.severity).toBe('ok');
  });

  it('should detect deprecated packages with string message', () => {
    const metadata: PackageMetadata = {
      name: 'old-pkg',
      version: '1.0.0',
      deprecated: 'Use new-pkg instead',
      time: {
        '1.0.0': new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
      },
    };

    const result = analyzeAge(metadata, defaultConfig.age);

    expect(result.deprecated).toBe(true);
    expect(result.deprecationMessage).toBe('Use new-pkg instead');
    expect(result.severity).toBe('critical');
  });

  it('should detect deprecated packages with boolean', () => {
    const metadata: PackageMetadata = {
      name: 'deprecated-pkg',
      version: '2.0.0',
      deprecated: true,
      time: {
        '2.0.0': new Date().toISOString(),
      },
    };

    const result = analyzeAge(metadata, defaultConfig.age);

    expect(result.deprecated).toBe(true);
    expect(result.severity).toBe('critical');
  });

  it('should use modified time if available', () => {
    const modifiedDate = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();
    const metadata: PackageMetadata = {
      name: 'pkg',
      version: '1.0.0',
      time: {
        modified: modifiedDate,
        '1.0.0': new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
      },
    };

    const result = analyzeAge(metadata, defaultConfig.age);

    expect(result.lastPublish).toBe(modifiedDate);
  });

  it('should extract GitHub repository URL', () => {
    const metadata: PackageMetadata = {
      name: 'github-pkg',
      version: '1.0.0',
      repository: {
        type: 'git',
        url: 'git+https://github.com/user/repo.git',
      },
      time: {
        '1.0.0': new Date().toISOString(),
      },
    };

    const result = analyzeAge(metadata, defaultConfig.age);

    expect(result.hasRepository).toBe(true);
    expect(result.repositoryUrl).toContain('github.com/user/repo');
  });

  it('should handle repository without .git suffix', () => {
    const metadata: PackageMetadata = {
      name: 'pkg',
      version: '1.0.0',
      repository: {
        url: 'https://github.com/user/repo',
      },
      time: {
        '1.0.0': new Date().toISOString(),
      },
    };

    const result = analyzeAge(metadata, defaultConfig.age);

    expect(result.hasRepository).toBe(true);
    expect(result.repositoryUrl).toContain('github.com/user/repo');
  });

  it('should handle packages without repository', () => {
    const metadata: PackageMetadata = {
      name: 'no-repo-pkg',
      version: '1.0.0',
      time: {
        '1.0.0': new Date().toISOString(),
      },
    };

    const result = analyzeAge(metadata, defaultConfig.age);

    expect(result.hasRepository).toBe(false);
    expect(result.repositoryUrl).toBeUndefined();
  });

  it('should handle packages with string repository', () => {
    const metadata: PackageMetadata = {
      name: 'pkg',
      version: '1.0.0',
      repository: 'github:user/repo' as any,
      time: {
        '1.0.0': new Date().toISOString(),
      },
    };

    const result = analyzeAge(metadata, defaultConfig.age);

    // String repositories are converted to URLs
    expect(result.hasRepository).toBe(true);
  });

  it('should determine warning severity for old packages', () => {
    const metadata: PackageMetadata = {
      name: 'old-pkg',
      version: '1.0.0',
      time: {
        '1.0.0': new Date(Date.now() - 800 * 24 * 60 * 60 * 1000).toISOString(), // ~2.2 years
      },
    };

    const result = analyzeAge(metadata, defaultConfig.age);

    expect(result.severity).toBe('warning');
  });

  it('should determine critical severity for very old packages', () => {
    const metadata: PackageMetadata = {
      name: 'ancient-pkg',
      version: '1.0.0',
      time: {
        '1.0.0': new Date(Date.now() - 2000 * 24 * 60 * 60 * 1000).toISOString(), // ~5.5 years
      },
    };

    const result = analyzeAge(metadata, defaultConfig.age);

    expect(result.severity).toBe('critical');
  });

  it('should format age as human-readable', () => {
    const metadata: PackageMetadata = {
      name: 'pkg',
      version: '1.0.0',
      time: {
        '1.0.0': new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(),
      },
    };

    const result = analyzeAge(metadata, defaultConfig.age);

    expect(result.ageHuman).toBeDefined();
    expect(result.ageHuman).toContain('year');
  });
});

describe('analyzeAge edge cases', () => {
  it('should handle missing time data', () => {
    const metadata: PackageMetadata = {
      name: 'no-time-pkg',
      version: '1.0.0',
      license: 'MIT',
      // No time field at all
    };

    const result = analyzeAge(metadata, defaultConfig.age);

    expect(result.lastPublish).toBe('unknown');
    expect(result.ageDays).toBe(0);
    expect(result.ageHuman).toBe('unknown');
    expect(result.severity).toBe('warning');
    expect(result.hasRepository).toBe(false);
  });

  it('should handle empty time object', () => {
    const metadata: PackageMetadata = {
      name: 'empty-time-pkg',
      version: '1.0.0',
      license: 'MIT',
      time: {},
    };

    const result = analyzeAge(metadata, defaultConfig.age);

    expect(result.lastPublish).toBe('unknown');
    expect(result.severity).toBe('warning');
  });

  it('should use time.modified if available', () => {
    const metadata: PackageMetadata = {
      name: 'modified-time-pkg',
      version: '1.0.0',
      license: 'MIT',
      time: {
        modified: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        '1.0.0': new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
        created: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
      },
    };

    const result = analyzeAge(metadata, defaultConfig.age);

    // Should use modified time (15 days ago)
    expect(result.ageDays).toBeGreaterThanOrEqual(14);
    expect(result.ageDays).toBeLessThanOrEqual(16);
  });

  it('should fall back to time.created if no modified or version time', () => {
    const metadata: PackageMetadata = {
      name: 'created-time-pkg',
      version: '1.0.0',
      license: 'MIT',
      time: {
        created: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
      },
    };

    const result = analyzeAge(metadata, defaultConfig.age);

    expect(result.ageDays).toBeGreaterThanOrEqual(49);
    expect(result.ageDays).toBeLessThanOrEqual(51);
  });
});
