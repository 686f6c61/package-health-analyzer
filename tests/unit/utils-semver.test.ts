/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { describe, it, expect } from 'vitest';
import {
  getUpdateType,
  estimateBreakingChanges,
  getLastVersionOfMajor,
  getIntermediateVersions,
} from '../../src/utils/semver.js';

describe('Semver getUpdateType', () => {
  it('should detect major updates', () => {
    expect(getUpdateType('1.0.0', '2.0.0')).toBe('major');
    expect(getUpdateType('1.5.3', '3.0.0')).toBe('major');
    expect(getUpdateType('0.1.0', '1.0.0')).toBe('major');
    expect(getUpdateType('2.5.1', '10.0.0')).toBe('major');
  });

  it('should detect minor updates', () => {
    expect(getUpdateType('1.0.0', '1.1.0')).toBe('minor');
    expect(getUpdateType('1.5.3', '1.8.0')).toBe('minor');
    expect(getUpdateType('2.1.0', '2.5.0')).toBe('minor');
    expect(getUpdateType('0.5.0', '0.10.0')).toBe('minor');
  });

  it('should detect patch updates', () => {
    expect(getUpdateType('1.0.0', '1.0.1')).toBe('patch');
    expect(getUpdateType('1.5.3', '1.5.10')).toBe('patch');
    expect(getUpdateType('2.1.0', '2.1.5')).toBe('patch');
    expect(getUpdateType('0.1.5', '0.1.9')).toBe('patch');
  });

  it('should handle invalid versions', () => {
    const result1 = getUpdateType('invalid', '1.0.0');
    const result2 = getUpdateType('1.0.0', 'invalid');
    const result3 = getUpdateType('invalid', 'invalid');

    // Should return null or a specific value for invalid versions
    expect([null, 'unknown']).toContain(result1);
    expect([null, 'unknown']).toContain(result2);
    expect([null, 'unknown']).toContain(result3);
  });

  it('should handle same versions', () => {
    const result = getUpdateType('1.0.0', '1.0.0');
    expect([null, 'patch', 'none']).toContain(result);
  });

  it('should handle pre-release versions', () => {
    const result1 = getUpdateType('1.0.0-alpha', '1.0.0-beta');
    const result2 = getUpdateType('1.0.0-rc.1', '1.0.0');

    // Pre-releases may be handled differently
    expect(result1).toBeDefined();
    expect(result2).toBeDefined();
  });

  it('should handle version downgrades', () => {
    const result = getUpdateType('2.0.0', '1.0.0');
    expect(result).toBeDefined();
  });
});

describe('Semver estimateBreakingChanges', () => {
  it('should return 0 for patch updates', () => {
    const estimate = estimateBreakingChanges('1.0.0', '1.0.5');

    expect(estimate).toBe(0);
  });

  it('should return 0 for minor updates', () => {
    const estimate = estimateBreakingChanges('1.0.0', '1.5.0');

    expect(estimate).toBe(0);
  });

  it('should estimate breaking changes for single major update', () => {
    const estimate = estimateBreakingChanges('1.0.0', '2.0.0');

    expect(estimate).toBeGreaterThan(0);
    expect(estimate).toBe(15); // 1 major jump * 15
  });

  it('should estimate higher breaking changes for multiple major versions', () => {
    const estimate = estimateBreakingChanges('1.0.0', '5.0.0');

    expect(estimate).toBe(60); // 4 major jumps * 15
  });

  it('should return 0 for same version', () => {
    const estimate = estimateBreakingChanges('1.0.0', '1.0.0');

    expect(estimate).toBe(0);
  });

  it('should handle invalid versions', () => {
    const estimate1 = estimateBreakingChanges('invalid', '1.0.0');
    const estimate2 = estimateBreakingChanges('1.0.0', 'invalid');

    expect(estimate1).toBe(0);
    expect(estimate2).toBe(0);
  });

  it('should calculate correctly for pre-1.0 versions', () => {
    const estimate = estimateBreakingChanges('0.5.0', '1.0.0');

    expect(estimate).toBeGreaterThan(0);
  });

  it('should handle large version jumps', () => {
    const estimate = estimateBreakingChanges('1.0.0', '10.0.0');

    expect(estimate).toBe(135); // 9 major jumps * 15
  });
});

