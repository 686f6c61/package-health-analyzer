/**
 * package-health-analyzer - NPM Registry Integration Service
 *
 * This module provides a robust and secure interface to the NPM Registry API, handling all package
 * metadata retrieval operations with comprehensive error handling, input validation, and security measures.
 * It serves as the primary data source for package information including versions, licenses, maintainers,
 * and deprecation status.
 *
 * Key responsibilities:
 * - Fetch package metadata from registry.npmjs.org with strict input validation to prevent injection attacks
 * - Retrieve version-specific package information with semver support and tag resolution
 * - Query download statistics from api.npmjs.org to assess package popularity and adoption
 * - Implement request timeouts (10s) and proper error handling with typed exceptions (NpmRegistryError)
 * - Validate package names against NPM naming rules and prevent path traversal/SSRF attacks
 * - Handle HTTP errors (404 for missing packages, timeout for slow responses) with detailed error context
 *
 * @module services/npm-registry
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { z } from 'zod';
import type { PackageMetadata } from '../types/index.js';

const NPM_REGISTRY_URL = 'https://registry.npmjs.org';

export class NpmRegistryError extends Error {
  constructor(
    message: string,
    public readonly packageName: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'NpmRegistryError';
  }
}

/**
 * Zod schemas for validating NPM Registry API responses
 */
const NpmPackageMetadataSchema = z.object({
  name: z.string(),
  version: z.string().optional(),
  'dist-tags': z.object({
    latest: z.string(),
  }).catchall(z.string()).optional(),
  versions: z.record(z.object({
    name: z.string().optional(),
    version: z.string().optional(),
    license: z.union([z.string(), z.object({}).passthrough()]).optional(),
    repository: z.union([
      z.string(),
      z.object({
        type: z.string().optional(),
        url: z.string().optional(),
      }).passthrough()
    ]).optional(),
    homepage: z.string().optional(),
    deprecated: z.union([z.string(), z.boolean()]).optional(),
    dist: z.object({
      tarball: z.string(),
    }).passthrough().optional(),
    author: z.union([
      z.string(),
      z.object({
        name: z.string().optional(),
        email: z.string().optional(),
      }).passthrough()
    ]).optional(),
    dependencies: z.record(z.string()).optional(),
    devDependencies: z.record(z.string()).optional(),
  }).passthrough()).optional(),
  time: z.record(z.string()).optional(),
  license: z.union([z.string(), z.object({}).passthrough()]).optional(),
  repository: z.union([
    z.string(),
    z.object({
      type: z.string().optional(),
      url: z.string().optional(),
    }).passthrough()
  ]).optional(),
  homepage: z.string().optional(),
  deprecated: z.union([z.string(), z.boolean()]).optional(),
  author: z.union([
    z.string(),
    z.object({
      name: z.string().optional(),
      email: z.string().optional(),
    }).passthrough()
  ]).optional(),
  maintainers: z.array(z.object({
    name: z.string(),
    email: z.string(),
  }).passthrough()).optional(),
});

const NpmDownloadStatsSchema = z.object({
  downloads: z.number(),
  start: z.string().optional(),
  end: z.string().optional(),
  package: z.string().optional(),
});

/**
 * Validate npm package name
 */
function validatePackageName(packageName: string): void {
  // npm package name rules: 1-214 chars, lowercase, can include @scope/
  const packageNameRegex = /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;

  if (!packageName || packageName.length > 214) {
    throw new NpmRegistryError(
      'Invalid package name: length must be 1-214 characters',
      packageName
    );
  }

  if (!packageNameRegex.test(packageName)) {
    throw new NpmRegistryError(
      `Invalid package name format: ${packageName}`,
      packageName
    );
  }

  // Prevent path traversal and URL injection
  if (packageName.includes('..') || packageName.includes('//')) {
    throw new NpmRegistryError(
      'Invalid package name: contains forbidden characters',
      packageName
    );
  }
}

/**
 * Fetch package metadata from npm registry
 */
