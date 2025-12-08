/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { readFile, realpath } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';

export interface PackageJson {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
}

export class PackageReaderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PackageReaderError';
  }
}

/**
 * Validate that a path is within allowed directory (prevent path traversal)
 */
async function validatePathSafety(targetPath: string, baseDir: string): Promise<void> {
  try {
    // Resolve both paths to their real absolute paths
    const realTarget = await realpath(dirname(targetPath)).catch(() => targetPath);
    const realBase = await realpath(baseDir).catch(() => baseDir);

    // Normalize both paths
    const normalizedTarget = resolve(realTarget);
    const normalizedBase = resolve(realBase);

    // Check if target is within base directory
    if (!normalizedTarget.startsWith(normalizedBase)) {
      throw new PackageReaderError(
        'Path traversal detected: target path is outside allowed directory'
      );
    }
  } catch (error) {
    if (error instanceof PackageReaderError) {
      throw error;
    }
    // If we can't validate (e.g., path doesn't exist yet), check pattern
    const normalized = resolve(targetPath);
    if (normalized.includes('..') || !normalized.startsWith(resolve(baseDir))) {
      throw new PackageReaderError(
        'Invalid path: contains path traversal sequences'
      );
    }
  }
}

/**
 * Read and parse package.json from a directory
 */
export async function readPackageJson(
  directory: string = process.cwd()
): Promise<PackageJson> {
  // Validate directory parameter
  if (!directory || typeof directory !== 'string') {
    throw new PackageReaderError('Invalid directory parameter');
  }

  // Prevent path traversal - validate the directory is safe
  const cwd = process.cwd();
  const resolvedDir = resolve(directory);

  // Check for obvious path traversal attempts
  if (directory.includes('\0') || resolvedDir.includes('..')) {
    throw new PackageReaderError('Invalid directory: contains forbidden characters');
  }

  const packagePath = resolve(resolvedDir, 'package.json');

  // Validate the final path is within a reasonable scope
  await validatePathSafety(packagePath, cwd);

  try {
    const content = await readFile(packagePath, 'utf-8');
    const pkg = JSON.parse(content);

    if (!pkg.name || !pkg.version) {
      throw new PackageReaderError(
        'Invalid package.json: missing name or version'
      );
    }

    return pkg;
  } catch (error) {
    if (error instanceof PackageReaderError) {
      throw error;
    }

    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new PackageReaderError(
        `package.json not found in ${directory}`
      );
    }

    if (error instanceof SyntaxError) {
      throw new PackageReaderError(
        `Invalid JSON in package.json: ${error.message}`
      );
    }

    throw new PackageReaderError(
      `Failed to read package.json: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Get all dependencies from package.json
 */
export function getAllDependencies(
  pkg: PackageJson,
  includeDevDependencies: boolean = false
): Map<string, string> {
  const deps = new Map<string, string>();

  // Production dependencies
  if (pkg.dependencies) {
    for (const [name, version] of Object.entries(pkg.dependencies)) {
      deps.set(name, version);
    }
  }

  // Development dependencies
  if (includeDevDependencies && pkg.devDependencies) {
    for (const [name, version] of Object.entries(pkg.devDependencies)) {
      deps.set(name, version);
    }
  }

  // Peer dependencies
  if (pkg.peerDependencies) {
    for (const [name, version] of Object.entries(pkg.peerDependencies)) {
      if (!deps.has(name)) {
        deps.set(name, version);
      }
    }
  }

  // Optional dependencies
  if (pkg.optionalDependencies) {
    for (const [name, version] of Object.entries(pkg.optionalDependencies)) {
      if (!deps.has(name)) {
        deps.set(name, version);
      }
    }
  }

  return deps;
}

/**
 * Parse version from dependency string
 * Handles: ^1.0.0, ~1.0.0, >=1.0.0, 1.0.0, *, latest, etc.
 */
export function parseVersionFromRange(versionRange: string): string {
  // Remove operators and get the version number
  const cleaned = versionRange
    .replace(/^[\^~>=<]+/, '')
    .replace(/\s.*$/, '')
    .trim();

  // Handle special cases
  if (cleaned === '*' || cleaned === 'latest' || cleaned === '') {
    return 'latest';
  }

  return cleaned;
}
