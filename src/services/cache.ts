/**
 * package-health-analyzer - In-Memory Caching Service
 *
 * This module provides a high-performance in-memory cache for package metadata and dependency trees, significantly
 * reducing API calls to external services (NPM Registry, GitHub) during analysis operations. The cache implements
 * TTL-based expiration, automatic cleanup of stale entries, and comprehensive statistics tracking to monitor cache
 * effectiveness. It follows a singleton pattern for global access across the application.
 *
 * Key responsibilities:
 * - Cache package metadata from NPM Registry with configurable TTL (default 1 hour) to minimize network requests
 * - Store complex dependency tree structures to avoid expensive recursive API calls during tree traversal
 * - Implement TTL-based cache invalidation with automatic expiration checking on access
 * - Track cache performance metrics (hits, misses, hit rate) for observability and optimization
 * - Provide manual cache cleanup operations (cleanupExpired, clear) for memory management
 * - Support enabling/disabling caching at runtime for testing or debugging scenarios
 * - Maintain separate caches for metadata vs dependency trees for optimal memory utilization
 *
 * @module services/cache
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import type { PackageMetadata } from '../types/index.js';
import type { DependencyTreeNode } from './dependency-tree.js';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * In-memory cache for package metadata and dependency trees
 */
export class PackageCache {
  private metadataCache = new Map<string, CacheEntry<PackageMetadata>>();
  private treeCache = new Map<string, CacheEntry<DependencyTreeNode>>();
  private enabled: boolean;
  private defaultTtl: number;
  private hits = 0;
  private misses = 0;

  constructor(enabled = true, ttl = 3600000) {
    this.enabled = enabled;
    this.defaultTtl = ttl;
  }

  /**
   * Get package metadata from cache
   */
  getMetadata(packageName: string): PackageMetadata | null {
    if (!this.enabled) {
      return null;
    }

    const entry = this.metadataCache.get(packageName);
    if (!entry) {
      this.misses++;
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.metadataCache.delete(packageName);
      this.misses++;
      return null;
    }

    this.hits++;
    return entry.data;
  }

  /**
   * Store package metadata in cache
   */
  setMetadata(packageName: string, metadata: PackageMetadata, ttl?: number): void {
    if (!this.enabled) {
      return;
    }

    this.metadataCache.set(packageName, {
      data: metadata,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTtl,
    });
  }

  /**
   * Get dependency tree from cache
   */
  getTree(cacheKey: string): DependencyTreeNode | null {
    if (!this.enabled) {
      return null;
    }

    const entry = this.treeCache.get(cacheKey);
    if (!entry) {
      this.misses++;
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.treeCache.delete(cacheKey);
      this.misses++;
      return null;
    }

    this.hits++;
    return entry.data;
  }

  /**
   * Store dependency tree in cache
   */
  setTree(cacheKey: string, tree: DependencyTreeNode, ttl?: number): void {
    if (!this.enabled) {
      return;
    }

    this.treeCache.set(cacheKey, {
      data: tree,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTtl,
    });
  }

  /**
   * Clear all caches
   */
  clear(): void {
    this.metadataCache.clear();
    this.treeCache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      hits: this.hits,
      misses: this.misses,
      hitRate: this.hits + this.misses > 0 ? this.hits / (this.hits + this.misses) : 0,
      metadataSize: this.metadataCache.size,
      treeSize: this.treeCache.size,
      totalSize: this.metadataCache.size + this.treeCache.size,
    };
  }

  /**
   * Clean up expired entries
   */
  cleanupExpired(): void {
    const now = Date.now();

    // Clean metadata cache
    for (const [key, entry] of this.metadataCache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.metadataCache.delete(key);
      }
    }

    // Clean tree cache
    for (const [key, entry] of this.treeCache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.treeCache.delete(key);
      }
    }
  }
}

// Singleton instance
let cacheInstance: PackageCache | null = null;

/**
 * Initialize the global cache instance
 */
export function initializeCache(enabled = true, ttl = 3600000): PackageCache {
  if (!cacheInstance) {
    cacheInstance = new PackageCache(enabled, ttl);
  }
  return cacheInstance;
}

/**
 * Get the global cache instance
 */
export function getCache(): PackageCache {
  if (!cacheInstance) {
    cacheInstance = new PackageCache();
  }
  return cacheInstance;
}

/**
 * Reset the global cache instance (mainly for testing)
 */
export function resetCache(): void {
  if (cacheInstance) {
    cacheInstance.clear();
  }
  cacheInstance = null;
}
