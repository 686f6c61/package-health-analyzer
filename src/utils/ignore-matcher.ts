/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import type { IgnoreConfig } from '../types/config.js';
import type { PackageMetadata } from '../types/index.js';

/**
 * Check if a package name matches a pattern with wildcards
 */
function matchesPattern(name: string, pattern: string): boolean {
  // Convert glob pattern to regex
  const regexPattern = pattern
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&') // Escape special chars
    .replace(/\*/g, '.*'); // Convert * to .*

  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(name);
}

/**
 * Check if a package matches scope ignore rules
 */
function matchesScope(name: string, scopes: string[]): boolean {
  return scopes.some((scope) => matchesPattern(name, scope));
}

/**
 * Check if a package matches prefix ignore rules
 */
function matchesPrefix(name: string, prefixes: string[]): boolean {
  return prefixes.some((prefix) => matchesPattern(name, prefix));
}

/**
 * Check if a package matches author ignore rules
 */
function matchesAuthor(
  metadata: PackageMetadata,
  authors: string[]
): boolean {
  if (authors.length === 0) {
    return false;
  }

  // Extract author information
  const authorString =
    typeof metadata.author === 'string'
      ? metadata.author
      : metadata.author?.name || metadata.author?.email || '';

  const maintainerStrings =
    metadata.maintainers?.map((m) => m.name || m.email || '') || [];

  const allAuthors = [authorString, ...maintainerStrings]
    .filter(Boolean)
    .map((a) => a.toLowerCase());

  // Check if any author matches
  return authors.some((ignoreAuthor) => {
    const normalizedIgnore = ignoreAuthor.toLowerCase();
    return allAuthors.some((author) => author.includes(normalizedIgnore));
  });
}

/**
 * Check if a package should be ignored based on configuration
 */
export function shouldIgnorePackage(
  name: string,
  metadata: PackageMetadata,
  ignoreConfig: IgnoreConfig
): boolean {
  // Check exact package name match
  if (ignoreConfig.packages.includes(name)) {
    return true;
  }

  // Check scope match
  if (matchesScope(name, ignoreConfig.scopes)) {
    return true;
  }

  // Check prefix match
  if (matchesPrefix(name, ignoreConfig.prefixes)) {
    return true;
  }

  // Check author match
  if (matchesAuthor(metadata, ignoreConfig.authors)) {
    return true;
  }

  return false;
}

/**
 * Get ignore reason for a package
 */
export function getIgnoreReason(
  name: string,
  metadata: PackageMetadata,
  ignoreConfig: IgnoreConfig
): string | undefined {
  if (ignoreConfig.packages.includes(name)) {
    return ignoreConfig.reasons?.[name] || 'Explicitly ignored';
  }

  const matchedScope = ignoreConfig.scopes.find((scope) =>
    matchesPattern(name, scope)
  );
  if (matchedScope) {
    return (
      ignoreConfig.reasons?.[matchedScope] || `Matches scope: ${matchedScope}`
    );
  }

  const matchedPrefix = ignoreConfig.prefixes.find((prefix) =>
    matchesPattern(name, prefix)
  );
  if (matchedPrefix) {
    return (
      ignoreConfig.reasons?.[matchedPrefix] ||
      `Matches prefix: ${matchedPrefix}`
    );
  }

  if (matchesAuthor(metadata, ignoreConfig.authors)) {
    return 'Author is in ignore list';
  }

  return undefined;
}
