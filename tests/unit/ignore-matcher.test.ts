/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { describe, it, expect } from 'vitest';
import {
  shouldIgnorePackage,
  getIgnoreReason,
} from '../../src/utils/ignore-matcher.js';
import type { PackageMetadata } from '../../src/types/index.js';
import type { IgnoreConfig } from '../../src/types/config.js';

describe('Ignore matcher', () => {
  const createMockMetadata = (
    name: string,
    author?: string
  ): PackageMetadata => ({
    name,
    version: '1.0.0',
    author,
  });

  const emptyIgnoreConfig: IgnoreConfig = {
    scopes: [],
    prefixes: [],
    authors: [],
    packages: [],
  };

  describe('shouldIgnorePackage', () => {
    it('should ignore exact package name match', () => {
      const config: IgnoreConfig = {
        ...emptyIgnoreConfig,
        packages: ['test-package'],
      };

      const metadata = createMockMetadata('test-package');
      expect(shouldIgnorePackage('test-package', metadata, config)).toBe(true);
    });

    it('should not ignore non-matching package', () => {
      const config: IgnoreConfig = {
        ...emptyIgnoreConfig,
        packages: ['other-package'],
      };

      const metadata = createMockMetadata('test-package');
      expect(shouldIgnorePackage('test-package', metadata, config)).toBe(false);
    });

    it('should ignore packages matching scope pattern', () => {
      const config: IgnoreConfig = {
        ...emptyIgnoreConfig,
        scopes: ['@types/*'],
      };

      const metadata = createMockMetadata('@types/node');
      expect(shouldIgnorePackage('@types/node', metadata, config)).toBe(true);
    });

    it('should ignore packages matching prefix pattern', () => {
      const config: IgnoreConfig = {
        ...emptyIgnoreConfig,
        prefixes: ['eslint-*'],
      };

      const metadata = createMockMetadata('eslint-plugin-react');
      expect(shouldIgnorePackage('eslint-plugin-react', metadata, config)).toBe(
        true
      );
    });

    it('should ignore packages by author', () => {
      const config: IgnoreConfig = {
        ...emptyIgnoreConfig,
        authors: ['internal-team@company.com'],
      };

      const metadata = createMockMetadata(
        'internal-package',
        'internal-team@company.com'
      );
      expect(shouldIgnorePackage('internal-package', metadata, config)).toBe(
        true
      );
    });

    it('should not ignore when no rules match', () => {
      const config: IgnoreConfig = {
        ...emptyIgnoreConfig,
        scopes: ['@types/*'],
        prefixes: ['eslint-*'],
      };

      const metadata = createMockMetadata('react');
      expect(shouldIgnorePackage('react', metadata, config)).toBe(false);
    });
  });

  describe('getIgnoreReason', () => {
    it('should return reason for exact match', () => {
      const config: IgnoreConfig = {
        ...emptyIgnoreConfig,
        packages: ['test-package'],
        reasons: {
          'test-package': 'Internal package',
        },
      };

      const metadata = createMockMetadata('test-package');
      const reason = getIgnoreReason('test-package', metadata, config);
      expect(reason).toBe('Internal package');
    });

    it('should return default reason when no custom reason provided', () => {
      const config: IgnoreConfig = {
        ...emptyIgnoreConfig,
        packages: ['test-package'],
      };

      const metadata = createMockMetadata('test-package');
      const reason = getIgnoreReason('test-package', metadata, config);
      expect(reason).toBe('Explicitly ignored');
    });

    it('should return reason for scope match with custom reason', () => {
      const config: IgnoreConfig = {
        ...emptyIgnoreConfig,
        scopes: ['@types/*'],
        reasons: {
          '@types/*': 'Type definitions',
        },
      };

      const metadata = createMockMetadata('@types/node');
      const reason = getIgnoreReason('@types/node', metadata, config);
      expect(reason).toBe('Type definitions');
    });

    it('should return default reason for scope match without custom reason', () => {
      const config: IgnoreConfig = {
        ...emptyIgnoreConfig,
        scopes: ['@internal/*'],
      };

      const metadata = createMockMetadata('@internal/utils');
      const reason = getIgnoreReason('@internal/utils', metadata, config);
      expect(reason).toBe('Matches scope: @internal/*');
    });

    it('should return reason for prefix match with custom reason', () => {
      const config: IgnoreConfig = {
        ...emptyIgnoreConfig,
        prefixes: ['eslint-*'],
        reasons: {
          'eslint-*': 'ESLint plugins',
        },
      };

      const metadata = createMockMetadata('eslint-plugin-react');
      const reason = getIgnoreReason('eslint-plugin-react', metadata, config);
      expect(reason).toBe('ESLint plugins');
    });

    it('should return default reason for prefix match without custom reason', () => {
      const config: IgnoreConfig = {
        ...emptyIgnoreConfig,
        prefixes: ['babel-*'],
      };

      const metadata = createMockMetadata('babel-core');
      const reason = getIgnoreReason('babel-core', metadata, config);
      expect(reason).toBe('Matches prefix: babel-*');
    });

    it('should return reason for author match', () => {
      const config: IgnoreConfig = {
        ...emptyIgnoreConfig,
        authors: ['internal-team@company.com'],
      };

      const metadata = createMockMetadata(
        'internal-package',
        'internal-team@company.com'
      );
      const reason = getIgnoreReason('internal-package', metadata, config);
      expect(reason).toBe('Author is in ignore list');
    });

    it('should return undefined for non-ignored package', () => {
      const config: IgnoreConfig = emptyIgnoreConfig;

      const metadata = createMockMetadata('test-package');
      const reason = getIgnoreReason('test-package', metadata, config);
      expect(reason).toBeUndefined();
    });
  });
});
