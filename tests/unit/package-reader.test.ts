/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  readPackageJson,
  getAllDependencies,
  parseVersionFromRange,
} from '../../src/services/package-reader.js';
import { readFile } from 'node:fs/promises';

// Mock the fs/promises module
vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(),
}));

describe('Package Reader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('readPackageJson', () => {
    it('should read and parse package.json', async () => {
      const mockPackageJson = {
        name: 'test-package',
        version: '1.0.0',
        dependencies: {
          'dep-1': '^1.0.0',
          'dep-2': '~2.0.0',
        },
      };

      vi.mocked(readFile).mockResolvedValue(JSON.stringify(mockPackageJson));

      const result = await readPackageJson();

      expect(result.name).toBe('test-package');
      expect(result.version).toBe('1.0.0');
      expect(result.dependencies).toBeDefined();
    });

    it('should handle package.json without dependencies', async () => {
      const mockPackageJson = {
        name: 'empty-package',
        version: '1.0.0',
      };

      vi.mocked(readFile).mockResolvedValue(JSON.stringify(mockPackageJson));

      const result = await readPackageJson();

      expect(result.name).toBe('empty-package');
      expect(result.dependencies).toBeUndefined();
    });

    it('should throw error for invalid JSON', async () => {
      vi.mocked(readFile).mockResolvedValue('invalid json {');

      await expect(readPackageJson()).rejects.toThrow();
    });

    it('should throw error when file not found', async () => {
      vi.mocked(readFile).mockRejectedValue(new Error('ENOENT: no such file'));

      await expect(readPackageJson()).rejects.toThrow();
    });
  });

  describe('getAllDependencies', () => {
    it('should get only production dependencies', () => {
      const pkg = {
        name: 'test',
        version: '1.0.0',
        dependencies: {
          'dep-1': '^1.0.0',
          'dep-2': '~2.0.0',
        },
        devDependencies: {
          'dev-dep-1': '^1.0.0',
        },
      };

      const result = getAllDependencies(pkg, false);

      expect(result.size).toBe(2);
      expect(result.has('dep-1')).toBe(true);
      expect(result.has('dep-2')).toBe(true);
      expect(result.has('dev-dep-1')).toBe(false);
    });

    it('should include devDependencies when requested', () => {
      const pkg = {
        name: 'test',
        version: '1.0.0',
        dependencies: {
          'dep-1': '^1.0.0',
        },
        devDependencies: {
          'dev-dep-1': '^1.0.0',
          'dev-dep-2': '^2.0.0',
        },
      };

      const result = getAllDependencies(pkg, true);

      expect(result.size).toBe(3);
      expect(result.has('dep-1')).toBe(true);
      expect(result.has('dev-dep-1')).toBe(true);
      expect(result.has('dev-dep-2')).toBe(true);
    });

    it('should handle package without dependencies', () => {
      const pkg = {
        name: 'test',
        version: '1.0.0',
      };

      const result = getAllDependencies(pkg, false);

      expect(result.size).toBe(0);
    });

    it('should handle empty dependencies object', () => {
      const pkg = {
        name: 'test',
        version: '1.0.0',
        dependencies: {},
        devDependencies: {},
      };

      const result = getAllDependencies(pkg, true);

      expect(result.size).toBe(0);
    });

    it('should include peerDependencies', () => {
      const pkg = {
        name: 'test',
        version: '1.0.0',
        dependencies: {
          'dep-1': '^1.0.0',
        },
        peerDependencies: {
          'peer-dep-1': '^3.0.0',
          'peer-dep-2': '>=2.0.0',
        },
      };

      const result = getAllDependencies(pkg, false);

      expect(result.size).toBe(3);
      expect(result.has('dep-1')).toBe(true);
      expect(result.has('peer-dep-1')).toBe(true);
      expect(result.has('peer-dep-2')).toBe(true);
    });

    it('should include optionalDependencies', () => {
      const pkg = {
        name: 'test',
        version: '1.0.0',
        dependencies: {
          'dep-1': '^1.0.0',
        },
        optionalDependencies: {
          'opt-dep-1': '^4.0.0',
          'opt-dep-2': '~5.0.0',
        },
      };

      const result = getAllDependencies(pkg, false);

      expect(result.size).toBe(3);
      expect(result.has('dep-1')).toBe(true);
      expect(result.has('opt-dep-1')).toBe(true);
      expect(result.has('opt-dep-2')).toBe(true);
    });

    it('should not override dependencies with peerDependencies', () => {
      const pkg = {
        name: 'test',
        version: '1.0.0',
        dependencies: {
          'shared': '^1.0.0',
        },
        peerDependencies: {
          'shared': '^2.0.0', // Should not override
        },
      };

      const result = getAllDependencies(pkg, false);

      expect(result.size).toBe(1);
      expect(result.get('shared')).toBe('^1.0.0'); // Should keep original version
    });

    it('should not override dependencies with optionalDependencies', () => {
      const pkg = {
        name: 'test',
        version: '1.0.0',
        dependencies: {
          'shared': '^1.0.0',
        },
        optionalDependencies: {
          'shared': '^2.0.0', // Should not override
        },
      };

      const result = getAllDependencies(pkg, false);

      expect(result.size).toBe(1);
      expect(result.get('shared')).toBe('^1.0.0'); // Should keep original version
    });

    it('should handle all dependency types together', () => {
      const pkg = {
        name: 'test',
        version: '1.0.0',
        dependencies: {
          'dep-1': '^1.0.0',
        },
        devDependencies: {
          'dev-dep-1': '^2.0.0',
        },
        peerDependencies: {
          'peer-dep-1': '^3.0.0',
        },
        optionalDependencies: {
          'opt-dep-1': '^4.0.0',
        },
      };

      const result = getAllDependencies(pkg, true);

      expect(result.size).toBe(4);
      expect(result.has('dep-1')).toBe(true);
      expect(result.has('dev-dep-1')).toBe(true);
      expect(result.has('peer-dep-1')).toBe(true);
      expect(result.has('opt-dep-1')).toBe(true);
    });
  });

  describe('parseVersionFromRange', () => {
    it('should parse caret ranges', () => {
      expect(parseVersionFromRange('^1.2.3')).toBe('1.2.3');
    });

    it('should parse tilde ranges', () => {
      expect(parseVersionFromRange('~2.3.4')).toBe('2.3.4');
    });

    it('should parse >= ranges', () => {
      expect(parseVersionFromRange('>=1.0.0')).toBe('1.0.0');
    });

    it('should parse exact versions', () => {
      expect(parseVersionFromRange('1.0.0')).toBe('1.0.0');
    });

    it('should handle wildcard as latest', () => {
      expect(parseVersionFromRange('*')).toBe('latest');
    });

    it('should handle latest keyword', () => {
      expect(parseVersionFromRange('latest')).toBe('latest');
    });

    it('should handle empty string as latest', () => {
      expect(parseVersionFromRange('')).toBe('latest');
    });

    it('should parse ranges with spaces', () => {
      expect(parseVersionFromRange('>=1.0.0 <2.0.0')).toBe('1.0.0');
    });

    it('should handle < operator', () => {
      expect(parseVersionFromRange('<2.0.0')).toBe('2.0.0');
    });

    it('should handle <= operator', () => {
      expect(parseVersionFromRange('<=3.5.0')).toBe('3.5.0');
    });

    it('should handle > operator', () => {
      expect(parseVersionFromRange('>1.0.0')).toBe('1.0.0');
    });
  });
});

