/**
 * package-health-analyzer - Dependency Tree Builder and Analyzer
 *
 * This module constructs comprehensive dependency trees by recursively resolving transitive dependencies from the
 * NPM Registry. It implements sophisticated algorithms for detecting circular dependencies, tracking duplicate
 * package versions across the tree, and managing depth limits. The builder uses parallel fetching with concurrency
 * control (p-limit) and integrates with the caching service to optimize performance during large tree traversals.
 *
 * Key responsibilities:
 * - Build complete dependency trees recursively from package.json dependencies with configurable depth limits
 * - Detect circular dependencies by tracking package paths and preventing infinite recursion loops
 * - Identify duplicate packages installed at different versions across the dependency tree
 * - Implement parallel dependency resolution with concurrency limiting (10 concurrent fetches) for performance
 * - Track visited packages to avoid redundant NPM Registry API calls for already-analyzed dependencies
 * - Generate tree summaries with metrics (total nodes, unique packages, max depth, circular count, duplicates)
 * - Support configuration options (analyzeTransitive, maxDepth, detectCircular, stopOnCircular) for flexible analysis
 * - Integrate with PackageCache to minimize API requests and improve analysis speed
 *
 * @module services/dependency-tree
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import pLimit from 'p-limit';
import { fetchPackageMetadata } from './npm-registry.js';
import { getCache } from './cache.js';
import type { DependencyTreeConfig } from '../types/config.js';

export interface DependencyTreeNode {
  name: string;
  version: string;
  depth: number;
  parent: string | null;
  dependencies: DependencyTreeNode[];
  isCircular: boolean;
  isDuplicate: boolean;
  duplicateVersions?: string[];
  circularPath?: string[];
}

export interface DependencyTreeSummary {
  totalNodes: number;
  uniquePackages: number;
  maxDepth: number;
  circularDependencies: number;
  duplicatePackages: number;
}

/**
 * Build a complete dependency tree
 */
export class DependencyTreeBuilder {
  private config: DependencyTreeConfig;
  private visited = new Map<string, Set<string>>();
  private packageVersions = new Map<string, Set<string>>();
  private limit = pLimit(3); // Reduced to 3 for very large dependency trees like express

  constructor(config: DependencyTreeConfig) {
    this.config = config;
  }

  /**
   * Build the complete dependency tree
   */
  async buildTree(
    rootName: string,
    rootVersion: string,
    dependencies: Map<string, string>
  ): Promise<DependencyTreeNode & { totalNodes: number }> {
    this.visited.clear();
    this.packageVersions.clear();

    const root: DependencyTreeNode = {
      name: rootName,
      version: rootVersion,
      depth: 0,
      parent: null,
      dependencies: [],
      isCircular: false,
      isDuplicate: false,
    };

    // Track root package version
    this.trackPackageVersion(rootName, rootVersion);

    // Build children
    await this.buildChildren(root, dependencies, []);

    // Calculate total nodes
    const totalNodes = this.countNodes(root);

    return { ...root, totalNodes };
  }

  /**
   * Build children for a node
   */
  private async buildChildren(
    parent: DependencyTreeNode,
    dependencies: Map<string, string>,
    path: string[]
  ): Promise<void> {
    if (!this.config.analyzeTransitive) {
      return;
    }

    // Check max depth
    if (this.config.maxDepth && this.config.maxDepth > 0 && parent.depth >= this.config.maxDepth) {
      return;
    }

    const currentPath = [...path, `${parent.name}@${parent.version}`];

    // Fetch dependencies in parallel (no p-limit wrapper to avoid deadlock in recursion)
    // p-limit is now applied only to fetchWithCache to limit actual network requests
    const childPromises = Array.from(dependencies.entries()).map(async ([name, versionRange]) => {

      try {
        // Check circular dependency
        const isCircular = this.isCircular(name, currentPath);

        if (isCircular && this.config.detectCircular) {
          if (this.config.stopOnCircular) {
            return null;
          }
        }

        // Resolve version
        const metadata = await this.fetchWithCache(name);
        const resolvedVersion = this.resolveVersion(metadata, versionRange);

        if (!resolvedVersion) {
          return null;
        }

        // Check if already visited this exact package@version
        if (this.hasVisited(name, resolvedVersion)) {
          // Already processed - return lightweight node without recursion
          const isDuplicate = this.isDuplicateVersion(name, resolvedVersion);
          return {
            name,
            version: resolvedVersion,
            depth: parent.depth + 1,
            parent: parent.name,
            dependencies: [],
            isCircular,
            isDuplicate,
            duplicateVersions: isDuplicate ? Array.from(this.packageVersions.get(name) || []) : undefined,
            circularPath: isCircular ? currentPath : undefined,
          };
        }

        // Mark as visited IMMEDIATELY to prevent race conditions
        // This MUST happen before buildChildren to avoid infinite loops
        this.markVisited(name, resolvedVersion);
        this.trackPackageVersion(name, resolvedVersion);

        // Check for duplicate versions
        const isDuplicate = this.isDuplicateVersion(name, resolvedVersion);

        // Create child node
        const child: DependencyTreeNode = {
          name,
          version: resolvedVersion,
          depth: parent.depth + 1,
          parent: parent.name,
          dependencies: [],
          isCircular,
          isDuplicate,
          duplicateVersions: isDuplicate ? Array.from(this.packageVersions.get(name) || []) : undefined,
          circularPath: isCircular ? currentPath : undefined,
        };

        // Recursively build grandchildren if not circular
        if (!isCircular) {
          const childDeps = this.getDependencies(metadata, resolvedVersion);
          if (childDeps.size > 0) {
            await this.buildChildren(child, childDeps, currentPath);
          }
        }

        return child;
      } catch {
        // Silently skip failed dependencies
        return null;
      }
    });

    // Use Promise.allSettled instead of Promise.all to handle individual timeouts better
    // This prevents one hanging promise from blocking all others
    // Each individual promise already has a 15s timeout via fetchWithCache
    const results = await Promise.allSettled(childPromises);

    const children: DependencyTreeNode[] = results
      .filter((result): result is PromiseFulfilledResult<DependencyTreeNode> =>
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value);

    parent.dependencies = children;
  }

