/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import type { RepositoryAnalysis } from '../types/index.js';

interface GitHubRepo {
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  archived: boolean;
  pushed_at: string;
  created_at: string;
}

export class GitHubApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'GitHubApiError';
  }
}

/**
 * Extract GitHub owner and repo from various URL formats
 */
export function extractGitHubInfo(
  repoUrl: string
): { owner: string; repo: string } | null {
  // Clean up common prefixes
  let url = repoUrl
    .replace('git+', '')
    .replace('git:', 'https:')
    .replace('ssh://git@', 'https://');

  // Handle github: protocol
  if (url.startsWith('github:')) {
    url = url.replace('github:', 'https://github.com/');
  }

  // Remove .git suffix
  url = url.replace(/\.git$/, '');

  // Match GitHub URL patterns
  const patterns = [
    /github\.com[:/]([^/]+)\/([^/]+)/,
    /github\.com\/([^/]+)\/([^/#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return {
        owner: match[1]!,
        repo: match[2]!.replace(/\.git$/, ''),
      };
    }
  }

  return null;
}

/**
 * Validate GitHub owner and repo names
 */
function validateGitHubIdentifier(identifier: string, type: 'owner' | 'repo'): void {
  // GitHub username/org rules: 1-39 chars, alphanumeric + hyphens, cannot start with hyphen
  // Repo name rules: similar but can include dots and underscores
  const ownerRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,38})?$/;
  const repoRegex = /^[a-zA-Z0-9._-]{1,100}$/;

  const regex = type === 'owner' ? ownerRegex : repoRegex;
  const maxLength = type === 'owner' ? 39 : 100;

  if (!identifier || identifier.length > maxLength) {
    throw new GitHubApiError(`Invalid GitHub ${type}: length must be 1-${maxLength} characters`);
  }

  if (!regex.test(identifier)) {
    throw new GitHubApiError(`Invalid GitHub ${type} format: ${identifier}`);
  }

  // Prevent path traversal attempts
  if (identifier.includes('..') || identifier.includes('/') || identifier.includes('\\')) {
    throw new GitHubApiError(`Invalid GitHub ${type}: contains forbidden characters`);
  }
}

/**
 * Fetch repository information from GitHub API
 */
export async function fetchGitHubRepo(
  owner: string,
  repo: string,
  token?: string
): Promise<GitHubRepo> {
  // Validate inputs to prevent SSRF and path traversal
  validateGitHubIdentifier(owner, 'owner');
  validateGitHubIdentifier(repo, 'repo');

  // Use encodeURIComponent for additional safety
  const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'package-health-analyzer',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(url, {
      headers,
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      if (response.status === 404) {
        throw new GitHubApiError('Repository not found', 404);
      }

      if (response.status === 403) {
        throw new GitHubApiError('GitHub API rate limit exceeded', 403);
      }

      throw new GitHubApiError(
        `GitHub API request failed: ${response.statusText}`,
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof GitHubApiError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw new GitHubApiError('Request timeout: GitHub API took too long to respond');
    }

    throw new GitHubApiError(
      `Network error fetching GitHub repo: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Calculate release frequency (releases per year)
 */
function calculateReleaseFrequency(
  createdAt: string,
  pushedAt: string
): number {
  const created = new Date(createdAt);
  const pushed = new Date(pushedAt);

  const ageInDays = (pushed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);

  if (ageInDays < 1) {
    return 0;
  }

  // Rough estimate: assume one release per month of activity
  const ageInYears = ageInDays / 365;
  return Math.round(12 / ageInYears);
}

/**
 * Analyze GitHub repository for a package
 */
export async function analyzeGitHubRepository(
  packageName: string,
  version: string,
  repoUrl: string,
  token?: string
): Promise<RepositoryAnalysis> {
  try {
    const githubInfo = extractGitHubInfo(repoUrl);

    if (!githubInfo) {
      return {
        package: packageName,
        version,
        url: repoUrl,
        severity: 'info',
      };
    }

    const repo = await fetchGitHubRepo(
      githubInfo.owner,
      githubInfo.repo,
      token
    );

    // Determine severity based on repository health
    let severity: 'ok' | 'info' | 'warning' | 'critical' = 'ok';

    if (repo.archived) {
      severity = 'critical';
    } else if (repo.open_issues_count > 100) {
      severity = 'warning';
    } else if (repo.open_issues_count > 50) {
      severity = 'info';
    }

    const releaseFrequency = calculateReleaseFrequency(
      repo.created_at,
      repo.pushed_at
    );

    return {
      package: packageName,
      version,
      url: `https://github.com/${githubInfo.owner}/${githubInfo.repo}`,
      openIssues: repo.open_issues_count,
      lastCommit: repo.pushed_at,
      releaseFrequency,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      isArchived: repo.archived,
      severity,
    };
  } catch (error) {
    // Don't fail the entire analysis if GitHub API fails
    console.warn(
      `Warning: Could not fetch GitHub info for ${packageName}:`,
      error instanceof Error ? error.message : String(error)
    );

    return {
      package: packageName,
      version,
      url: repoUrl,
      severity: 'info',
    };
  }
}
