/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import pLimit from 'p-limit';
import type { Config } from '../types/config.js';
import type { PackageAnalysis, ScanResult, ScanSummary } from '../types/index.js';
import { readPackageJson, getAllDependencies } from '../services/package-reader.js';
import { fetchPackageMetadata } from '../services/npm-registry.js';
import { analyzeAge } from '../analyzers/age.js';
import { analyzeLicense } from '../analyzers/license.js';
import { calculateHealthScore, getOverallSeverity } from '../analyzers/scorer.js';
import { analyzePackageUpgrade } from '../analyzers/upgrade.js';
import { analyzeGitHubRepository } from '../services/github-api.js';
import { shouldIgnorePackage } from '../utils/ignore-matcher.js';

const CONCURRENCY_LIMIT = 10;

/**
 * Scan all dependencies in a project
 */
export async function scanDependencies(
  config: Config,
  directory?: string
): Promise<ScanResult> {
  const startTime = Date.now();

  // Read package.json
  const pkg = await readPackageJson(directory);

  // Get all dependencies
  const dependencies = getAllDependencies(pkg, config.includeDevDependencies);

  console.log(`Scanning ${dependencies.size} dependencies...`);

  // Analyze packages concurrently
  const limit = pLimit(CONCURRENCY_LIMIT);
  const analyses: PackageAnalysis[] = [];

  const tasks = Array.from(dependencies.entries()).map(([name, _versionRange]) =>
    limit(async () => {
      try {
        // Fetch package metadata
        const metadata = await fetchPackageMetadata(name);

        // Check if should be ignored
        if (shouldIgnorePackage(name, metadata, config.ignore)) {
          return null;
        }

        // Analyze age
        const ageAnalysis = analyzeAge(metadata, config.age);

        // Analyze license
        const licenseAnalysis = analyzeLicense(
          metadata,
          config.projectType,
          config.license
        );

        // Calculate health score
        const score = calculateHealthScore(
          ageAnalysis,
          licenseAnalysis,
          config.scoring,
          config.projectType
        );

        // Get overall severity
        const overallSeverity = getOverallSeverity(ageAnalysis, licenseAnalysis);

        // Analyze upgrade path (if enabled)
        const upgradePath = await analyzePackageUpgrade(
          name,
          metadata.version,
          metadata.version, // TODO: Get latest version from registry
          config.upgradePath
        );

        // Analyze GitHub repository (if enabled and available)
        let repository = undefined;
        if (
          config.github.enabled &&
          ageAnalysis.hasRepository &&
          ageAnalysis.repositoryUrl
        ) {
          repository = await analyzeGitHubRepository(
            name,
            metadata.version,
            ageAnalysis.repositoryUrl,
            config.github.token
          );
        }

        const analysis: PackageAnalysis = {
          package: name,
          version: metadata.version,
          age: ageAnalysis,
          license: licenseAnalysis,
          repository,
          score,
          upgradePath,
          overallSeverity,
        };

        return analysis;
      } catch (error) {
        console.error(`Error analyzing ${name}:`, error);
        return null;
      }
    })
  );

  const results = await Promise.all(tasks);

  // Filter out null results (errors or ignored packages)
  for (const result of results) {
    if (result) {
      analyses.push(result);
    }
  }

  // Calculate summary
  const summary = calculateSummary(analyses);

  // Generate recommendations
  const recommendations = generateRecommendations(analyses);

  // Determine exit code
  const exitCode = determineExitCode(analyses, config.failOn);

  const scanDuration = (Date.now() - startTime) / 1000;

  return {
    meta: {
      version: '0.1.0', // TODO: Get from package.json
      timestamp: new Date().toISOString(),
      projectType: config.projectType,
      scanDuration,
    },
    project: {
      name: pkg.name,
      version: pkg.version,
      path: directory || process.cwd(),
    },
    summary,
    packages: analyses,
    recommendations,
    exitCode,
  };
}

/**
 * Calculate scan summary
 */
function calculateSummary(analyses: PackageAnalysis[]): ScanSummary {
  let excellent = 0;
  let good = 0;
  let fair = 0;
  let poor = 0;
  let totalScore = 0;

  let critical = 0;
  let warning = 0;
  let info = 0;

  for (const analysis of analyses) {
    // Count by rating
    switch (analysis.score.rating) {
      case 'excellent':
        excellent++;
        break;
      case 'good':
        good++;
        break;
      case 'fair':
        fair++;
        break;
      case 'poor':
        poor++;
        break;
    }

    totalScore += analysis.score.overall;

    // Count by severity
    switch (analysis.overallSeverity) {
      case 'critical':
        critical++;
        break;
      case 'warning':
        warning++;
        break;
      case 'info':
        info++;
        break;
    }
  }

  const averageScore = analyses.length > 0 ? totalScore / analyses.length : 0;

  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high' | 'critical';
  if (critical > 0 || averageScore < 40) {
    riskLevel = 'critical';
  } else if (warning > 5 || averageScore < 60) {
    riskLevel = 'high';
  } else if (warning > 0 || averageScore < 80) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'low';
  }

  return {
    total: analyses.length,
    excellent,
    good,
    fair,
    poor,
    averageScore: Math.round(averageScore),
    riskLevel,
    issues: {
      critical,
      warning,
      info,
    },
  };
}

/**
 * Generate recommendations based on analysis
 */
function generateRecommendations(
  analyses: PackageAnalysis[]
): Array<{
  package: string;
  reason: string;
  alternatives?: string[];
  estimatedEffort?: string;
  priority: 'low' | 'medium' | 'high';
}> {
  const recommendations = [];

  for (const analysis of analyses) {
    if (analysis.age.deprecated) {
      recommendations.push({
        package: analysis.package,
        reason: `Package is deprecated: ${analysis.age.deprecationMessage || 'No longer maintained'}`,
        priority: 'high' as const,
        estimatedEffort: '2-4 hours',
      });
    } else if (analysis.overallSeverity === 'critical') {
      recommendations.push({
        package: analysis.package,
        reason: getLicenseCriticalReason(analysis),
        priority: 'high' as const,
      });
    } else if (analysis.score.overall < 40) {
      recommendations.push({
        package: analysis.package,
        reason: `Low health score (${analysis.score.overall}/100). Package is ${analysis.age.ageHuman} old.`,
        priority: 'medium' as const,
      });
    }
  }

  return recommendations;
}

function getLicenseCriticalReason(analysis: PackageAnalysis): string {
  if (analysis.license.category === 'commercial-incompatible') {
    return `License ${analysis.license.license} is incompatible with commercial use`;
  }
  if (analysis.license.category === 'unlicensed') {
    return 'Package has no license';
  }
  return 'Critical issue detected';
}

/**
 * Determine exit code based on severity and configuration
 */
function determineExitCode(
  analyses: PackageAnalysis[],
  failOn: 'none' | 'info' | 'warning' | 'critical'
): number {
  if (failOn === 'none') {
    return 0;
  }

  const hasCritical = analyses.some((a) => a.overallSeverity === 'critical');
  const hasWarning = analyses.some((a) => a.overallSeverity === 'warning');
  const hasInfo = analyses.some((a) => a.overallSeverity === 'info');

  if (hasCritical && (failOn === 'critical' || failOn === 'warning' || failOn === 'info')) {
    return 2;
  }

  if (hasWarning && (failOn === 'warning' || failOn === 'info')) {
    return 1;
  }

  if (hasInfo && failOn === 'info') {
    return 1;
  }

  return 0;
}
