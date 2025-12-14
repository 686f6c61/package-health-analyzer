/**
 * package-health-analyzer - Single Package Check Command
 *
 * This module provides focused analysis for individual npm packages, allowing developers
 * to quickly evaluate a single package's health before adding it as a dependency. Unlike
 * the scan command which analyzes an entire project, check performs a deep-dive assessment
 * of a specific package with detailed reporting suitable for human review.
 *
 * Key responsibilities:
 * - Perform comprehensive health analysis of a single specified npm package
 * - Fetch and analyze package metadata including age, licensing, and repository information
 * - Calculate multi-dimensional health scores based on project-specific configuration
 * - Format detailed, human-readable CLI output with severity indicators and recommendations
 * - Provide decision-making support for dependency selection and evaluation
 *
 * @module commands/check
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import type { Config } from '../types/config.js';
import type { PackageAnalysis } from '../types/index.js';
import { fetchPackageMetadata } from '../services/npm-registry.js';
import { analyzeAge } from '../analyzers/age.js';
import { analyzeLicense } from '../analyzers/license.js';
import { analyzePopularity } from '../analyzers/popularity.js';
import { calculateHealthScore, getOverallSeverity } from '../analyzers/scorer.js';

/**
 * Check health of a single package
 */
export async function checkPackage(
  packageName: string,
  config: Config
): Promise<PackageAnalysis> {
  console.log(`Checking ${packageName}...`);
  console.log('');

  try {
    // Fetch package metadata
    const metadata = await fetchPackageMetadata(packageName);

    // Analyze age
    const ageAnalysis = analyzeAge(metadata, config.age);

    // Analyze license
    const licenseAnalysis = analyzeLicense(
      metadata,
      config.projectType,
      config.license
    );

    // Analyze popularity (npm downloads)
    const popularityAnalysis = await analyzePopularity(
      packageName,
      metadata.version || 'latest',
      ageAnalysis.ageDays
    );

    // Calculate health score
    const score = calculateHealthScore(
      ageAnalysis,
      licenseAnalysis,
      undefined, // vulnerability analysis (not in check command yet)
      config.scoring,
      config.projectType,
      popularityAnalysis
    );

    // Get overall severity
    const overallSeverity = getOverallSeverity(ageAnalysis, licenseAnalysis, undefined);

    const analysis: PackageAnalysis = {
      package: packageName,
      version: metadata.version,
      age: ageAnalysis,
      license: licenseAnalysis,
      score,
      overallSeverity,
    };

    return analysis;
  } catch (error) {
    throw new Error(
      `Failed to check package ${packageName}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Format check output for CLI
 */
export function formatCheckOutput(analysis: PackageAnalysis): string {
  const lines: string[] = [];

  lines.push(`Package: ${analysis.package}`);
  lines.push(`Version: ${analysis.version}`);
  lines.push('');

  // Age section
  lines.push('AGE:');
  lines.push(`  Last publish: ${analysis.age.lastPublish}`);
  lines.push(`  Age: ${analysis.age.ageHuman} (${analysis.age.ageDays} days)`);
  if (analysis.age.deprecated) {
    lines.push(`  Status: DEPRECATED`);
    if (analysis.age.deprecationMessage) {
      lines.push(`  Message: ${analysis.age.deprecationMessage}`);
    }
  } else {
    lines.push(`  Status: Active`);
  }
  if (analysis.age.hasRepository) {
    lines.push(`  Repository: ${analysis.age.repositoryUrl}`);
  } else {
    lines.push(`  Repository: Not available`);
  }
  lines.push('');

  // License section
  lines.push('LICENSE:');
  lines.push(`  License: ${analysis.license.license}`);
  if (analysis.license.spdxId) {
    lines.push(`  SPDX ID: ${analysis.license.spdxId}`);
  }
  lines.push(`  Category: ${analysis.license.category}`);
  lines.push(`  Blue Oak Rating: ${analysis.license.blueOakRating}`);
  lines.push(`  Commercial use: ${analysis.license.commercialUse ? 'Yes' : 'No'}`);
  if (analysis.license.hasPatentClause) {
    lines.push(`  Patent clause: Yes`);
  }
  if (analysis.license.isDualLicense) {
    lines.push(`  Dual license: Yes`);
  }
  if (analysis.license.reason) {
    lines.push(`  Note: ${analysis.license.reason}`);
  }
  lines.push('');

  // Health score section
  lines.push('HEALTH SCORE:');
  lines.push(`  Overall: ${analysis.score.overall}/100 (${analysis.score.rating})`);
  lines.push(`  Dimensions:`);
  lines.push(`    Age: ${(analysis.score.dimensions.age * 100).toFixed(0)}/100`);
  lines.push(
    `    Deprecation: ${(analysis.score.dimensions.deprecation * 100).toFixed(0)}/100`
  );
  lines.push(
    `    License: ${(analysis.score.dimensions.license * 100).toFixed(0)}/100`
  );
  lines.push(
    `    Repository: ${(analysis.score.dimensions.repository * 100).toFixed(0)}/100`
  );
  lines.push('');

  // Overall assessment
  lines.push('ASSESSMENT:');
  const severityLabel =
    analysis.overallSeverity === 'ok'
      ? 'No issues detected'
      : analysis.overallSeverity === 'info'
        ? 'Informational notices'
        : analysis.overallSeverity === 'warning'
          ? 'Warnings detected - review recommended'
          : 'Critical issues detected - action required';

  lines.push(`  Severity: ${analysis.overallSeverity.toUpperCase()}`);
  lines.push(`  ${severityLabel}`);

  return lines.join('\n');
}
