/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  DependencyTreeBuilder,
  collectUniquePackages,
  generateTreeSummary,
} from '../../src/services/dependency-tree.js';
import type { DependencyTreeConfig } from '../../src/types/config.js';
import * as npmRegistry from '../../src/services/npm-registry.js';
import * as cache from '../../src/services/cache.js';

// Mock dependencies
vi.mock('../../src/services/npm-registry.js');
vi.mock('../../src/services/cache.js');

describe('DependencyTreeBuilder', () => {
  let builder: DependencyTreeBuilder;
  const defaultConfig: DependencyTreeConfig = {
    enabled: true,
    maxDepth: 5,
    analyzeTransitive: true,
    detectCircular: true,
    detectDuplicates: true,
    stopOnCircular: false,
    cacheTrees: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    builder = new DependencyTreeBuilder(defaultConfig);

    // Mock cache
    vi.mocked(cache.getCache).mockReturnValue({
      getMetadata: vi.fn().mockReturnValue(null),
      setMetadata: vi.fn(),
      getVulnerabilities: vi.fn(),
      setVulnerabilities: vi.fn(),
    } as any);
  });

  describe('buildTree - Transitive Dependencies', () => {
    it('should build tree with level 1 dependencies', async () => {
      // Mock package data
      const rootMetadata = {
        name: 'root-pkg',
        version: '1.0.0',
        'dist-tags': { latest: '1.0.0' },
        versions: {
          '1.0.0': {
            dependencies: {
              'dep-a': '^1.0.0',
              'dep-b': '^2.0.0',
            },
          },
        },
      };

      const depAMetadata = {
        name: 'dep-a',
        'dist-tags': { latest: '1.2.3' },
        versions: {
          '1.2.3': {
            dependencies: {},
          },
        },
      };

      const depBMetadata = {
        name: 'dep-b',
        'dist-tags': { latest: '2.5.0' },
        versions: {
          '2.5.0': {
            dependencies: {},
          },
        },
      };

      vi.mocked(npmRegistry.fetchPackageMetadata)
        .mockResolvedValueOnce(depAMetadata as any)
        .mockResolvedValueOnce(depBMetadata as any);

      const dependencies = new Map([
        ['dep-a', '^1.0.0'],
        ['dep-b', '^2.0.0'],
      ]);

      const tree = await builder.buildTree('root-pkg', '1.0.0', dependencies);

      expect(tree.name).toBe('root-pkg');
      expect(tree.version).toBe('1.0.0');
      expect(tree.depth).toBe(0);
      expect(tree.dependencies).toHaveLength(2);
      expect(tree.dependencies[0].name).toBe('dep-a');
      expect(tree.dependencies[0].version).toBe('1.2.3');
      expect(tree.dependencies[1].name).toBe('dep-b');
      expect(tree.dependencies[1].version).toBe('2.5.0');
    });

    it('should build tree with level 2 transitive dependencies', async () => {
      const depAMetadata = {
        name: 'dep-a',
        'dist-tags': { latest: '1.0.0' },
        versions: {
          '1.0.0': {
            dependencies: {
              'dep-a-child': '^1.0.0',
            },
          },
        },
      };

      const depAChildMetadata = {
        name: 'dep-a-child',
        'dist-tags': { latest: '1.5.0' },
        versions: {
          '1.5.0': {
            dependencies: {},
          },
        },
      };

      vi.mocked(npmRegistry.fetchPackageMetadata)
        .mockResolvedValueOnce(depAMetadata as any)
        .mockResolvedValueOnce(depAChildMetadata as any);

      const dependencies = new Map([['dep-a', '^1.0.0']]);

      const tree = await builder.buildTree('root-pkg', '1.0.0', dependencies);

      expect(tree.dependencies).toHaveLength(1);
      expect(tree.dependencies[0].name).toBe('dep-a');
      expect(tree.dependencies[0].dependencies).toHaveLength(1);
      expect(tree.dependencies[0].dependencies[0].name).toBe('dep-a-child');
      expect(tree.dependencies[0].dependencies[0].version).toBe('1.5.0');
      expect(tree.dependencies[0].dependencies[0].depth).toBe(2);
    });

    it('should respect maxDepth configuration', async () => {
      const configWithMaxDepth: DependencyTreeConfig = {
        ...defaultConfig,
        maxDepth: 1,
      };
      builder = new DependencyTreeBuilder(configWithMaxDepth);

      const depAMetadata = {
        name: 'dep-a',
        'dist-tags': { latest: '1.0.0' },
        versions: {
          '1.0.0': {
            dependencies: {
              'deep-dep': '^1.0.0',
            },
          },
        },
      };

      vi.mocked(npmRegistry.fetchPackageMetadata).mockResolvedValue(
        depAMetadata as any
      );

      const dependencies = new Map([['dep-a', '^1.0.0']]);

      const tree = await builder.buildTree('root-pkg', '1.0.0', dependencies);

      // Should have dep-a at depth 1
      expect(tree.dependencies).toHaveLength(1);
      expect(tree.dependencies[0].name).toBe('dep-a');
      // But dep-a should have NO children because it's at maxDepth
      expect(tree.dependencies[0].dependencies).toHaveLength(0);
    });

    it('should skip transitive analysis when analyzeTransitive is false', async () => {
      const configNoTransitive: DependencyTreeConfig = {
        ...defaultConfig,
        analyzeTransitive: false,
      };
      builder = new DependencyTreeBuilder(configNoTransitive);

      const dependencies = new Map([['dep-a', '^1.0.0']]);

      const tree = await builder.buildTree('root-pkg', '1.0.0', dependencies);

      // Should not fetch any packages when analyzeTransitive is false
      expect(npmRegistry.fetchPackageMetadata).not.toHaveBeenCalled();
      expect(tree.dependencies).toHaveLength(0);
    });
  });

  describe('buildTree - Circular Dependencies', () => {
    it('should detect circular dependencies', async () => {
      const depAMetadata = {
        name: 'dep-a',
        'dist-tags': { latest: '1.0.0' },
        versions: {
          '1.0.0': {
            dependencies: {
              'dep-b': '^1.0.0',
            },
          },
        },
      };

      const depBMetadata = {
        name: 'dep-b',
        'dist-tags': { latest: '1.0.0' },
        versions: {
          '1.0.0': {
            dependencies: {
              'dep-a': '^1.0.0', // Circular!
            },
          },
        },
      };

      vi.mocked(npmRegistry.fetchPackageMetadata)
        .mockImplementation(async (name: string) => {
          if (name === 'dep-a') return depAMetadata as any;
          if (name === 'dep-b') return depBMetadata as any;
          throw new Error('Unknown package');
        });

      const dependencies = new Map([['dep-a', '^1.0.0']]);

      const tree = await builder.buildTree('root-pkg', '1.0.0', dependencies);

      // Find the circular node
      const depA = tree.dependencies[0];
      const depB = depA.dependencies[0];
      const circularDepA = depB.dependencies.find((d) => d.name === 'dep-a');

      expect(circularDepA).toBeDefined();
      expect(circularDepA?.isCircular).toBe(true);
      expect(circularDepA?.circularPath).toBeDefined();
      expect(circularDepA?.dependencies).toHaveLength(0);
    });

    it('should stop on circular when stopOnCircular is true', async () => {
      const configStopOnCircular: DependencyTreeConfig = {
        ...defaultConfig,
        stopOnCircular: true,
      };
      builder = new DependencyTreeBuilder(configStopOnCircular);

      const depAMetadata = {
        name: 'dep-a',
        'dist-tags': { latest: '1.0.0' },
        versions: {
          '1.0.0': {
            dependencies: {
              'root-pkg': '^1.0.0', // Circular to root
            },
          },
        },
      };

      vi.mocked(npmRegistry.fetchPackageMetadata).mockResolvedValue(
        depAMetadata as any
      );

      const dependencies = new Map([['dep-a', '^1.0.0']]);

      const tree = await builder.buildTree('root-pkg', '1.0.0', dependencies);

      // dep-a should be fetched but circular root-pkg should not be added
      expect(tree.dependencies).toHaveLength(1);
      expect(tree.dependencies[0].name).toBe('dep-a');
      expect(tree.dependencies[0].dependencies).toHaveLength(0);
    });
  });

  describe('buildTree - Duplicate Detection', () => {
    it('should detect duplicate package versions', async () => {
      // Root has dep-a@1.0.0 and dep-b
      // dep-b also depends on dep-a but @2.0.0
      const depAMetadata1 = {
        name: 'dep-a',
        'dist-tags': { latest: '1.0.0' },
        versions: {
          '1.0.0': { dependencies: {} },
        },
      };

      const depBMetadata = {
        name: 'dep-b',
        'dist-tags': { latest: '1.0.0' },
        versions: {
          '1.0.0': {
            dependencies: {
              'dep-a': '^2.0.0',
            },
          },
        },
      };

      const depAMetadata2 = {
        name: 'dep-a',
        'dist-tags': { latest: '2.0.0' },
        versions: {
          '2.0.0': { dependencies: {} },
        },
      };

      let depACallCount = 0;
      vi.mocked(npmRegistry.fetchPackageMetadata).mockImplementation(
        async (name: string) => {
          if (name === 'dep-a') {
            depACallCount++;
            return (depACallCount === 1
              ? depAMetadata1
              : depAMetadata2) as any;
          }
          if (name === 'dep-b') return depBMetadata as any;
          throw new Error('Unknown package');
        }
      );

      const dependencies = new Map([
        ['dep-a', '^1.0.0'],
        ['dep-b', '^1.0.0'],
      ]);

      const tree = await builder.buildTree('root-pkg', '1.0.0', dependencies);

      // Find the second dep-a (under dep-b)
      const depB = tree.dependencies.find((d) => d.name === 'dep-b');
      const secondDepA = depB?.dependencies.find((d) => d.name === 'dep-a');

      expect(secondDepA).toBeDefined();
      expect(secondDepA?.isDuplicate).toBe(true);
      expect(secondDepA?.duplicateVersions).toContain('1.0.0');
      expect(secondDepA?.duplicateVersions).toContain('2.0.0');
    });
  });

  describe('buildTree - Performance', () => {
    it('should complete within reasonable time for medium-sized tree', async () => {
      // Create a tree with 20 packages at depth 3
      const mockMetadata = (name: string, hasDeps: boolean) => ({
        name,
        'dist-tags': { latest: '1.0.0' },
        versions: {
          '1.0.0': {
            dependencies: hasDeps
              ? {
                  [`${name}-child-1`]: '^1.0.0',
                  [`${name}-child-2`]: '^1.0.0',
                }
              : {},
          },
        },
      });

      vi.mocked(npmRegistry.fetchPackageMetadata).mockImplementation(
        async (name: string) => {
          // Only create children up to depth 2
          const hasChildren = !name.includes('child-');
          return mockMetadata(name, hasChildren) as any;
        }
      );

      const dependencies = new Map([
        ['dep-1', '^1.0.0'],
        ['dep-2', '^1.0.0'],
        ['dep-3', '^1.0.0'],
      ]);

      const startTime = Date.now();
      const tree = await builder.buildTree('root-pkg', '1.0.0', dependencies);
      const duration = Date.now() - startTime;

      // Should complete in less than 5 seconds for this small tree
      expect(duration).toBeLessThan(5000);
      expect(tree.totalNodes).toBeGreaterThan(3);
    }, 10000); // 10 second timeout for this test
  });

  describe('buildTree - Error Handling', () => {
    it('should skip packages that fail to fetch', async () => {
      vi.mocked(npmRegistry.fetchPackageMetadata)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          name: 'dep-b',
          'dist-tags': { latest: '1.0.0' },
          versions: { '1.0.0': { dependencies: {} } },
        } as any);

      const dependencies = new Map([
        ['dep-a', '^1.0.0'],
        ['dep-b', '^1.0.0'],
      ]);

      const tree = await builder.buildTree('root-pkg', '1.0.0', dependencies);

      // Should only have dep-b since dep-a failed
      expect(tree.dependencies).toHaveLength(1);
      expect(tree.dependencies[0].name).toBe('dep-b');
    });

    it('should handle packages with no resolved version', async () => {
      vi.mocked(npmRegistry.fetchPackageMetadata).mockResolvedValue({
        name: 'dep-a',
        'dist-tags': {},
        versions: {},
      } as any);

      const dependencies = new Map([['dep-a', '^1.0.0']]);

      const tree = await builder.buildTree('root-pkg', '1.0.0', dependencies);

      // Should have no children since version couldn't be resolved
      expect(tree.dependencies).toHaveLength(0);
    });
  });

  describe('collectUniquePackages', () => {
    it('should collect all unique packages from tree', () => {
      const tree = {
        name: 'root',
        version: '1.0.0',
        depth: 0,
        parent: null,
        dependencies: [
          {
            name: 'dep-a',
            version: '1.0.0',
            depth: 1,
            parent: 'root',
            dependencies: [],
            isCircular: false,
            isDuplicate: false,
          },
          {
            name: 'dep-b',
            version: '2.0.0',
            depth: 1,
            parent: 'root',
            dependencies: [
              {
                name: 'dep-a',
                version: '1.0.0',
                depth: 2,
                parent: 'dep-b',
                dependencies: [],
                isCircular: false,
                isDuplicate: true,
              },
            ],
            isCircular: false,
            isDuplicate: false,
          },
        ],
        isCircular: false,
        isDuplicate: false,
      };

      const packages = collectUniquePackages(tree);

      expect(packages.size).toBe(3); // root, dep-a, dep-b
      expect(packages.get('root')).toBe('1.0.0');
      expect(packages.get('dep-a')).toBe('1.0.0');
      expect(packages.get('dep-b')).toBe('2.0.0');
    });
  });

  describe('generateTreeSummary', () => {
    it('should generate accurate summary statistics', () => {
      const tree = {
        name: 'root',
        version: '1.0.0',
        depth: 0,
        parent: null,
        totalNodes: 5,
        dependencies: [
          {
            name: 'dep-a',
            version: '1.0.0',
            depth: 1,
            parent: 'root',
            dependencies: [
              {
                name: 'dep-c',
                version: '1.0.0',
                depth: 2,
                parent: 'dep-a',
                dependencies: [],
                isCircular: false,
                isDuplicate: false,
              },
            ],
            isCircular: false,
            isDuplicate: false,
          },
          {
            name: 'dep-b',
            version: '2.0.0',
            depth: 1,
            parent: 'root',
            dependencies: [
              {
                name: 'dep-a',
                version: '1.5.0',
                depth: 2,
                parent: 'dep-b',
                dependencies: [],
                isCircular: false,
                isDuplicate: true,
              },
            ],
            isCircular: false,
            isDuplicate: false,
          },
        ],
        isCircular: false,
        isDuplicate: false,
      };

      const summary = generateTreeSummary(tree);

      expect(summary.totalNodes).toBe(5);
      expect(summary.uniquePackages).toBe(4); // root, dep-a, dep-b, dep-c
      expect(summary.maxDepth).toBe(2);
      expect(summary.circularDependencies).toBe(0);
      expect(summary.duplicatePackages).toBe(1); // dep-a appears twice with different versions
    });

    it('should count circular dependencies correctly', () => {
      const tree = {
        name: 'root',
        version: '1.0.0',
        depth: 0,
        parent: null,
        totalNodes: 3,
        dependencies: [
          {
            name: 'dep-a',
            version: '1.0.0',
            depth: 1,
            parent: 'root',
            dependencies: [
              {
                name: 'root',
                version: '1.0.0',
                depth: 2,
                parent: 'dep-a',
                dependencies: [],
                isCircular: true,
                isDuplicate: false,
                circularPath: ['root@1.0.0'],
              },
            ],
            isCircular: false,
            isDuplicate: false,
          },
        ],
        isCircular: false,
        isDuplicate: false,
      };

      const summary = generateTreeSummary(tree);

      expect(summary.circularDependencies).toBe(1);
    });
  });
});
