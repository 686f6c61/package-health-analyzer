import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  fetchVulnerabilities,
  clearVulnerabilityCache,
  type VulnerabilityResult,
} from '../../src/services/github-advisories.js';

global.fetch = vi.fn();

describe('GitHub Advisory Database', () => {
  beforeEach(() => {
    clearVulnerabilityCache();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return empty result when no token provided', async () => {
    const result = await fetchVulnerabilities('express', '4.0.0');

    expect(result).toEqual({
      package: 'express',
      version: '4.0.0',
      vulnerabilities: [],
      totalCount: 0,
      criticalCount: 0,
      highCount: 0,
      moderateCount: 0,
      lowCount: 0,
    });
  });

  it('should fetch vulnerabilities from GitHub API', async () => {
    const mockResponse = {
      data: {
        securityVulnerabilities: {
          nodes: [
            {
              advisory: {
                ghsaId: 'GHSA-xxxx-yyyy-zzzz',
                summary: 'Test vulnerability',
                description: 'Test description',
                severity: 'HIGH',
                publishedAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-02T00:00:00Z',
                withdrawnAt: null,
                references: [{ url: 'https://example.com' }],
                identifiers: [
                  { type: 'CVE', value: 'CVE-2024-12345' },
                  { type: 'GHSA', value: 'GHSA-xxxx-yyyy-zzzz' },
                ],
                cvss: {
                  score: 7.5,
                  vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N',
                },
              },
              vulnerableVersionRange: '>= 4.0.0, < 4.18.0',
              firstPatchedVersion: { identifier: '4.18.0' },
            },
          ],
        },
      },
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchVulnerabilities('express', '4.0.0', 'ghp_token123');

    expect(result.package).toBe('express');
    expect(result.version).toBe('4.0.0');
    expect(result.totalCount).toBe(1);
    expect(result.highCount).toBe(1);
    expect(result.vulnerabilities[0].ghsaId).toBe('GHSA-xxxx-yyyy-zzzz');
    expect(result.vulnerabilities[0].cveId).toBe('CVE-2024-12345');
    expect(result.vulnerabilities[0].severity).toBe('high');
  });

  it('should filter out withdrawn advisories', async () => {
    const mockResponse = {
      data: {
        securityVulnerabilities: {
          nodes: [
            {
              advisory: {
                ghsaId: 'GHSA-1111-2222-3333',
                summary: 'Withdrawn advisory',
                description: 'This was withdrawn',
                severity: 'MODERATE',
                publishedAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-02T00:00:00Z',
                withdrawnAt: '2024-01-03T00:00:00Z',
                references: [],
                identifiers: [],
              },
              vulnerableVersionRange: '>= 1.0.0',
              firstPatchedVersion: null,
            },
          ],
        },
      },
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchVulnerabilities('test-pkg', '1.0.0', 'ghp_token123');

    expect(result.totalCount).toBe(0);
    expect(result.vulnerabilities).toHaveLength(0);
  });

  it('should count vulnerabilities by severity', async () => {
    const mockResponse = {
      data: {
        securityVulnerabilities: {
          nodes: [
            {
              advisory: {
                ghsaId: 'GHSA-critical',
                summary: 'Critical vuln',
                description: 'Critical',
                severity: 'CRITICAL',
                publishedAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
                withdrawnAt: null,
                references: [],
                identifiers: [],
              },
              vulnerableVersionRange: '>= 1.0.0',
              firstPatchedVersion: null,
            },
            {
              advisory: {
                ghsaId: 'GHSA-high',
                summary: 'High vuln',
                description: 'High',
                severity: 'HIGH',
                publishedAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
                withdrawnAt: null,
                references: [],
                identifiers: [],
              },
              vulnerableVersionRange: '>= 1.0.0',
              firstPatchedVersion: null,
            },
            {
              advisory: {
                ghsaId: 'GHSA-moderate',
                summary: 'Moderate vuln',
                description: 'Moderate',
                severity: 'MODERATE',
                publishedAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
                withdrawnAt: null,
                references: [],
                identifiers: [],
              },
              vulnerableVersionRange: '>= 1.0.0',
              firstPatchedVersion: null,
            },
            {
              advisory: {
                ghsaId: 'GHSA-low',
                summary: 'Low vuln',
                description: 'Low',
                severity: 'LOW',
                publishedAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
                withdrawnAt: null,
                references: [],
                identifiers: [],
              },
              vulnerableVersionRange: '>= 1.0.0',
              firstPatchedVersion: null,
            },
          ],
        },
      },
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchVulnerabilities('test-pkg', '1.0.0', 'ghp_token123');

    expect(result.totalCount).toBe(4);
    expect(result.criticalCount).toBe(1);
    expect(result.highCount).toBe(1);
    expect(result.moderateCount).toBe(1);
    expect(result.lowCount).toBe(1);
  });

  it('should cache vulnerability results', async () => {
    const mockResponse = {
      data: {
        securityVulnerabilities: {
          nodes: [],
        },
      },
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    // First call
    await fetchVulnerabilities('express', '4.0.0', 'ghp_token123');
    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Second call - should use cache
    await fetchVulnerabilities('express', '4.0.0', 'ghp_token123');
    expect(global.fetch).toHaveBeenCalledTimes(1); // Still 1, not 2
  });

  it('should handle GitHub API errors gracefully', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 403,
      statusText: 'Forbidden',
    });

    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = await fetchVulnerabilities('express', '4.0.0', 'ghp_token123');

    expect(result.totalCount).toBe(0);
    expect(consoleWarnSpy).toHaveBeenCalled();

    consoleWarnSpy.mockRestore();
  });

  it('should handle invalid token error', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
    });

    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = await fetchVulnerabilities('express', '4.0.0', 'invalid_token');

    expect(result.totalCount).toBe(0);

    consoleWarnSpy.mockRestore();
  });

  it('should include CVE ID when available', async () => {
    const mockResponse = {
      data: {
        securityVulnerabilities: {
          nodes: [
            {
              advisory: {
                ghsaId: 'GHSA-test',
                summary: 'Test',
                description: 'Test',
                severity: 'MODERATE',
                publishedAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
                withdrawnAt: null,
                references: [],
                identifiers: [
                  { type: 'CVE', value: 'CVE-2024-99999' },
                ],
              },
              vulnerableVersionRange: '>= 1.0.0',
              firstPatchedVersion: null,
            },
          ],
        },
      },
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchVulnerabilities('test-pkg', '1.0.0', 'ghp_token123');

    expect(result.vulnerabilities[0].cveId).toBe('CVE-2024-99999');
  });

  it('should include CVSS score when available', async () => {
    const mockResponse = {
      data: {
        securityVulnerabilities: {
          nodes: [
            {
              advisory: {
                ghsaId: 'GHSA-test',
                summary: 'Test',
                description: 'Test',
                severity: 'HIGH',
                publishedAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
                withdrawnAt: null,
                references: [],
                identifiers: [],
                cvss: {
                  score: 8.5,
                  vectorString: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N',
                },
              },
              vulnerableVersionRange: '>= 1.0.0',
              firstPatchedVersion: { identifier: '2.0.0' },
            },
          ],
        },
      },
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchVulnerabilities('test-pkg', '1.0.0', 'ghp_token123');

    expect(result.vulnerabilities[0].cvss).toBeDefined();
    expect(result.vulnerabilities[0].cvss?.score).toBe(8.5);
    expect(result.vulnerabilities[0].firstPatchedVersion).toBe('2.0.0');
  });

  it('should clear cache when clearVulnerabilityCache is called', async () => {
    const mockResponse = {
      data: {
        securityVulnerabilities: {
          nodes: [],
        },
      },
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    // First call
    await fetchVulnerabilities('express', '4.0.0', 'ghp_token123');
    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Clear cache
    clearVulnerabilityCache();

    // Second call - should fetch again
    await fetchVulnerabilities('express', '4.0.0', 'ghp_token123');
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
