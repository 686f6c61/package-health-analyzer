/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { describe, it, expect } from 'vitest';
import { checkPackage } from '../../src/commands/check.js';
import { defaultConfig } from '../../src/config/defaults.js';

describe('Check command integration', () => {
  it('should check a well-maintained package', async () => {
    const result = await checkPackage('chalk', defaultConfig);

    expect(result.package).toBe('chalk');
    expect(result.version).toBeTruthy();
    expect(result.score.overall).toBeGreaterThan(80);
    expect(result.license.category).toBe('commercial-friendly');
  });

  it('should handle any package correctly', async () => {
    const result = await checkPackage('semver', defaultConfig);

    expect(result.package).toBe('semver');
    expect(result.version).toBeTruthy();
    expect(result.score.overall).toBeGreaterThanOrEqual(0);
    expect(result.score.overall).toBeLessThanOrEqual(100);
  }, 10000);

  it('should analyze license correctly', async () => {
    const result = await checkPackage('chalk', defaultConfig);

    expect(result.license.license).toBe('MIT');
    expect(result.license.spdxId).toBe('MIT');
    expect(result.license.blueOakRating).toBe('gold');
    expect(result.license.commercialUse).toBe(true);
  });

  it('should calculate health score', async () => {
    const result = await checkPackage('chalk', defaultConfig);

    expect(result.score.overall).toBeGreaterThanOrEqual(0);
    expect(result.score.overall).toBeLessThanOrEqual(100);
    expect(result.score.rating).toMatch(/^(excellent|good|fair|poor)$/);
  });

  it('should handle non-existent packages', async () => {
    await expect(
      checkPackage('this-package-definitely-does-not-exist-12345', defaultConfig)
    ).rejects.toThrow();
  });
});
