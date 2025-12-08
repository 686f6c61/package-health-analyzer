/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchPackageMetadata, fetchPackageVersion, fetchDownloadStats } from '../../src/services/npm-registry.js';

global.fetch = vi.fn();

describe('NPM Registry Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchPackageMetadata', () => {
    it('should fetch package metadata', async () => {
      const mockData = {
        name: 'test-package',
        'dist-tags': {
          latest: '1.0.0',
        },
        versions: {
          '1.0.0': {},
        },
        license: 'MIT',
        time: {
          '1.0.0': '2024-01-01T00:00:00.000Z',
        },
      };

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => mockData,
      } as Response);

      const result = await fetchPackageMetadata('test-package');

      expect(result.name).toBe('test-package');
      expect(result.version).toBe('1.0.0');
      expect(result.license).toBe('MIT');
    });

    it('should throw error for 404', async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response);

      await expect(fetchPackageMetadata('nonexistent')).rejects.toThrow();
    });

    it('should throw error for network failure', async () => {
      vi.mocked(global.fetch).mockRejectedValue(new Error('Network error'));

      await expect(fetchPackageMetadata('test-package')).rejects.toThrow();
    });

    it('should handle package with repository', async () => {
      const mockData = {
        name: 'test-package',
        'dist-tags': {
          latest: '1.0.0',
        },
        versions: {
          '1.0.0': {},
        },
        repository: {
          type: 'git',
          url: 'https://github.com/user/repo.git',
        },
      };

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => mockData,
      } as Response);

      const result = await fetchPackageMetadata('test-package');

      expect(result.repository).toBeDefined();
      expect(result.repository?.url).toBe('https://github.com/user/repo.git');
    });

    it('should handle deprecated packages', async () => {
      const mockData = {
        name: 'deprecated-package',
        'dist-tags': {
          latest: '1.0.0',
        },
        versions: {
          '1.0.0': {},
        },
        deprecated: 'Use new-package instead',
      };

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => mockData,
      } as Response);

      const result = await fetchPackageMetadata('deprecated-package');

      expect(result.deprecated).toBe('Use new-package instead');
    });
  });

  describe('fetchPackageVersion', () => {
    it('should fetch specific version', async () => {
      const mockData = {
        name: 'test-package',
        version: '2.0.0',
      };

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => mockData,
      } as Response);

      const result = await fetchPackageVersion('test-package', '2.0.0');

      expect(result.version).toBe('2.0.0');
    });

    it('should handle version not found', async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response);

      await expect(fetchPackageVersion('test-package', '99.0.0')).rejects.toThrow();
    });
  });

  describe('fetchDownloadStats', () => {
    it('should fetch download statistics', async () => {
      const mockData = {
        downloads: 1000000,
      };

      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => mockData,
      } as Response);

      const result = await fetchDownloadStats('test-package');

      expect(result).toBe(1000000);
    });

    it('should return 0 on API failure', async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response);

      const result = await fetchDownloadStats('test-package');

      expect(result).toBe(0);
    });

    it('should return 0 on network error', async () => {
      vi.mocked(global.fetch).mockRejectedValue(new Error('Network error'));

      const result = await fetchDownloadStats('test-package');

      expect(result).toBe(0);
    });

    it('should handle missing downloads field', async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      } as Response);

      const result = await fetchDownloadStats('test-package');

      expect(result).toBe(0);
    });
  });
});
