/**
 * package-health-analyzer - CSV Reporter
 *
 * This module generates comma-separated values (CSV) output for data analysis and spreadsheet integration.
 * Users choose this format when they need to import dependency health data into Excel, Google Sheets, or
 * data processing pipelines for trend analysis, compliance reporting, or custom visualizations. The CSV
 * format strictly follows RFC 4180 standards with proper field escaping and quoting.
 *
 * Key responsibilities:
 * - Exporting package health data in RFC 4180-compliant CSV format
 * - Properly escaping special characters (commas, quotes, newlines) in field values
 * - Providing both detailed package-level data and summary statistics
 * - Supporting data import into spreadsheet applications and analysis tools
 * - Enabling batch processing and historical trend analysis across multiple scans
 *
 * @module reporters/csv
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import type { ScanResult, PackageAnalysis } from '../types/index.js';

/**
 * Format scan results as CSV
 */
export function formatCsvOutput(result: ScanResult): string {
  const lines: string[] = [];

  // Header
  lines.push(
    [
      'package',
      'version',
      'age_days',
      'age_human',
      'deprecated',
      'license',
      'license_category',
      'blue_oak_rating',
      'commercial_use',
      'health_score',
      'health_rating',
      'severity',
      'has_repository',
      'repository_url',
    ].join(',')
  );

  // Data rows
  for (const pkg of result.packages) {
    lines.push(formatPackageCsv(pkg));
  }

  return lines.join('\n');
}

/**
 * Format a single package as CSV row
 */
function formatPackageCsv(pkg: PackageAnalysis): string {
  const fields = [
    escapeField(pkg.package),
    escapeField(pkg.version),
    pkg.age.ageDays.toString(),
    escapeField(pkg.age.ageHuman),
    pkg.age.deprecated ? 'true' : 'false',
    escapeField(pkg.license.license),
    escapeField(pkg.license.category),
    escapeField(pkg.license.blueOakRating),
    pkg.license.commercialUse ? 'true' : 'false',
    pkg.score.overall.toString(),
    escapeField(pkg.score.rating),
    escapeField(pkg.overallSeverity),
    pkg.age.hasRepository ? 'true' : 'false',
    escapeField(pkg.age.repositoryUrl || ''),
  ];

  return fields.join(',');
}

/**
 * Escape CSV field (handle commas, quotes, newlines)
 */
function escapeField(field: string): string {
  if (!field) {
    return '';
  }

  // If field contains comma, quote, or newline, wrap in quotes and escape quotes
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }

  return field;
}

/**
 * Format summary as CSV
 */
export function formatSummaryCsv(result: ScanResult): string {
  const lines: string[] = [];

  lines.push('metric,value');
  lines.push(`total_packages,${result.summary.total}`);
  lines.push(`excellent,${result.summary.excellent}`);
  lines.push(`good,${result.summary.good}`);
  lines.push(`fair,${result.summary.fair}`);
  lines.push(`poor,${result.summary.poor}`);
  lines.push(`average_score,${result.summary.averageScore}`);
  lines.push(`risk_level,${result.summary.riskLevel}`);
  lines.push(`critical_issues,${result.summary.issues.critical}`);
  lines.push(`warnings,${result.summary.issues.warning}`);
  lines.push(`info,${result.summary.issues.info}`);
  lines.push(`exit_code,${result.exitCode}`);

  return lines.join('\n');
}
