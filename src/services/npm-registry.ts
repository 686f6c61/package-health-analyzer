/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

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

    const data = await response.json();

    return {
      name: data.name,
      version: data['dist-tags']?.latest || Object.keys(data.versions || {}).pop(),
      license: data.license,
      repository: data.repository,
      homepage: data.homepage,
      author: data.author,
      maintainers: data.maintainers,
      time: data.time,
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

    const data = await response.json();

    return {
      name: data.name,
      version: data.version,
      license: data.license,
      repository: data.repository,
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

    const data = await response.json();
    return data.downloads || 0;
  } catch {
    // If downloads API fails, don't fail the entire analysis
    console.warn(`Warning: Could not fetch download stats for ${packageName}`);
    return 0;
  }
}