  /**
   * Fetch package with caching and timeout
   * p-limit is applied here to limit concurrent network requests
   */
  private async fetchWithCache(packageName: string) {
    const cache = getCache();
    const cached = cache.getMetadata(packageName);
    if (cached) {
      return cached;
    }

    // Apply p-limit to the actual fetch operation
    return this.limit(async () => {
      // Add timeout to prevent hanging on individual packages
      const timeoutMs = 15000; // 15 second timeout per package
      let timeoutId: NodeJS.Timeout | null = null;

      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error(`Timeout fetching ${packageName} after ${timeoutMs}ms`));
        }, timeoutMs);
      });

      try {
        const metadata = await Promise.race([
          fetchPackageMetadata(packageName),
          timeoutPromise
        ]) as any;

        // Clear timeout on success
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        cache.setMetadata(packageName, metadata);
        return metadata;
      } catch (error) {
        // Clear timeout on error
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        // If timeout or other error, throw to be caught by caller
        throw error;
      }
    });
  }

  /**
   * Check if package creates circular dependency
   */
  private isCircular(packageName: string, path: string[]): boolean {
    return path.some(p => p.startsWith(`${packageName}@`));
  }

  /**
   * Mark package@version as visited
   */
  private markVisited(packageName: string, version: string): void {
    if (!this.visited.has(packageName)) {
      this.visited.set(packageName, new Set());
    }
    this.visited.get(packageName)!.add(version);
  }

  /**
   * Check if package@version was visited
   */
  private hasVisited(packageName: string, version: string): boolean {
    return this.visited.get(packageName)?.has(version) || false;
  }

  /**
   * Track package version
   */
  private trackPackageVersion(packageName: string, version: string): void {
    if (!this.packageVersions.has(packageName)) {
      this.packageVersions.set(packageName, new Set());
    }
    this.packageVersions.get(packageName)!.add(version);
  }

  /**
   * Check if this version is a duplicate
   */
  private isDuplicateVersion(packageName: string, version: string): boolean {
    const versions = this.packageVersions.get(packageName);
    return versions ? versions.size > 1 || !versions.has(version) : false;
  }

  /**
   * Resolve semver range to exact version
   */
  private resolveVersion(metadata: any, versionRange: string): string | null {
    const distTags = metadata['dist-tags'];
    const versions = metadata.versions || {};

    // Handle exact versions
    if (versions[versionRange]) {
      return versionRange;
    }

    // Handle tags
    if (versionRange === 'latest' || versionRange === '*' || versionRange === '') {
      return distTags?.latest || Object.keys(versions).pop() || null;
    }

    // For ranges, return latest for now (simplified)
    return distTags?.latest || Object.keys(versions).pop() || null;
  }

  /**
   * Get dependencies from metadata
   */
  private getDependencies(metadata: any, version: string): Map<string, string> {
    const versionData = metadata.versions?.[version];
    if (!versionData) {
      // Fallback: try direct dependencies on metadata
      const deps = metadata.dependencies || {};
      return new Map(Object.entries(deps));
    }

    const deps = versionData.dependencies || {};
    return new Map(Object.entries(deps));
  }

  /**
   * Count total nodes in tree
   */
  private countNodes(node: DependencyTreeNode): number {
    let count = 1;
    for (const child of node.dependencies) {
      count += this.countNodes(child);
    }
    return count;
  }
}

/**
 * Collect unique packages from tree
 */
export function collectUniquePackages(tree: DependencyTreeNode): Map<string, string> {
  const packages = new Map<string, string>();
  
  function traverse(node: DependencyTreeNode) {
    packages.set(node.name, node.version);
    for (const child of node.dependencies) {
      traverse(child);
    }
  }
  
  traverse(tree);
  return packages;
}

/**
 * Generate tree summary
 */
export function generateTreeSummary(tree: DependencyTreeNode & { totalNodes: number }): DependencyTreeSummary {
  const uniquePackages = collectUniquePackages(tree);
  let maxDepth = 0;
  let circularCount = 0;
  let duplicateCount = 0;

  function traverse(node: DependencyTreeNode) {
    if (node.depth > maxDepth) {
      maxDepth = node.depth;
    }
    if (node.isCircular) {
      circularCount++;
    }
    if (node.isDuplicate) {
      duplicateCount++;
    }
    for (const child of node.dependencies) {
      traverse(child);
    }
  }

  traverse(tree);

  return {
    totalNodes: tree.totalNodes,
    uniquePackages: uniquePackages.size,
    maxDepth,
    circularDependencies: circularCount,
    duplicatePackages: duplicateCount,
  };
}
