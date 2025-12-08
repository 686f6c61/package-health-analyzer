/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { describe, it, expect } from 'vitest';
import {
  parseSpdxExpression,
  hasPatentClause,
  normalizeLicense,
  isValidSpdx,
} from '../../src/utils/spdx.js';

describe('SPDX utilities', () => {
  describe('parseSpdxExpression', () => {
    it('should parse single license', () => {
      const result = parseSpdxExpression('MIT');
      expect(result.spdxId).toBe('MIT');
      expect(result.isDual).toBe(false);
      expect(result.licenses).toEqual(['MIT']);
    });

    it('should parse dual license with OR', () => {
      const result = parseSpdxExpression('(MIT OR Apache-2.0)');
      expect(result.isDual).toBe(true);
      expect(result.licenses).toEqual(['MIT', 'Apache-2.0']);
    });

    it('should parse multiple licenses with AND', () => {
      const result = parseSpdxExpression('MIT AND Apache-2.0');
      expect(result.isDual).toBe(false);
      expect(result.licenses).toEqual(['MIT', 'Apache-2.0']);
    });

    it('should handle licenses without parentheses', () => {
      const result = parseSpdxExpression('MIT OR Apache-2.0');
      expect(result.isDual).toBe(true);
      expect(result.licenses).toEqual(['MIT', 'Apache-2.0']);
    });
  });

  describe('hasPatentClause', () => {
    it('should return true for Apache-2.0', () => {
      expect(hasPatentClause('Apache-2.0')).toBe(true);
    });

    it('should return true for GPL-3.0-only', () => {
      expect(hasPatentClause('GPL-3.0-only')).toBe(true);
    });

    it('should return true for MPL-2.0', () => {
      expect(hasPatentClause('MPL-2.0')).toBe(true);
    });

    it('should return false for MIT', () => {
      expect(hasPatentClause('MIT')).toBe(false);
    });

    it('should return false for ISC', () => {
      expect(hasPatentClause('ISC')).toBe(false);
    });

    it('should return false for BSD-3-Clause', () => {
      expect(hasPatentClause('BSD-3-Clause')).toBe(false);
    });
  });

  describe('normalizeLicense', () => {
    it('should normalize MIT License to MIT', () => {
      expect(normalizeLicense('MIT License')).toBe('MIT');
    });

    it('should normalize Apache License 2.0 to Apache-2.0', () => {
      expect(normalizeLicense('Apache License 2.0')).toBe('Apache-2.0');
    });

    it('should normalize GPL-3.0 to GPL-3.0-only', () => {
      expect(normalizeLicense('GPL-3.0')).toBe('GPL-3.0-only');
    });

    it('should normalize GPL-2.0 to GPL-2.0-only', () => {
      expect(normalizeLicense('GPL-2.0')).toBe('GPL-2.0-only');
    });

    it('should normalize LGPL-3.0 to LGPL-3.0-only', () => {
      expect(normalizeLicense('LGPL-3.0')).toBe('LGPL-3.0-only');
    });

    it('should normalize AGPL-3.0 to AGPL-3.0-only', () => {
      expect(normalizeLicense('AGPL-3.0')).toBe('AGPL-3.0-only');
    });

    it('should normalize GPLv3 to GPL-3.0-only', () => {
      expect(normalizeLicense('GPLv3')).toBe('GPL-3.0-only');
    });

    it('should normalize LGPLv3 to LGPL-3.0-only', () => {
      expect(normalizeLicense('LGPLv3')).toBe('LGPL-3.0-only');
    });

    it('should return original if no variation found', () => {
      expect(normalizeLicense('CustomLicense')).toBe('CustomLicense');
    });

    it('should trim whitespace', () => {
      expect(normalizeLicense('  MIT  ')).toBe('MIT');
    });
  });

  describe('isValidSpdx', () => {
    it('should return true for valid license', () => {
      expect(isValidSpdx('MIT')).toBe(true);
    });

    it('should return false for UNLICENSED', () => {
      expect(isValidSpdx('UNLICENSED')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isValidSpdx('')).toBe(false);
    });

    it('should return false for SEE LICENSE IN', () => {
      expect(isValidSpdx('SEE LICENSE IN')).toBe(false);
    });
  });
});
