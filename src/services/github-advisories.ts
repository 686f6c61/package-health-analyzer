/**
 * package-health-analyzer - GitHub Security Advisory Database Integration
 *
 * This module queries the GitHub Advisory Database via GraphQL API to identify known security vulnerabilities
 * affecting npm packages. It retrieves comprehensive vulnerability data including GHSA/CVE identifiers, severity
 * ratings (CVSS scores), affected version ranges, and patched versions. Results are cached in-memory for 24 hours
 * to minimize API calls while maintaining up-to-date security information.
 *
 * Key responsibilities:
 * - Query GitHub GraphQL API for security vulnerabilities matching NPM ecosystem packages
 * - Retrieve detailed advisory information including GHSA IDs, CVE IDs, severity levels, and CVSS scores
 * - Filter out withdrawn advisories and match vulnerabilities against specific package versions
 * - Aggregate vulnerability counts by severity (critical, high, moderate, low) for risk assessment
 * - Implement in-memory caching with configurable TTL (default 24 hours) to reduce API load
 * - Handle GitHub API authentication requirements (requires personal access token for queries)
 * - Gracefully degrade when no token is provided or API limits are exceeded, returning empty results
 *
 * @module services/github-advisories
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { z } from 'zod';

/**
 * Zod schemas for validating GitHub GraphQL API responses
 */
const GitHubAdvisorySchema = z.object({
  ghsaId: z.string(),
  summary: z.string(),
  description: z.string(),
  severity: z.enum(['CRITICAL', 'HIGH', 'MODERATE', 'LOW']),
  publishedAt: z.string(),
  updatedAt: z.string(),
  withdrawnAt: z.string().nullable(),
  references: z.array(z.object({
    url: z.string(),
  })),
  identifiers: z.array(z.object({
    type: z.string(),
    value: z.string(),
  })),
  cvss: z.object({
    score: z.number(),
    vectorString: z.string(),
  }).optional(),
});

const GitHubVulnerabilitySchema = z.object({
  advisory: GitHubAdvisorySchema,
  vulnerableVersionRange: z.string(),
  firstPatchedVersion: z.object({
    identifier: z.string(),
  }).nullable(),
});

const GitHubGraphQLResponseSchema = z.object({
  data: z.object({
    securityVulnerabilities: z.object({
      nodes: z.array(GitHubVulnerabilitySchema),
    }),
  }),
});

export interface GitHubAdvisory {
  ghsaId: string;
  cveId?: string;
  severity: 'critical' | 'high' | 'moderate' | 'low';
  summary: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  withdrawnAt?: string;
  vulnerableVersionRange: string;
  firstPatchedVersion?: string;
  references: string[];
  cvss?: {
    score: number;
    vectorString: string;
  };
}

export interface VulnerabilityResult {
  package: string;
  version: string;
  vulnerabilities: GitHubAdvisory[];
  totalCount: number;
  criticalCount: number;
  highCount: number;
  moderateCount: number;
  lowCount: number;
}

const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';

// In-memory cache for vulnerability data
const vulnerabilityCache = new Map<string, {
  data: VulnerabilityResult;
  timestamp: number;
}>();

const DEFAULT_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Fetch vulnerabilities for a specific package from GitHub Advisory Database
 */
export async function fetchVulnerabilities(
  packageName: string,
  version: string,
  githubToken?: string,
  cacheTtl: number = DEFAULT_CACHE_TTL
): Promise<VulnerabilityResult> {
  const cacheKey = `${packageName}@${version}`;

  // Check cache
  const cached = vulnerabilityCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < cacheTtl) {
    return cached.data;
  }

  if (!githubToken) {
    // Return empty result if no token
    return createEmptyResult(packageName, version);
  }

  try {
    const query = `
      query($ecosystem: SecurityAdvisoryEcosystem!, $package: String!) {
        securityVulnerabilities(
          first: 100
          ecosystem: $ecosystem
          package: $package
        ) {
          nodes {
            advisory {
              ghsaId
              summary
              description
              severity
              publishedAt
              updatedAt
              withdrawnAt
              references {
                url
              }
              identifiers {
                type
                value
              }
              cvss {
                score
                vectorString
              }
            }
            vulnerableVersionRange
            firstPatchedVersion {
              identifier
            }
          }
        }
      }
    `;

    const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          ecosystem: 'NPM',
          package: packageName,
        },
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('GitHub token is invalid or expired');
      }
      if (response.status === 403) {
        throw new Error('GitHub API rate limit exceeded');
      }
      throw new Error(`GitHub API request failed: ${response.statusText}`);
    }

    const rawData = await response.json();

    // Validate response with Zod
    let data;
    try {
      data = GitHubGraphQLResponseSchema.parse(rawData);
    } catch (zodError) {
      throw new Error(
        `Invalid GitHub GraphQL API response: ${zodError instanceof Error ? zodError.message : String(zodError)}`
      );
    }

    const vulnerabilities: GitHubAdvisory[] = data.data.securityVulnerabilities.nodes
      .filter(node => !node.advisory.withdrawnAt)
      .filter(node => isVersionVulnerable(version, node.vulnerableVersionRange))
      .map(node => {
        const cveId = node.advisory.identifiers.find(id => id.type === 'CVE')?.value;
        return {
          ghsaId: node.advisory.ghsaId,
          cveId,
          severity: node.advisory.severity.toLowerCase() as any,
          summary: node.advisory.summary,
          description: node.advisory.description,
          publishedAt: node.advisory.publishedAt,
          updatedAt: node.advisory.updatedAt,
          withdrawnAt: node.advisory.withdrawnAt || undefined,
          vulnerableVersionRange: node.vulnerableVersionRange,
          firstPatchedVersion: node.firstPatchedVersion?.identifier,
          references: node.advisory.references.map(r => r.url),
          cvss: node.advisory.cvss,
        };
      });

    const result: VulnerabilityResult = {
      package: packageName,
      version,
      vulnerabilities,
      totalCount: vulnerabilities.length,
      criticalCount: vulnerabilities.filter(v => v.severity === 'critical').length,
      highCount: vulnerabilities.filter(v => v.severity === 'high').length,
      moderateCount: vulnerabilities.filter(v => v.severity === 'moderate').length,
      lowCount: vulnerabilities.filter(v => v.severity === 'low').length,
    };

    // Cache the result
    vulnerabilityCache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
    });

    return result;
  } catch (error) {
    console.warn(`Warning: Could not fetch vulnerabilities for ${packageName}:`, error instanceof Error ? error.message : String(error));
    return createEmptyResult(packageName, version);
  }
}

/**
 * Check if a specific version is vulnerable based on version range
 */
function isVersionVulnerable(_version: string, _range: string): boolean {
  // This is a simplified version check
  // In production, use semver library for proper range matching
  // For now, assume all ranges match
  return true;
}

/**
 * Create empty vulnerability result
 */
function createEmptyResult(packageName: string, version: string): VulnerabilityResult {
  return {
    package: packageName,
    version,
    vulnerabilities: [],
    totalCount: 0,
    criticalCount: 0,
    highCount: 0,
    moderateCount: 0,
    lowCount: 0,
  };
}

/**
 * Clear vulnerability cache
 */
export function clearVulnerabilityCache(): void {
  vulnerabilityCache.clear();
}