describe('readPackageJson error handling', () => {
  it('should handle missing name field', async () => {
    const mockPackageJson = {
      // Missing name
      version: '1.0.0',
    };

    vi.mocked(readFile).mockResolvedValue(JSON.stringify(mockPackageJson));

    await expect(readPackageJson()).rejects.toThrow('missing name or version');
  });

  it('should handle missing version field', async () => {
    const mockPackageJson = {
      name: 'test-package',
      // Missing version
    };

    vi.mocked(readFile).mockResolvedValue(JSON.stringify(mockPackageJson));

    await expect(readPackageJson()).rejects.toThrow('missing name or version');
  });

  it('should handle ENOENT error specifically', async () => {
    const error: NodeJS.ErrnoException = new Error('File not found');
    error.code = 'ENOENT';

    vi.mocked(readFile).mockRejectedValue(error);

    await expect(readPackageJson()).rejects.toThrow('package.json not found');
  });

  it('should handle syntax error in JSON', async () => {
    vi.mocked(readFile).mockResolvedValue('{ invalid json }');

    await expect(readPackageJson()).rejects.toThrow();
  });

  it('should handle generic read errors', async () => {
    const error = new Error('Permission denied');

    vi.mocked(readFile).mockRejectedValue(error);

    await expect(readPackageJson()).rejects.toThrow('Failed to read package.json');
  });
});
