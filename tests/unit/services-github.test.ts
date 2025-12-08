/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analyzeGitHubRepository } from '../../src/services/github-api.js';

global.fetch = vi.fn();

describe('GitHub API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should analyze GitHub repository', async () => {
    const mockRepoData = {
      name: 'test-repo',
      stargazers_count: 1000,
      forks_count: 100,
      open_issues_count: 50,
      archived: false,
      pushed_at: '2024-01-01T00:00:00Z',
      created_at: '2020-01-01T00:00:00Z',
    };

    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => mockRepoData,
    } as Response);

    const result = await analyzeGitHubRepository(
      'test-package',
      '1.0.0',
      'https://github.com/user/test-repo',
      undefined
    );

    expect(result.stars).toBe(1000);
    expect(result.forks).toBe(100);
    expect(result.openIssues).toBe(50);
    expect(result.isArchived).toBe(false);
  });

  it('should handle invalid GitHub URLs gracefully', async () => {
    const result = await analyzeGitHubRepository(
      'test-package',
      '1.0.0',
      'https://example.com',
      undefined
    );

    // Should return graceful fallback for invalid URLs
    expect(result.severity).toBe('info');
    expect(result.package).toBe('test-package');
    expect(result.url).toBe('https://example.com');
  });

  it('should handle API errors gracefully', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    } as Response);

    const result = await analyzeGitHubRepository(
      'test-package',
      '1.0.0',
      'https://github.com/user/repo',
      undefined
    );

    // Should return graceful fallback, not throw
    expect(result.severity).toBe('info');
    expect(result.package).toBe('test-package');
  });

  it('should use authentication token when provided', async () => {
    const mockRepoData = {
      name: 'test-repo',
      stargazers_count: 500,
      forks_count: 50,
      open_issues_count: 10,
      archived: false,
      pushed_at: '2024-01-01T00:00:00Z',
      created_at: '2020-01-01T00:00:00Z',
    };

    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => mockRepoData,
    } as Response);

    await analyzeGitHubRepository(
      'test-package',
      '1.0.0',
      'https://github.com/user/test-repo',
      'ghp_test_token'
    );

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer ghp_test_token',
        }),
      })
    );
  });

  it('should handle archived repositories', async () => {
    const mockRepoData = {
      name: 'archived-repo',
      stargazers_count: 100,
      forks_count: 10,
      open_issues_count: 0,
      archived: true,
      pushed_at: '2020-01-01T00:00:00Z',
      created_at: '2019-01-01T00:00:00Z',
    };

    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => mockRepoData,
    } as Response);

    const result = await analyzeGitHubRepository(
      'test-package',
      '1.0.0',
      'https://github.com/user/archived-repo',
      undefined
    );

    expect(result.isArchived).toBe(true);
    expect(result.severity).toBe('critical'); // Archived repos are critical, not warning
  });

  it('should extract owner and repo from various URL formats', async () => {
    const mockRepoData = {
      name: 'repo',
      stargazers_count: 0,
      forks_count: 0,
      open_issues_count: 0,
      archived: false,
      pushed_at: '2024-01-01T00:00:00Z',
      created_at: '2020-01-01T00:00:00Z',
    };

    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => mockRepoData,
    } as Response);

    const urls = [
      'https://github.com/user/repo',
      'https://github.com/user/repo.git',
      'git+https://github.com/user/repo.git',
      'git://github.com/user/repo.git',
    ];

    for (const url of urls) {
      vi.clearAllMocks();
      await analyzeGitHubRepository('test', '1.0.0', url, undefined);
      expect(global.fetch).toHaveBeenCalled();
    }
  });

  it('should calculate severity based on repository health', async () => {
    const mockRepoData = {
      name: 'unhealthy-repo',
      stargazers_count: 0,
      forks_count: 0,
      open_issues_count: 500,
      archived: false,
      pushed_at: '2020-01-01T00:00:00Z',
      created_at: '2015-01-01T00:00:00Z',
    };

    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => mockRepoData,
    } as Response);

    const result = await analyzeGitHubRepository(
      'test-package',
      '1.0.0',
      'https://github.com/user/unhealthy-repo',
      undefined
    );

    expect(result.openIssues).toBe(500);
    expect(result.severity).toMatch(/warning|critical/);
  });

  it('should handle rate limiting gracefully', async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      status: 429,
      statusText: 'Too Many Requests',
    } as Response);

    const result = await analyzeGitHubRepository(
      'test-package',
      '1.0.0',
      'https://github.com/user/repo',
      undefined
    );

    // Should return graceful fallback, not throw
    expect(result.severity).toBe('info');
    expect(result.package).toBe('test-package');
  });

  it('should handle network errors gracefully', async () => {
    vi.mocked(global.fetch).mockRejectedValue(new Error('Network error'));

    const result = await analyzeGitHubRepository(
      'test-package',
      '1.0.0',
      'https://github.com/user/repo',
      undefined
    );

    // Should return graceful fallback, not throw
    expect(result.severity).toBe('info');
    expect(result.package).toBe('test-package');
  });
});
