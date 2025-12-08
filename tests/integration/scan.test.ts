/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { describe, it, expect } from 'vitest';
import { scanDependencies } from '../../src/commands/scan.js';
import { defaultConfig } from '../../src/config/defaults.js';

describe('Scan command integration', () => {
  it('should scan project dependencies', async () => {
    const result = await scanDependencies(defaultConfig);

    expect(result).toBeDefined();
    expect(result.project.name).toBe('package-health-analyzer');
    expect(result.summary.total).toBeGreaterThan(0);
    expect(result.packages.length).toBeGreaterThan(0);
  });

  it('should include package metadata', async () => {
    const result = await scanDependencies(defaultConfig);

    const firstPackage = result.packages[0];
    expect(firstPackage).toBeDefined();
    expect(firstPackage?.package).toBeTruthy();
    expect(firstPackage?.version).toBeTruthy();
    expect(firstPackage?.age).toBeDefined();
    expect(firstPackage?.license).toBeDefined();
    expect(firstPackage?.score).toBeDefined();
  });

  it('should calculate summary correctly', async () => {
    const result = await scanDependencies(defaultConfig);

    expect(result.summary.total).toBe(result.packages.length);
    expect(result.summary.averageScore).toBeGreaterThanOrEqual(0);
    expect(result.summary.averageScore).toBeLessThanOrEqual(100);
    expect(result.summary.riskLevel).toMatch(/^(low|medium|high|critical)$/);
  });

  it('should respect ignore configuration', async () => {
    const config = {
      ...defaultConfig,
      ignore: {
        scopes: [],
        prefixes: [],
        authors: [],
        packages: ['chalk'],
      },
    };

    const result = await scanDependencies(config);

    const hasChalk = result.packages.some((pkg) => pkg.package === 'chalk');
    expect(hasChalk).toBe(false);
  }, 10000);

  it('should include devDependencies when configured', async () => {
    const configWithoutDev = {
      ...defaultConfig,
      includeDevDependencies: false,
    };

    const configWithDev = {
      ...defaultConfig,
      includeDevDependencies: true,
    };

    const resultWithoutDev = await scanDependencies(configWithoutDev);
    const resultWithDev = await scanDependencies(configWithDev);

    expect(resultWithDev.summary.total).toBeGreaterThan(
      resultWithoutDev.summary.total
    );
  });
});
