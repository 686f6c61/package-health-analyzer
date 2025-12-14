/**
 * package-health-analyzer - Plain Text Reporter
 *
 * This module generates clean, unformatted plain text output suitable for logging, CI/CD pipelines,
 * and environments where ANSI color codes are not supported or desired. Users choose this format when
 * redirecting output to files, integrating with build systems, or archiving scan results as plain text
 * documentation without terminal-specific formatting.
 *
 * Key responsibilities:
 * - Generating human-readable reports without ANSI color codes or special characters
 * - Providing structured text output suitable for file redirection and logging systems
 * - Organizing issues hierarchically by severity (critical, warnings, informational)
 * - Displaying detailed package information including vulnerabilities and deprecation notices
 * - Supporting CI/CD integration where plain text output is required for artifact storage
 *
 * @module reporters/txt
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import type { ScanResult, PackageAnalysis } from '../types/index.js';

/**
 * Format scan results as plain text without colors
 *
 * @param result - Complete scan result from dependency analysis
 * @returns Plain text formatted report suitable for logging or file output
 */
export function formatTxtOutput(result: ScanResult): string {
  const lines: string[] = [];

  // Header
  lines.push('');
  lines.push('package-health-analyzer');
  lines.push('='.repeat(50));
  lines.push('');

  // Project info
  lines.push(`Project: ${result.project.name}@${result.project.version}`);
  lines.push(`Dependencies: ${result.summary.total}`);
  lines.push(`Scan duration: ${result.meta.scanDuration.toFixed(2)}s`);
  lines.push(`Timestamp: ${result.meta.timestamp}`);
  lines.push('');

  // Get packages with issues
  const criticalPackages = result.packages.filter(
    (p) => p.overallSeverity === 'critical'
  );
  const warningPackages = result.packages.filter(
    (p) => p.overallSeverity === 'warning'
  );
  const infoPackages = result.packages.filter((p) => p.overallSeverity === 'info');

  // Critical issues
  if (criticalPackages.length > 0) {
    lines.push('CRITICAL ISSUES');
    lines.push('-'.repeat(50));
    lines.push('');
    for (const pkg of criticalPackages) {
      lines.push(...formatPackageDetails(pkg));
    }
    lines.push('');
  }

  // Warnings
  if (warningPackages.length > 0) {
    lines.push('WARNINGS');
    lines.push('-'.repeat(50));
    lines.push('');
    for (const pkg of warningPackages) {
      lines.push(...formatPackageDetails(pkg));
    }
    lines.push('');
  }

  // Info
  if (infoPackages.length > 0 && infoPackages.length <= 10) {
    lines.push('INFORMATIONAL');
    lines.push('-'.repeat(50));
    lines.push('');
    for (const pkg of infoPackages) {
      lines.push(...formatPackageDetails(pkg));
    }
    lines.push('');
  }

  // Summary
  lines.push('SUMMARY');
  lines.push('='.repeat(50));
  lines.push('');
  lines.push(`Excellent: ${result.summary.excellent} | Good: ${result.summary.good} | Fair: ${result.summary.fair} | Poor: ${result.summary.poor}`);
  lines.push(`Average health score: ${result.summary.averageScore}/100`);
  lines.push(`Risk level: ${result.summary.riskLevel.toUpperCase()}`);
  lines.push('');
  lines.push(`Critical: ${result.summary.issues.critical} | Warnings: ${result.summary.issues.warning} | Info: ${result.summary.issues.info}`);
  lines.push('');

  // Recommendations
  if (result.recommendations && result.recommendations.length > 0) {
    lines.push('RECOMMENDATIONS');
    lines.push('-'.repeat(50));
    lines.push('');
    for (const rec of result.recommendations) {
      lines.push(`! ${rec.package}: ${rec.reason}`);
      if (rec.priority) {
        lines.push(`  Priority: ${rec.priority}`);
      }
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Format individual package details as plain text
 *
 * @param pkg - Package analysis result
 * @returns Array of text lines describing the package
 */
function formatPackageDetails(pkg: PackageAnalysis): string[] {
  const lines: string[] = [];

  lines.push(`Package: ${pkg.package}@${pkg.version}`);
  lines.push(`  Health Score: ${pkg.score.overall}/100 (${pkg.score.rating})`);
  lines.push(`  Age: ${pkg.age.ageHuman}`);
  lines.push(`  License: ${pkg.license.license} (${pkg.license.category})`);

  if (pkg.age.deprecated) {
    lines.push(`  DEPRECATED: ${pkg.age.deprecationMessage || 'No longer maintained'}`);
  }

  if (pkg.vulnerability) {
    const vulnCount = pkg.vulnerability.totalCount;
    if (vulnCount > 0) {
      lines.push(`  Vulnerabilities: ${vulnCount} total`);
      lines.push(`    Critical: ${pkg.vulnerability.criticalCount} | High: ${pkg.vulnerability.highCount} | Moderate: ${pkg.vulnerability.moderateCount} | Low: ${pkg.vulnerability.lowCount}`);

      // Show first 3 vulnerabilities
      const topVulns = pkg.vulnerability.vulnerabilities.slice(0, 3);
      for (const vuln of topVulns) {
        lines.push(`    - ${vuln.ghsaId} (${vuln.severity.toUpperCase()}): ${vuln.summary}`);
      }
      if (pkg.vulnerability.vulnerabilities.length > 3) {
        lines.push(`    ... and ${pkg.vulnerability.vulnerabilities.length - 3} more`);
      }
    }
  }

  if (pkg.repository) {
    if (pkg.repository.isArchived) {
      lines.push(`  Repository: ARCHIVED (no longer maintained)`);
    }
    if (pkg.repository.openIssues !== undefined && pkg.repository.openIssues > 100) {
      lines.push(`  Open Issues: ${pkg.repository.openIssues} (high maintenance burden)`);
    }
  }

  const issues: string[] = [];

  if (pkg.age.deprecated) {
    issues.push('Deprecated');
  }

  if (pkg.age.ageDays > 365 * 2) {
    issues.push(`Old (${pkg.age.ageHuman})`);
  }

  if (pkg.license.severity === 'critical') {
    issues.push(`License issue: ${pkg.license.reason || 'Incompatible license'}`);
  } else if (pkg.license.severity === 'warning') {
    issues.push(`License warning: ${pkg.license.reason || 'Review required'}`);
  }

  if (issues.length > 0) {
    lines.push(`  Issues: ${issues.join(', ')}`);
  }

  lines.push('');
  return lines;
}
