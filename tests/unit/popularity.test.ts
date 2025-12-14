/**
 * package-health-analyzer - Popularity Analyzer Tests
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analyzePopularity, calculatePopularityScore } from '../../src/analyzers/popularity.js';
import * as npmRegistry from '../../src/services/npm-registry.js';

vi.mock('../../src/services/npm-registry.js');

describe('Popularity Analyzer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('calculatePopularityScore', () => {
    it('should return 0 for zero downloads', () => {
      const score = calculatePopularityScore(0);
      expect(score).toBe(0);
    });

    it('should return higher scores for more popular packages', () => {
      const score100 = calculatePopularityScore(100);
      const score1k = calculatePopularityScore(1_000);
      const score10k = calculatePopularityScore(10_000);
      const score100k = calculatePopularityScore(100_000);
      const score1M = calculatePopularityScore(1_000_000);

      expect(score100).toBeLessThan(score1k);
      expect(score1k).toBeLessThan(score10k);
      expect(score10k).toBeLessThan(score100k);
      expect(score100k).toBeLessThan(score1M);
    });

    it('should cap score at 1.0 for very popular packages', () => {
      const score = calculatePopularityScore(10_000_000);
      expect(score).toBeLessThanOrEqual(1.0);
    });

    it('should apply age boost for new packages', () => {
      const downloads = 1_000;

      // 30 days old (very new) should get boost
      const scoreNew = calculatePopularityScore(downloads, 30);

      // 365 days old (1 year) should not get boost
      const scoreOld = calculatePopularityScore(downloads, 365);

      expect(scoreNew).toBeGreaterThan(scoreOld);
    });

    it('should not boost packages over 1 year old', () => {
      const downloads = 1_000;
      const scoreOld = calculatePopularityScore(downloads, 400);
      const scoreWithoutAge = calculatePopularityScore(downloads);

      expect(scoreOld).toBeCloseTo(scoreWithoutAge, 2);
    });
  });

  describe('analyzePopularity', () => {
    it('should analyze popular package correctly', async () => {
      vi.mocked(npmRegistry.fetchDownloadStats).mockResolvedValue(100_000);

      const result = await analyzePopularity('react', '18.0.0');

      expect(result.package).toBe('react');
      expect(result.version).toBe('18.0.0');
      expect(result.weeklyDownloads).toBe(100_000);
      expect(result.tier).toBe('popular');
      expect(result.severity).toBe('ok');
      expect(result.score).toBeGreaterThan(0.7);
    });

    it('should classify packages into correct tiers', async () => {
      // Very unpopular (< 100/week)
      vi.mocked(npmRegistry.fetchDownloadStats).mockResolvedValue(50);
      let result = await analyzePopularity('very-unpopular-pkg', '1.0.0');
      expect(result.tier).toBe('unpopular');
      expect(result.severity).toBe('warning');

      // Unpopular (100-999/week)
      vi.mocked(npmRegistry.fetchDownloadStats).mockResolvedValue(500);
      result = await analyzePopularity('unpopular-pkg', '1.0.0');
      expect(result.tier).toBe('unpopular');
      expect(result.severity).toBe('info');

      // Niche (1k-9.9k/week)
      vi.mocked(npmRegistry.fetchDownloadStats).mockResolvedValue(5_000);
      result = await analyzePopularity('niche-pkg', '1.0.0');
      expect(result.tier).toBe('niche');
      expect(result.severity).toBe('ok');

      // Moderate (10k-99.9k/week)
      vi.mocked(npmRegistry.fetchDownloadStats).mockResolvedValue(50_000);
      result = await analyzePopularity('moderate-pkg', '1.0.0');
      expect(result.tier).toBe('moderate');
      expect(result.severity).toBe('ok');

      // Popular (100k-999k/week)
      vi.mocked(npmRegistry.fetchDownloadStats).mockResolvedValue(500_000);
      result = await analyzePopularity('popular-pkg', '1.0.0');
      expect(result.tier).toBe('popular');

      // Very popular (1M+/week)
      vi.mocked(npmRegistry.fetchDownloadStats).mockResolvedValue(5_000_000);
      result = await analyzePopularity('very-popular-pkg', '1.0.0');
      expect(result.tier).toBe('very-popular');
    });

    it('should handle fetch errors gracefully', async () => {
      vi.mocked(npmRegistry.fetchDownloadStats).mockRejectedValue(
        new Error('Network error')
      );

      const result = await analyzePopularity('error-pkg', '1.0.0');

      expect(result.weeklyDownloads).toBe(0);
      expect(result.score).toBe(0.5); // Neutral score
      expect(result.tier).toBe('niche');
      expect(result.severity).toBe('info');
    });

    it('should apply age adjustment for new packages', async () => {
      vi.mocked(npmRegistry.fetchDownloadStats).mockResolvedValue(1_000);

      // New package (30 days)
      const resultNew = await analyzePopularity('new-pkg', '1.0.0', 30);

      // Old package (400 days)
      const resultOld = await analyzePopularity('old-pkg', '1.0.0', 400);

      expect(resultNew.ageAdjusted).toBe(true);
      expect(resultOld.ageAdjusted).toBe(false);
      expect(resultNew.score).toBeGreaterThan(resultOld.score);
    });

    it('should handle real-world popular packages', async () => {
      const testCases = [
        { name: 'lodash', downloads: 30_000_000, expectedTier: 'very-popular' },
        { name: 'express', downloads: 20_000_000, expectedTier: 'very-popular' },
        { name: 'moment', downloads: 10_000_000, expectedTier: 'very-popular' },
        { name: 'axios', downloads: 35_000_000, expectedTier: 'very-popular' },
      ];

      for (const { name, downloads, expectedTier } of testCases) {
        vi.mocked(npmRegistry.fetchDownloadStats).mockResolvedValue(downloads);
        const result = await analyzePopularity(name, '1.0.0');
        expect(result.tier).toBe(expectedTier);
        expect(result.severity).toBe('ok');
      }
    });
  });

  describe('Edge cases', () => {
    it('should handle packages with exactly threshold values', async () => {
      const thresholds = [100, 1_000, 10_000, 100_000, 1_000_000];

      for (const threshold of thresholds) {
        vi.mocked(npmRegistry.fetchDownloadStats).mockResolvedValue(threshold);
        const result = await analyzePopularity('test-pkg', '1.0.0');
        expect(result.score).toBeGreaterThanOrEqual(0);
        expect(result.score).toBeLessThanOrEqual(1);
      }
    });

    it('should handle negative age values gracefully', async () => {
      vi.mocked(npmRegistry.fetchDownloadStats).mockResolvedValue(1_000);
      const result = await analyzePopularity('test-pkg', '1.0.0', -10);

      // Should not crash and return valid score
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(1);
    });
  });
});
