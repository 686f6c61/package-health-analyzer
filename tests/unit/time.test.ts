/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { describe, it, expect } from 'vitest';
import {
  daysBetween,
  daysToHuman,
  parseTimeThreshold,
  calculateAge,
} from '../../src/utils/time.js';

describe('Time utilities', () => {
  describe('daysBetween', () => {
    it('should calculate days between two dates', () => {
      const date1 = new Date('2023-01-01');
      const date2 = new Date('2023-01-10');
      expect(daysBetween(date1, date2)).toBe(9);
    });

    it('should handle dates in reverse order', () => {
      const date1 = new Date('2023-01-10');
      const date2 = new Date('2023-01-01');
      expect(daysBetween(date1, date2)).toBe(9);
    });
  });

  describe('daysToHuman', () => {
    it('should format 0 days as today', () => {
      expect(daysToHuman(0)).toBe('today');
    });

    it('should format 1 day', () => {
      expect(daysToHuman(1)).toBe('1 day');
    });

    it('should format multiple days', () => {
      expect(daysToHuman(5)).toBe('5 days');
    });

    it('should format weeks', () => {
      expect(daysToHuman(14)).toBe('2 weeks');
    });

    it('should format months', () => {
      expect(daysToHuman(60)).toBe('2 months');
    });

    it('should format years', () => {
      expect(daysToHuman(365)).toBe('1 year');
      expect(daysToHuman(730)).toBe('2 years');
    });

    it('should format years and months', () => {
      const result = daysToHuman(395); // 1 year + 30 days
      expect(result).toContain('year');
      expect(result).toContain('month');
    });
  });

  describe('parseTimeThreshold', () => {
    it('should parse years', () => {
      expect(parseTimeThreshold('2y')).toBe(730);
    });

    it('should parse months', () => {
      expect(parseTimeThreshold('6m')).toBe(180);
    });

    it('should parse days', () => {
      expect(parseTimeThreshold('90d')).toBe(90);
    });

    it('should throw error for invalid format', () => {
      expect(() => parseTimeThreshold('invalid')).toThrow();
    });
  });

  describe('calculateAge', () => {
    it('should calculate age from ISO date', () => {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const result = calculateAge(oneYearAgo.toISOString());

      expect(result.days).toBeGreaterThan(360);
      expect(result.days).toBeLessThan(370);
      expect(result.human).toContain('year');
    });
  });
});
