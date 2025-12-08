/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { describe, it, expect } from 'vitest';
import {
  getBlueOakRating,
  getBlueOakDescription,
  isLegallySound,
} from '../../src/utils/blue-oak.js';

describe('Blue Oak Council ratings', () => {
  describe('getBlueOakRating', () => {
    it('should return gold for MIT license', () => {
      expect(getBlueOakRating('MIT')).toBe('gold');
    });

    it('should return gold for Apache-2.0 license', () => {
      expect(getBlueOakRating('Apache-2.0')).toBe('gold');
    });

    it('should return silver for ISC license', () => {
      expect(getBlueOakRating('ISC')).toBe('silver');
    });

    it('should return bronze for LGPL-3.0 license', () => {
      expect(getBlueOakRating('LGPL-3.0')).toBe('bronze');
    });

    it('should return lead for JSON license', () => {
      expect(getBlueOakRating('JSON')).toBe('lead');
    });

    it('should return unrated for unknown license', () => {
      expect(getBlueOakRating('Unknown-License')).toBe('unrated');
    });
  });

  describe('getBlueOakDescription', () => {
    it('should return correct description for gold', () => {
      const desc = getBlueOakDescription('gold');
      expect(desc).toContain('Perfectly drafted');
    });

    it('should return correct description for lead', () => {
      const desc = getBlueOakDescription('lead');
      expect(desc).toContain('Problematic');
    });
  });

  describe('isLegallySound', () => {
    it('should return true for gold rating', () => {
      expect(isLegallySound('gold')).toBe(true);
    });

    it('should return true for silver rating', () => {
      expect(isLegallySound('silver')).toBe(true);
    });

    it('should return false for bronze rating', () => {
      expect(isLegallySound('bronze')).toBe(false);
    });

    it('should return false for lead rating', () => {
      expect(isLegallySound('lead')).toBe(false);
    });
  });
});
