import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PackageCache, initializeCache, getCache, resetCache } from '../../src/services/cache.js';

describe('PackageCache', () => {
  beforeEach(() => {
    resetCache();
  });

  describe('constructor', () => {
    it('should create cache with enabled=true', () => {
      const cache = new PackageCache(true, 3600000);
      expect(cache).toBeDefined();
    });

    it('should create cache with enabled=false', () => {
      const cache = new PackageCache(false, 3600000);
      expect(cache).toBeDefined();
    });
  });

  describe('metadata caching', () => {
    it('should store and retrieve metadata when enabled', () => {
      const cache = new PackageCache(true, 3600000);
      const metadata = { name: 'test', version: '1.0.0' };

      cache.setMetadata('test', metadata as any);
      const retrieved = cache.getMetadata('test');

      expect(retrieved).toEqual(metadata);
    });

    it('should return null for non-existent key', () => {
      const cache = new PackageCache(true, 3600000);
      expect(cache.getMetadata('nonexistent')).toBeNull();
    });

    it('should return null when cache disabled', () => {
      const cache = new PackageCache(false, 3600000);
      const metadata = { name: 'test', version: '1.0.0' };

      cache.setMetadata('test', metadata as any);
      const retrieved = cache.getMetadata('test');

      expect(retrieved).toBeNull();
    });

    it('should not store when cache disabled', () => {
      const cache = new PackageCache(false, 3600000);
      cache.setMetadata('test', { name: 'test' } as any);

      const stats = cache.getStats();
      expect(stats.metadataSize).toBe(0);
    });

    it('should expire metadata after TTL', async () => {
      const cache = new PackageCache(true, 100); // 100ms TTL
      cache.setMetadata('test', { name: 'test' } as any);

      expect(cache.getMetadata('test')).not.toBeNull();

      await new Promise(resolve => setTimeout(resolve, 150));

      expect(cache.getMetadata('test')).toBeNull();
    });

    it('should handle multiple packages', () => {
      const cache = new PackageCache(true, 3600000);

      cache.setMetadata('pkg1', { name: 'pkg1' } as any);
      cache.setMetadata('pkg2', { name: 'pkg2' } as any);
      cache.setMetadata('pkg3', { name: 'pkg3' } as any);

      expect(cache.getMetadata('pkg1')).toEqual({ name: 'pkg1' });
      expect(cache.getMetadata('pkg2')).toEqual({ name: 'pkg2' });
      expect(cache.getMetadata('pkg3')).toEqual({ name: 'pkg3' });
    });

    it('should override existing metadata', () => {
      const cache = new PackageCache(true, 3600000);

      cache.setMetadata('test', { name: 'test', version: '1.0.0' } as any);
      cache.setMetadata('test', { name: 'test', version: '2.0.0' } as any);

      const retrieved = cache.getMetadata('test');
      expect(retrieved).toEqual({ name: 'test', version: '2.0.0' });
    });

    it('should support custom TTL per entry', async () => {
      const cache = new PackageCache(true, 3600000);

      cache.setMetadata('short', { name: 'short' } as any, 100);
      cache.setMetadata('long', { name: 'long' } as any, 10000);

      await new Promise(resolve => setTimeout(resolve, 150));

      expect(cache.getMetadata('short')).toBeNull();
      expect(cache.getMetadata('long')).not.toBeNull();
    });
  });

  describe('tree caching', () => {
    it('should store and retrieve tree when enabled', () => {
      const cache = new PackageCache(true, 3600000);
      const tree = { name: 'root', version: '1.0.0', dependencies: [] };

      cache.setTree('root@1.0.0', tree as any);
      const retrieved = cache.getTree('root@1.0.0');

      expect(retrieved).toEqual(tree);
    });

    it('should return null for non-existent tree', () => {
      const cache = new PackageCache(true, 3600000);
      expect(cache.getTree('nonexistent')).toBeNull();
    });

    it('should return null when cache disabled', () => {
      const cache = new PackageCache(false, 3600000);
      const tree = { name: 'root', version: '1.0.0' };

      cache.setTree('root@1.0.0', tree as any);
      expect(cache.getTree('root@1.0.0')).toBeNull();
    });

    it('should expire tree after TTL', async () => {
      const cache = new PackageCache(true, 100);
      cache.setTree('root@1.0.0', { name: 'root' } as any);

      expect(cache.getTree('root@1.0.0')).not.toBeNull();

      await new Promise(resolve => setTimeout(resolve, 150));

      expect(cache.getTree('root@1.0.0')).toBeNull();
    });

    it('should handle multiple trees', () => {
      const cache = new PackageCache(true, 3600000);

      cache.setTree('pkg1@1.0.0', { name: 'pkg1' } as any);
      cache.setTree('pkg2@1.0.0', { name: 'pkg2' } as any);

      expect(cache.getTree('pkg1@1.0.0')).toEqual({ name: 'pkg1' });
      expect(cache.getTree('pkg2@1.0.0')).toEqual({ name: 'pkg2' });
    });
  });

  describe('clear', () => {
    it('should clear all cached metadata', () => {
      const cache = new PackageCache(true, 3600000);

      cache.setMetadata('pkg1', { name: 'pkg1' } as any);
      cache.setMetadata('pkg2', { name: 'pkg2' } as any);

      cache.clear();

      expect(cache.getMetadata('pkg1')).toBeNull();
      expect(cache.getMetadata('pkg2')).toBeNull();
    });

    it('should clear all cached trees', () => {
      const cache = new PackageCache(true, 3600000);

      cache.setTree('pkg1@1.0.0', { name: 'pkg1' } as any);
      cache.setTree('pkg2@1.0.0', { name: 'pkg2' } as any);

      cache.clear();

      expect(cache.getTree('pkg1@1.0.0')).toBeNull();
      expect(cache.getTree('pkg2@1.0.0')).toBeNull();
    });

    it('should reset stats', () => {
      const cache = new PackageCache(true, 3600000);

      cache.setMetadata('pkg1', { name: 'pkg1' } as any);
      cache.getMetadata('pkg1');
      cache.getMetadata('nonexistent');

      cache.clear();

      const stats = cache.getStats();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
      expect(stats.metadataSize).toBe(0);
      expect(stats.treeSize).toBe(0);
    });
  });

  describe('getStats', () => {
    it('should return correct hit/miss counts', () => {
      const cache = new PackageCache(true, 3600000);

      cache.setMetadata('pkg1', { name: 'pkg1' } as any);

      cache.getMetadata('pkg1'); // hit
      cache.getMetadata('pkg1'); // hit
      cache.getMetadata('pkg2'); // miss
      cache.getMetadata('pkg3'); // miss

      const stats = cache.getStats();
      expect(stats.hits).toBe(2);
      expect(stats.misses).toBe(2);
    });

    it('should return correct size', () => {
      const cache = new PackageCache(true, 3600000);

      cache.setMetadata('pkg1', { name: 'pkg1' } as any);
      cache.setMetadata('pkg2', { name: 'pkg2' } as any);
      cache.setTree('tree1', { name: 'tree1' } as any);

      const stats = cache.getStats();
      expect(stats.metadataSize + stats.treeSize).toBe(3);
    });

    it('should return 0 hits/misses initially', () => {
      const cache = new PackageCache(true, 3600000);

      const stats = cache.getStats();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
      expect(stats.metadataSize).toBe(0);
      expect(stats.treeSize).toBe(0);
    });

    it('should not count misses when cache disabled', () => {
      const cache = new PackageCache(false, 3600000);

      cache.setMetadata('pkg1', { name: 'pkg1' } as any);
      cache.getMetadata('pkg1');

      const stats = cache.getStats();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
    });
  });

  describe('cleanupExpired', () => {
    it('should remove expired entries', async () => {
      const cache = new PackageCache(true, 100);

      cache.setMetadata('pkg1', { name: 'pkg1' } as any);
      cache.setMetadata('pkg2', { name: 'pkg2' } as any, 10000);

      await new Promise(resolve => setTimeout(resolve, 150));

      cache.cleanupExpired();

      expect(cache.getMetadata('pkg1')).toBeNull();
      expect(cache.getMetadata('pkg2')).not.toBeNull();
    });

    it('should update size after cleanup', async () => {
      const cache = new PackageCache(true, 100);

      cache.setMetadata('pkg1', { name: 'pkg1' } as any);
      cache.setMetadata('pkg2', { name: 'pkg2' } as any);

      await new Promise(resolve => setTimeout(resolve, 150));

      cache.cleanupExpired();

      const stats = cache.getStats();
      expect(stats.metadataSize).toBe(0);
      expect(stats.treeSize).toBe(0);
    });

    it('should not affect valid entries', () => {
      const cache = new PackageCache(true, 3600000);

      cache.setMetadata('pkg1', { name: 'pkg1' } as any);
      cache.setMetadata('pkg2', { name: 'pkg2' } as any);

      cache.cleanupExpired();

      expect(cache.getMetadata('pkg1')).not.toBeNull();
      expect(cache.getMetadata('pkg2')).not.toBeNull();
    });
  });

  describe('singleton factory', () => {
    it('should initialize cache singleton', () => {
      initializeCache(true, 3600000);
      const cache = getCache();

      expect(cache).toBeDefined();
      expect(cache).toBeInstanceOf(PackageCache);
    });

    it('should return same instance', () => {
      initializeCache(true, 3600000);
      const cache1 = getCache();
      const cache2 = getCache();

      expect(cache1).toBe(cache2);
    });

    it('should reset singleton', () => {
      initializeCache(true, 3600000);
      const cache1 = getCache();

      resetCache();

      initializeCache(true, 3600000);
      const cache2 = getCache();

      expect(cache1).not.toBe(cache2);
    });

    it('should create default instance if called before initialize', () => {
      resetCache();
      const cache = getCache();
      expect(cache).toBeInstanceOf(PackageCache);
    });

    it('should allow re-initialization after reset', () => {
      initializeCache(true, 3600000);
      resetCache();
      initializeCache(false, 1000);

      expect(() => getCache()).not.toThrow();
    });
  });
});
