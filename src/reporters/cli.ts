/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import Table from 'cli-table3';
import chalk from 'chalk';
import type { ScanResult, PackageAnalysis } from '../types/index.js';

/**
 * Format CLI output for scan results
 */
export function formatCliOutput(result: ScanResult): string {
  const lines: string[] = [];

  // Header
  lines.push('');
  lines.push(chalk.bold('package-health-analyzer'));
  lines.push('');

  // Project info
  lines.push(chalk.dim(`Project: ${result.project.name}@${result.project.version}`));
  lines.push(chalk.dim(`Dependencies: ${result.summary.total}`));
  lines.push(chalk.dim(`Scan duration: ${result.meta.scanDuration.toFixed(2)}s`));
  lines.push('');

  // Get packages with issues
  const criticalPackages = result.packages.filter(
    (p) => p.overallSeverity === 'critical'
  );
  const warningPackages = result.packages.filter(
    (p) => p.overallSeverity === 'warning'
  );

  // Critical issues
  if (criticalPackages.length > 0) {
    lines.push(chalk.red.bold('CRITICAL ISSUES'));
    lines.push('');
    lines.push(formatPackagesTable(criticalPackages));
    lines.push('');
  }

  // Warnings
  if (warningPackages.length > 0) {
    lines.push(chalk.yellow.bold('WARNINGS'));
    lines.push('');
    lines.push(formatPackagesTable(warningPackages));
    lines.push('');
  }

  // Summary
  lines.push(chalk.bold('SUMMARY'));
  lines.push('');
  lines.push(formatSummary(result));
  lines.push('');

  // Recommendations
  if (result.recommendations.length > 0) {
    lines.push(chalk.bold('RECOMMENDATIONS'));
    lines.push('');
    for (const rec of result.recommendations) {
      const icon = rec.priority === 'high' ? chalk.red('!') : chalk.yellow('!');
      lines.push(`${icon} ${chalk.bold(rec.package)}: ${rec.reason}`);
      if (rec.estimatedEffort) {
        lines.push(`  ${chalk.dim(`Estimated effort: ${rec.estimatedEffort}`)}`);
      }
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Format packages table
 */
function formatPackagesTable(packages: PackageAnalysis[]): string {
  const table = new Table({
    head: [
      chalk.bold('Package'),
      chalk.bold('Version'),
      chalk.bold('Age'),
      chalk.bold('License'),
      chalk.bold('Score'),
      chalk.bold('Issues'),
    ],
    colWidths: [30, 12, 15, 20, 8, 40],
    wordWrap: true,
  });

  for (const pkg of packages) {
    const issues: string[] = [];

    // Age issues
    if (pkg.age.deprecated) {
      issues.push(chalk.red('Deprecated'));
    } else if (pkg.age.severity === 'critical') {
      issues.push(chalk.red(`Very old (${pkg.age.ageHuman})`));
    } else if (pkg.age.severity === 'warning') {
      issues.push(chalk.yellow(`Old (${pkg.age.ageHuman})`));
    }

    // License issues
    if (pkg.license.category === 'commercial-incompatible') {
      issues.push(chalk.red(`License: ${pkg.license.license}`));
    } else if (pkg.license.category === 'unlicensed') {
      issues.push(chalk.red('No license'));
    } else if (pkg.license.category === 'commercial-warning') {
      issues.push(chalk.yellow(`License: ${pkg.license.license}`));
    }

    // Blue Oak rating
    if (pkg.license.blueOakRating === 'lead') {
      issues.push(chalk.yellow('Poor license quality'));
    }

    table.push([
      pkg.package,
      pkg.version,
      pkg.age.ageHuman,
      formatLicense(pkg.license.license, pkg.license.blueOakRating),
      formatScore(pkg.score.overall),
      issues.join(', ') || chalk.green('None'),
    ]);
  }

  return table.toString();
}

/**
 * Format license with Blue Oak rating
 */
function formatLicense(license: string, rating: string): string {
  let ratingIcon = '';
  switch (rating) {
    case 'gold':
      ratingIcon = chalk.yellow('★');
      break;
    case 'silver':
      ratingIcon = chalk.white('★');
      break;
    case 'bronze':
      ratingIcon = chalk.dim('★');
      break;
    case 'lead':
      ratingIcon = chalk.red('!');
      break;
  }

  return `${license} ${ratingIcon}`;
}

/**
 * Format score with color
 */
function formatScore(score: number): string {
  if (score >= 80) {
    return chalk.green(score.toString());
  }
  if (score >= 60) {
    return chalk.yellow(score.toString());
  }
  return chalk.red(score.toString());
}

/**
 * Format summary section
 */
function formatSummary(result: ScanResult): string {
  const lines: string[] = [];

  // Health distribution
  lines.push(
    `${chalk.green('Excellent')}: ${result.summary.excellent} | ` +
      `${chalk.cyan('Good')}: ${result.summary.good} | ` +
      `${chalk.yellow('Fair')}: ${result.summary.fair} | ` +
      `${chalk.red('Poor')}: ${result.summary.poor}`
  );

  // Average score
  const avgColor =
    result.summary.averageScore >= 80
      ? chalk.green
      : result.summary.averageScore >= 60
        ? chalk.yellow
        : chalk.red;

  lines.push(`Average health score: ${avgColor(result.summary.averageScore + '/100')}`);

  // Risk level
  const riskColor =
    result.summary.riskLevel === 'low'
      ? chalk.green
      : result.summary.riskLevel === 'medium'
        ? chalk.yellow
        : chalk.red;

  lines.push(`Risk level: ${riskColor(result.summary.riskLevel.toUpperCase())}`);

  // Issues
  lines.push('');
  lines.push(
    `${chalk.red('Critical')}: ${result.summary.issues.critical} | ` +
      `${chalk.yellow('Warnings')}: ${result.summary.issues.warning} | ` +
      `${chalk.blue('Info')}: ${result.summary.issues.info}`
  );

  return lines.join('\n');
}