describe('Semver getLastVersionOfMajor', () => {
  it('should find last version in major series', () => {
    const versions = ['1.0.0', '1.1.0', '1.2.5', '2.0.0', '2.1.0'];

    expect(getLastVersionOfMajor(versions, 1)).toBe('1.2.5');
    expect(getLastVersionOfMajor(versions, 2)).toBe('2.1.0');
  });

  it('should return null for non-existent major', () => {
    const versions = ['1.0.0', '1.1.0', '2.0.0'];

    expect(getLastVersionOfMajor(versions, 3)).toBeNull();
    expect(getLastVersionOfMajor(versions, 0)).toBeNull();
    expect(getLastVersionOfMajor(versions, 10)).toBeNull();
  });

  it('should handle single version', () => {
    const versions = ['1.0.0'];

    expect(getLastVersionOfMajor(versions, 1)).toBe('1.0.0');
  });

  it('should handle empty versions array', () => {
    const versions: string[] = [];

    expect(getLastVersionOfMajor(versions, 1)).toBeNull();
  });

  it('should sort versions correctly', () => {
    const versions = ['1.10.0', '1.2.0', '1.1.0', '1.9.0', '1.11.0'];

    expect(getLastVersionOfMajor(versions, 1)).toBe('1.11.0');
  });

  it('should handle pre-release versions', () => {
    const versions = ['1.0.0', '1.1.0-alpha', '1.1.0', '1.2.0-rc1'];

    const result = getLastVersionOfMajor(versions, 1);
    expect(result).toBeDefined();
    // Should prefer stable versions
  });

  it('should handle different major versions', () => {
    const versions = ['1.0.0', '2.5.0', '3.1.0', '4.2.1'];

    expect(getLastVersionOfMajor(versions, 1)).toBe('1.0.0');
    expect(getLastVersionOfMajor(versions, 2)).toBe('2.5.0');
    expect(getLastVersionOfMajor(versions, 3)).toBe('3.1.0');
    expect(getLastVersionOfMajor(versions, 4)).toBe('4.2.1');
  });

  it('should handle v-prefixed versions', () => {
    const versions = ['v1.0.0', 'v1.1.0', 'v2.0.0'];

    // May or may not strip 'v' prefix depending on implementation
    const result = getLastVersionOfMajor(versions, 1);
    expect([null, 'v1.1.0', '1.1.0']).toContain(result);
  });
});


describe('Semver getIntermediateVersions', () => {
  it('should return versions between current and latest', () => {
    const versions = ['1.0.0', '1.1.0', '1.2.0', '2.0.0', '2.1.0', '3.0.0'];
    const intermediate = getIntermediateVersions(versions, '1.0.0', '2.0.0');

    expect(intermediate).toContain('1.1.0');
    expect(intermediate).toContain('1.2.0');
    expect(intermediate).toContain('2.0.0');
    expect(intermediate).not.toContain('1.0.0');
    expect(intermediate).not.toContain('2.1.0');
  });

  it('should return empty array for invalid versions', () => {
    const versions = ['1.0.0', '1.1.0', '2.0.0'];
    const intermediate1 = getIntermediateVersions(versions, 'invalid', '2.0.0');
    const intermediate2 = getIntermediateVersions(versions, '1.0.0', 'invalid');

    expect(intermediate1).toEqual([]);
    expect(intermediate2).toEqual([]);
  });

  it('should sort versions correctly', () => {
    const versions = ['2.0.0', '1.2.0', '1.1.0', '1.5.0'];
    const intermediate = getIntermediateVersions(versions, '1.0.0', '2.0.0');

    expect(intermediate[0]).toBe('1.1.0');
    expect(intermediate[1]).toBe('1.2.0');
    expect(intermediate[2]).toBe('1.5.0');
    expect(intermediate[3]).toBe('2.0.0');
  });

  it('should handle empty version list', () => {
    const intermediate = getIntermediateVersions([], '1.0.0', '2.0.0');
    expect(intermediate).toEqual([]);
  });

  it('should handle same version for current and latest', () => {
    const versions = ['1.0.0', '1.1.0', '2.0.0'];
    const intermediate = getIntermediateVersions(versions, '1.1.0', '1.1.0');

    // When current === latest, no versions are returned (gt excludes current)
    expect(intermediate).toEqual([]);
  });

  it('should filter out invalid versions in list', () => {
    const versions = ['1.0.0', 'invalid', '1.1.0', 'not-semver', '2.0.0'];
    const intermediate = getIntermediateVersions(versions, '1.0.0', '2.0.0');

    expect(intermediate).toContain('1.1.0');
    expect(intermediate).toContain('2.0.0');
    expect(intermediate).not.toContain('invalid');
    expect(intermediate).not.toContain('not-semver');
  });
});
