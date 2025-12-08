/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fetchPackageMetadata,
  fetchPackageVersion,
  fetchDownloadStats,
  NpmRegistryError,
} from '../../src/services/npm-registry.js';

// Mock global fetch
global.fetch = vi.fn();

describe('NPM Registry Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchPackageMetadata', () => {
    it('should fetch package metadata successfully', async () => {
      const mockData = {
        name: 'test-pkg',
        'dist-tags': { latest: '1.0.0' },
        license: 'MIT',
        repository: { url: 'https://github.com/test/test' },
      };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockData,
      } as Response);

      const result = await fetchPackageMetadata('test-pkg');

      expect(result.name).toBe('test-pkg');
      expect(result.version).toBe('1.0.0');
      expect(result.license).toBe('MIT');
    });

    it('should throw NpmRegistryError for 404', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response);

      await expect(fetchPackageMetadata('nonexistent-pkg')).rejects.toThrow(
        NpmRegistryError
      );
    });

    it('should throw NpmRegistryError for other HTTP errors', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response);

      await expect(fetchPackageMetadata('test-pkg')).rejects.toThrow(
        NpmRegistryError
      );
    });

    it('should handle network errors', async () => {
      vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

      await expect(fetchPackageMetadata('test-pkg')).rejects.toThrow(
        NpmRegistryError
      );
    });
  });

  describe('fetchPackageVersion', () => {
    it('should fetch specific version successfully', async () => {
      const mockData = {
        name: 'test-pkg',
        version: '2.0.0',
        license: 'MIT',
      };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockData,
      } as Response);

      const result = await fetchPackageVersion('test-pkg', '2.0.0');

      expect(result.name).toBe('test-pkg');
      expect(result.version).toBe('2.0.0');
      expect(result.license).toBe('MIT');
    });

    it('should throw NpmRegistryError for 404', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response);

      await expect(
        fetchPackageVersion('test-pkg', '99.99.99')
      ).rejects.toThrow(NpmRegistryError);
    });

    it('should throw NpmRegistryError for other HTTP errors', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response);

      await expect(
        fetchPackageVersion('test-pkg', '1.0.0')
      ).rejects.toThrow(NpmRegistryError);
    });

    it('should handle network errors', async () => {
      vi.mocked(fetch).mockRejectedValue(new Error('Network timeout'));

      await expect(
        fetchPackageVersion('test-pkg', '1.0.0')
      ).rejects.toThrow(NpmRegistryError);
    });

    it('should handle non-Error exceptions', async () => {
      vi.mocked(fetch).mockRejectedValue('string error');

      await expect(
        fetchPackageVersion('test-pkg', '1.0.0')
      ).rejects.toThrow(NpmRegistryError);
    });
  });

  describe('fetchDownloadStats', () => {
    it('should fetch download stats successfully', async () => {
      const mockData = {
        downloads: 12345,
      };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockData,
      } as Response);

      const result = await fetchDownloadStats('test-pkg');

      expect(result).toBe(12345);
    });

    it('should return 0 for 404', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 404,
      } as Response);

      const result = await fetchDownloadStats('test-pkg');

      expect(result).toBe(0);
    });

    it('should return 0 for other HTTP errors', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response);

      // The function catches errors and returns 0
      const result = await fetchDownloadStats('test-pkg');
      expect(result).toBe(0);
    });

    it('should return 0 on network error', async () => {
      vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

      const result = await fetchDownloadStats('test-pkg');

      expect(result).toBe(0);
    });

    it('should handle missing downloads field', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      } as Response);

      const result = await fetchDownloadStats('test-pkg');

      expect(result).toBe(0);
    });

    it('should support different time periods', async () => {
      const mockData = { downloads: 100 };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockData,
      } as Response);

      const result = await fetchDownloadStats('test-pkg', 'last-day');

      expect(result).toBe(100);
    });
  });

  describe('NpmRegistryError', () => {
    it('should create error with all properties', () => {
      const error = new NpmRegistryError(
        'Test error',
        'test-package',
        404
      );

      expect(error.message).toBe('Test error');
      expect(error.packageName).toBe('test-package');
      expect(error.statusCode).toBe(404);
      expect(error.name).toBe('NpmRegistryError');
    });

    it('should create error without status code', () => {
      const error = new NpmRegistryError(
        'Network error',
        'test-package'
      );

      expect(error.message).toBe('Network error');
      expect(error.packageName).toBe('test-package');
      expect(error.statusCode).toBeUndefined();
    });
  });
});
