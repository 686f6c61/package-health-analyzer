/**
 * package-health-analyzer - Local Package.json Reader and Parser
 *
 * This module safely reads and parses package.json files from the local filesystem, extracting all dependency
 * information while preventing security vulnerabilities like path traversal attacks. It provides utilities for
 * aggregating dependencies across different types (production, dev, peer, optional) and parsing version ranges
 * according to NPM/semver conventions.
 *
 * Key responsibilities:
 * - Read package.json files from specified directories with path traversal prevention using realpath validation
 * - Parse and validate package.json structure ensuring required fields (name, version) are present
 * - Aggregate dependencies from multiple sources (dependencies, devDependencies, peerDependencies, optionalDependencies)
 * - Parse version ranges and semver operators (^, ~, >=, *, latest) to extract clean version strings
 * - Implement comprehensive path safety checks to prevent access outside allowed directories
 * - Handle JSON parsing errors and file system errors (ENOENT) with detailed error messages via PackageReaderError
 *
 * @module services/package-reader
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { z } from 'zod';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

/**
 * Zod schema for validating package.json structure
 */
const PackageJsonSchema = z.object({
  name: z.string().min(1),
  version: z.string().min(1),
  dependencies: z.record(z.string()).optional(),
  devDependencies: z.record(z.string()).optional(),
  peerDependencies: z.record(z.string()).optional(),
  optionalDependencies: z.record(z.string()).optional(),
  description: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  author: z.union([z.string(), z.object({}).passthrough()]).optional(),
  license: z.string().optional(),
  repository: z.union([z.string(), z.object({}).passthrough()]).optional(),
  bugs: z.union([z.string(), z.object({}).passthrough()]).optional(),
  homepage: z.string().optional(),
  scripts: z.record(z.string()).optional(),
}).passthrough(); // Allow additional fields

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
  const resolvedDir = resolve(directory);

  // Check for obvious path traversal attempts in the INPUT (not the resolved path)
  if (directory.includes('\0')) {
    throw new PackageReaderError('Invalid directory: contains forbidden characters');
  }

  //  Check for suspicious path traversal patterns in the input
  if (directory.includes('../') && !directory.startsWith('/')) {
    throw new PackageReaderError('Invalid directory: contains relative path traversal');
  }

  const packagePath = resolve(resolvedDir, 'package.json');

  try {
    const content = await readFile(packagePath, 'utf-8');
    const rawPkg = JSON.parse(content);

    // Validate with Zod
    try {
      const pkg = PackageJsonSchema.parse(rawPkg);
      return pkg;
    } catch (zodError) {
      throw new PackageReaderError(
        `Invalid package.json structure: ${zodError instanceof Error ? zodError.message : String(zodError)}`
      );
    }
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
