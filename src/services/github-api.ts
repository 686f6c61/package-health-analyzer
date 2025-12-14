/**
 * package-health-analyzer - GitHub API Integration Service
 *
 * This module integrates with the GitHub REST API to analyze repository health metrics for npm packages
 * hosted on GitHub. It extracts valuable insights including activity levels, community engagement, maintenance
 * status, and potential red flags (archived repos, high issue counts). The service includes intelligent URL
 * parsing to handle various GitHub URL formats and implements security measures to prevent SSRF attacks.
 *
 * Key responsibilities:
 * - Fetch repository metadata from api.github.com including stars, forks, open issues, and last commit date
 * - Extract GitHub owner/repo identifiers from various URL formats (git://, ssh://, https://, github: protocol)
 * - Calculate repository health metrics including release frequency, activity patterns, and maintenance indicators
 * - Determine severity levels (ok, info, warning, critical) based on archive status and issue count thresholds
 * - Validate GitHub identifiers (owner/repo names) against GitHub's naming rules to prevent path traversal
 * - Handle GitHub API rate limiting (403) and authentication with optional personal access tokens
 * - Implement 10-second request timeouts with AbortController for reliability
 *
 * @module services/github-api
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { z } from 'zod';
import type { RepositoryAnalysis } from '../types/index.js';

/**
 * Zod schema for validating GitHub API repository responses
 */
const GitHubRepoSchema = z.object({
  name: z.string().optional(),
  full_name: z.string().optional(),
  description: z.string().nullable().optional(),
  stargazers_count: z.number(),
  forks_count: z.number(),
  open_issues_count: z.number(),
  archived: z.boolean(),
  pushed_at: z.string(),
  created_at: z.string(),
  html_url: z.string().optional(),
  private: z.boolean().optional(),
}).passthrough();

type GitHubRepo = z.infer<typeof GitHubRepoSchema>;

/**
 * Zod schema for validating GitHub releases
 */
const GitHubReleaseSchema = z.object({
  tag_name: z.string(),
  name: z.string().nullable(),
  body: z.string().nullable(),
  published_at: z.string(),
  html_url: z.string(),
}).passthrough();

type GitHubRelease = z.infer<typeof GitHubReleaseSchema>;

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

    const rawData = await response.json();

    // Validate response with Zod
    try {
      return GitHubRepoSchema.parse(rawData);
    } catch (zodError) {
      throw new GitHubApiError(
        `Invalid GitHub API response: ${zodError instanceof Error ? zodError.message : String(zodError)}`
      );
    }
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

/**
 * Fetch GitHub releases for a repository
 */
export async function fetchGitHubReleases(
  owner: string,
  repo: string,
  token?: string,
  perPage: number = 30
): Promise<GitHubRelease[]> {
  // Validate inputs
  validateGitHubIdentifier(owner, 'owner');
  validateGitHubIdentifier(repo, 'repo');

  const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/releases?per_page=${perPage}`;

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'package-health-analyzer',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      if (response.status === 404) {
        return []; // No releases found
      }

      if (response.status === 403) {
        throw new GitHubApiError('GitHub API rate limit exceeded', 403);
      }

      throw new GitHubApiError(
        `GitHub API request failed: ${response.statusText}`,
        response.status
      );
    }

    const rawData = await response.json();

    // Validate response
    if (!Array.isArray(rawData)) {
      return [];
    }

    // Validate each release
    const releases: GitHubRelease[] = [];
    for (const item of rawData) {
      try {
        releases.push(GitHubReleaseSchema.parse(item));
      } catch {
        // Skip invalid releases
        continue;
      }
    }

    return releases;
  } catch (error) {
    if (error instanceof GitHubApiError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw new GitHubApiError('Request timeout: GitHub API took too long to respond');
    }

    throw new GitHubApiError(
      `Network error fetching GitHub releases: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Fetch CHANGELOG file content from GitHub repository
 */
export async function fetchChangelogFile(
  owner: string,
  repo: string,
  branch: string = 'main'
): Promise<string | null> {
  // Validate inputs
  validateGitHubIdentifier(owner, 'owner');
  validateGitHubIdentifier(repo, 'repo');

  // Common changelog filenames to try
  const changelogFiles = [
    'CHANGELOG.md',
    'HISTORY.md',
    'RELEASES.md',
    'CHANGES.md',
    'NEWS.md',
    'changelog.md',
    'history.md',
  ];

  // Try each possible changelog file
  for (const filename of changelogFiles) {
    try {
      const url = `https://raw.githubusercontent.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/${branch}/${filename}`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(url, {
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (response.ok) {
        return await response.text();
      }
    } catch {
      // Try next filename
      continue;
    }
  }

  // Try with 'master' branch if 'main' failed
  if (branch === 'main') {
    return fetchChangelogFile(owner, repo, 'master');
  }

  return null;
}