export async function fetchPackageMetadata(
  packageName: string
): Promise<PackageMetadata> {
  // Validate package name to prevent injection attacks
  validatePackageName(packageName);

  const url = `${NPM_REGISTRY_URL}/${encodeURIComponent(packageName)}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      if (response.status === 404) {
        throw new NpmRegistryError(
          `Package not found: ${packageName}`,
          packageName,
          404
        );
      }

      throw new NpmRegistryError(
        `Failed to fetch package metadata: ${response.statusText}`,
        packageName,
        response.status
      );
    }

    const rawData = await response.json();

    // Validate response with Zod
    let data;
    try {
      data = NpmPackageMetadataSchema.parse(rawData);
    } catch (zodError) {
      throw new NpmRegistryError(
        `Invalid package metadata from npm registry: ${zodError instanceof Error ? zodError.message : String(zodError)}`,
        packageName
      );
    }

    return {
      name: data.name,
      version: data['dist-tags']?.latest || Object.keys(data.versions || {}).pop() || 'unknown',
      license: typeof data.license === 'string' ? data.license : undefined,
      repository: typeof data.repository === 'string' ? data.repository : (data.repository as any),
      homepage: data.homepage,
      author: data.author,
      maintainers: data.maintainers,
      time: data.time,
      deprecated: data.deprecated,
      'dist-tags': data['dist-tags'],
      versions: data.versions,
    };
  } catch (error) {
    if (error instanceof NpmRegistryError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw new NpmRegistryError(
        'Request timeout: npm registry took too long to respond',
        packageName
      );
    }

    throw new NpmRegistryError(
      `Network error fetching package: ${error instanceof Error ? error.message : String(error)}`,
      packageName
    );
  }
}

/**
 * Fetch metadata for a specific version of a package
 */
export async function fetchPackageVersion(
  packageName: string,
  version: string
): Promise<PackageMetadata> {
  // Validate inputs
  validatePackageName(packageName);

  // Validate version format (semver or tag like 'latest')
  if (!version || version.length > 50 || /[<>|&;`$()]/.test(version)) {
    throw new NpmRegistryError(
      `Invalid version format: ${version}`,
      packageName
    );
  }

  const url = `${NPM_REGISTRY_URL}/${encodeURIComponent(packageName)}/${encodeURIComponent(version)}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      if (response.status === 404) {
        throw new NpmRegistryError(
          `Package version not found: ${packageName}@${version}`,
          packageName,
          404
        );
      }

      throw new NpmRegistryError(
        `Failed to fetch package version: ${response.statusText}`,
        packageName,
        response.status
      );
    }

    const rawData = await response.json();

    // Validate response with Zod (version endpoint returns simpler structure)
    const VersionDataSchema = z.object({
      name: z.string(),
      version: z.string(),
      license: z.union([z.string(), z.object({}).passthrough()]).optional(),
      repository: z.union([
        z.string(),
        z.object({
          type: z.string().optional(),
          url: z.string().optional(),
        }).passthrough()
      ]).optional(),
      homepage: z.string().optional(),
      author: z.union([
        z.string(),
        z.object({
          name: z.string().optional(),
          email: z.string().optional(),
        }).passthrough()
      ]).optional(),
      maintainers: z.array(z.object({
        name: z.string(),
        email: z.string(),
      }).passthrough()).optional(),
      deprecated: z.union([z.string(), z.boolean()]).optional(),
    });

    let data;
    try {
      data = VersionDataSchema.parse(rawData);
    } catch (zodError) {
      throw new NpmRegistryError(
        `Invalid package version metadata: ${zodError instanceof Error ? zodError.message : String(zodError)}`,
        packageName
      );
    }

    return {
      name: data.name,
      version: data.version,
      license: typeof data.license === 'string' ? data.license : undefined,
      repository: typeof data.repository === 'string' ? data.repository : (data.repository as any),
      homepage: data.homepage,
      author: data.author,
      maintainers: data.maintainers,
      time: undefined, // Version endpoint doesn't include time
      deprecated: data.deprecated,
    };
  } catch (error) {
    if (error instanceof NpmRegistryError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw new NpmRegistryError(
        'Request timeout: npm registry took too long to respond',
        packageName
      );
    }

    throw new NpmRegistryError(
      `Network error fetching package version: ${error instanceof Error ? error.message : String(error)}`,
      packageName
    );
  }
}

/**
 * Fetch download statistics for a package
 */
export async function fetchDownloadStats(
  packageName: string,
  period: 'last-day' | 'last-week' | 'last-month' = 'last-week'
): Promise<number> {
  // Validate package name
  validatePackageName(packageName);

  const url = `https://api.npmjs.org/downloads/point/${period}/${encodeURIComponent(packageName)}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, { signal: controller.signal });

    clearTimeout(timeout);

    if (!response.ok) {
      // Downloads API returns 404 for packages with no downloads
      if (response.status === 404) {
        return 0;
      }

      throw new Error(`Failed to fetch download stats: ${response.statusText}`);
    }

    const rawData = await response.json();

    // Validate response with Zod
    try {
      const data = NpmDownloadStatsSchema.parse(rawData);
      return data.downloads || 0;
    } catch {
      // If validation fails, treat as no downloads
      console.warn(`Warning: Invalid download stats format for ${packageName}`);
      return 0;
    }
  } catch {
    // If downloads API fails, don't fail the entire analysis
    console.warn(`Warning: Could not fetch download stats for ${packageName}`);
    return 0;
  }
}
