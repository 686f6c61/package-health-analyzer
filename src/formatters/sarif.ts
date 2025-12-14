/**
 * package-health-analyzer - SARIF Output Formatter
 *
 * This module formats analysis results into SARIF (Static Analysis Results Interchange Format) v2.1.0,
 * enabling integration with security platforms, CI/CD pipelines, and code scanning tools like GitHub
 * Advanced Security, Azure DevOps, and GitLab Security Dashboard. SARIF provides a standardized way
 * to represent security vulnerabilities, license issues, and code quality findings.
 *
 * Key responsibilities:
 * - Generate SARIF v2.1.0 compliant JSON output with tool metadata and rules
 * - Map package health issues to SARIF results with appropriate severity levels
 * - Convert vulnerabilities (critical/high/moderate/low) to SARIF error/warning/note levels
 * - Include detailed rule definitions for each type of issue (CVE, deprecated, license, etc.)
 * - Provide rich metadata including package locations, versions, and remediation guidance
 * - Support integration with GitHub Code Scanning and other SARIF-compatible platforms
 *
 * SARIF severity mapping:
 * - error: Critical vulnerabilities, denied licenses, deprecated packages
 * - warning: High/moderate vulnerabilities, license warnings, old packages
 * - note: Low vulnerabilities, informational license issues
 *
 * @module formatters/sarif
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import type { ScanResult } from '../types/index.js';

interface SarifLog {
  $schema: string;
  version: string;
  runs: SarifRun[];
}

interface SarifRun {
  tool: {
    driver: {
      name: string;
      version: string;
      informationUri: string;
      rules: SarifRule[];
    };
  };
  results: SarifResult[];
}

interface SarifRule {
  id: string;
  name: string;
  shortDescription: {
    text: string;
  };
  fullDescription?: {
    text: string;
  };
  help?: {
    text: string;
  };
  defaultConfiguration: {
    level: 'error' | 'warning' | 'note';
  };
  properties?: {
    tags?: string[];
    'security-severity'?: string;
  };
}

interface SarifResult {
  ruleId: string;
  level: 'error' | 'warning' | 'note';
  message: {
    text: string;
  };
  locations: Array<{
    physicalLocation: {
      artifactLocation: {
        uri: string;
      };
      region?: {
        startLine: number;
        startColumn?: number;
      };
    };
  }>;
  properties?: {
    packageName?: string;
    packageVersion?: string;
    severity?: string;
    cvss?: number;
  };
}

/**
 * Format scan results as SARIF v2.1.0
 */
export function formatSarif(scanResult: ScanResult): string {
  const sarifLog: SarifLog = {
    $schema: 'https://json.schema.org/draft/2020-12/schema',
    version: '2.1.0',
    runs: [
      {
        tool: {
          driver: {
            name: 'package-health-analyzer',
            version: '2.0.0',
            informationUri: 'https://github.com/686f6c61/package-health-analyzer',
            rules: generateRules(),
          },
        },
        results: generateResults(scanResult),
      },
    ],
  };

  return JSON.stringify(sarifLog, null, 2);
}

/**
 * Generate SARIF rules for all possible issue types
 */
function generateRules(): SarifRule[] {
  return [
    {
      id: 'vulnerability-critical',
      name: 'Critical Vulnerability',
      shortDescription: {
        text: 'Package has critical security vulnerability',
      },
      fullDescription: {
        text: 'This package has one or more critical security vulnerabilities identified in the GitHub Advisory Database. Immediate action is required.',
      },
      help: {
        text: 'Update to a patched version or find an alternative package. Review the CVE details for specific remediation guidance.',
      },
      defaultConfiguration: {
        level: 'error',
      },
      properties: {
        tags: ['security', 'vulnerability', 'critical'],
        'security-severity': '9.0',
      },
    },
    {
      id: 'vulnerability-high',
      name: 'High Severity Vulnerability',
      shortDescription: {
        text: 'Package has high severity security vulnerability',
      },
      fullDescription: {
        text: 'This package has one or more high severity security vulnerabilities identified in the GitHub Advisory Database.',
      },
      help: {
        text: 'Update to a patched version as soon as possible. Review the CVE details for specific remediation guidance.',
      },
      defaultConfiguration: {
        level: 'error',
      },
      properties: {
        tags: ['security', 'vulnerability', 'high'],
        'security-severity': '7.0',
      },
    },
    {
      id: 'vulnerability-moderate',
      name: 'Moderate Severity Vulnerability',
      shortDescription: {
        text: 'Package has moderate severity security vulnerability',
      },
      defaultConfiguration: {
        level: 'warning',
      },
      properties: {
        tags: ['security', 'vulnerability', 'moderate'],
        'security-severity': '5.0',
      },
    },
    {
      id: 'vulnerability-low',
      name: 'Low Severity Vulnerability',
      shortDescription: {
        text: 'Package has low severity security vulnerability',
      },
      defaultConfiguration: {
        level: 'note',
      },
      properties: {
        tags: ['security', 'vulnerability', 'low'],
        'security-severity': '3.0',
      },
    },
    {
      id: 'deprecated-package',
      name: 'Deprecated Package',
      shortDescription: {
        text: 'Package is deprecated by maintainers',
      },
      fullDescription: {
        text: 'This package has been deprecated by its maintainers and should not be used in new projects.',
      },
      help: {
        text: 'Find an alternative package or migrate to the recommended replacement if specified by the maintainers.',
      },
      defaultConfiguration: {
        level: 'error',
      },
      properties: {
        tags: ['maintenance', 'deprecated'],
      },
    },
    {
      id: 'license-denied',
      name: 'Denied License',
      shortDescription: {
        text: 'Package uses a license that is explicitly denied',
      },
      fullDescription: {
        text: 'This package uses a license that has been explicitly denied in your project configuration.',
      },
      help: {
        text: 'Remove this package or get approval to use this license type. Consider finding an alternative with a compatible license.',
      },
      defaultConfiguration: {
        level: 'error',
      },
      properties: {
        tags: ['license', 'compliance'],
      },
    },
    {
      id: 'license-warning',
      name: 'License Warning',
      shortDescription: {
        text: 'Package uses a license that requires review',
      },
      fullDescription: {
        text: 'This package uses a license that has been flagged for review in your project configuration (copyleft, patent clauses, or other restrictions).',
      },
      help: {
        text: 'Review license terms with legal team to ensure compliance. Consider implications for your project type.',
      },
      defaultConfiguration: {
        level: 'warning',
      },
      properties: {
        tags: ['license', 'compliance', 'review-required'],
      },
    },
    {
      id: 'license-unknown',
      name: 'Unknown License',
      shortDescription: {
        text: 'Package has unknown or missing license',
      },
      fullDescription: {
        text: 'This package does not specify a license or uses an unrecognized license identifier.',
      },
      help: {
        text: 'Contact package maintainers to clarify licensing. Avoid using packages without clear licenses in production.',
      },
      defaultConfiguration: {
        level: 'warning',
      },
      properties: {
        tags: ['license', 'unknown'],
      },
    },
    {
      id: 'package-age-critical',
      name: 'Critically Old Package',
      shortDescription: {
        text: 'Package has not been updated in over 5 years',
      },
      fullDescription: {
        text: 'This package has not received updates for an extended period, indicating potential abandonment.',
      },
      help: {
        text: 'Consider finding an actively maintained alternative. Old packages may have unpatched security issues.',
      },
      defaultConfiguration: {
        level: 'warning',
      },
      properties: {
        tags: ['maintenance', 'age'],
      },
    },
    {
      id: 'low-popularity',
      name: 'Low Popularity Package',
      shortDescription: {
        text: 'Package has very low download counts',
      },
      fullDescription: {
        text: 'This package has very low weekly download counts, which may indicate limited community trust or usage.',
      },
      help: {
        text: 'Verify package quality and maintainer reputation before using in production.',
      },
      defaultConfiguration: {
        level: 'note',
      },
      properties: {
        tags: ['popularity', 'community'],
      },
    },
  ];
}

/**
 * Generate SARIF results from scan analysis
 */
function generateResults(scanResult: ScanResult): SarifResult[] {
  const results: SarifResult[] = [];

  for (const analysis of scanResult.packages) {
    // Vulnerability issues
    if (analysis.vulnerability && analysis.vulnerability.vulnerabilities.length > 0) {
      for (const vuln of analysis.vulnerability.vulnerabilities) {
        const level = mapVulnerabilityLevel(vuln.severity);
        const ruleId = `vulnerability-${vuln.severity}`;

        results.push({
          ruleId,
          level,
          message: {
            text: `${analysis.package}@${analysis.version}: ${vuln.summary} (${vuln.ghsaId}${vuln.cveId ? ', ' + vuln.cveId : ''})`,
          },
          locations: [
            {
              physicalLocation: {
                artifactLocation: {
                  uri: 'package.json',
                },
                region: {
                  startLine: 1, // Could be enhanced to find actual line
                },
              },
            },
          ],
          properties: {
            packageName: analysis.package,
            packageVersion: analysis.version,
            severity: vuln.severity,
          },
        });
      }
    }

    // Deprecated package
    if (analysis.age.deprecated) {
      results.push({
        ruleId: 'deprecated-package',
        level: 'error',
        message: {
          text: `${analysis.package}@${analysis.version} is deprecated${analysis.age.deprecationMessage ? ': ' + analysis.age.deprecationMessage : ''}`,
        },
        locations: [
          {
            physicalLocation: {
              artifactLocation: {
                uri: 'package.json',
              },
              region: {
                startLine: 1,
              },
            },
          },
        ],
        properties: {
          packageName: analysis.package,
          packageVersion: analysis.version,
        },
      });
    }

    // License issues
    if (analysis.license.severity === 'critical' && analysis.license.category === 'commercial-incompatible') {
      results.push({
        ruleId: 'license-denied',
        level: 'error',
        message: {
          text: `${analysis.package}@${analysis.version} uses denied license: ${analysis.license.license}`,
        },
        locations: [
          {
            physicalLocation: {
              artifactLocation: {
                uri: 'package.json',
              },
              region: {
                startLine: 1,
              },
            },
          },
        ],
        properties: {
          packageName: analysis.package,
          packageVersion: analysis.version,
        },
      });
    } else if (analysis.license.severity === 'warning') {
      const ruleId =
        analysis.license.category === 'unknown' ? 'license-unknown' : 'license-warning';
      results.push({
        ruleId,
        level: 'warning',
        message: {
          text: `${analysis.package}@${analysis.version}: License ${analysis.license.license} requires review (${analysis.license.category})`,
        },
        locations: [
          {
            physicalLocation: {
              artifactLocation: {
                uri: 'package.json',
              },
              region: {
                startLine: 1,
              },
            },
          },
        ],
        properties: {
          packageName: analysis.package,
          packageVersion: analysis.version,
        },
      });
    }

    // Age issues
    if (analysis.age.severity === 'critical') {
      results.push({
        ruleId: 'package-age-critical',
        level: 'warning',
        message: {
          text: `${analysis.package}@${analysis.version} has not been updated in ${analysis.age.ageHuman} (last: ${analysis.age.lastPublish})`,
        },
        locations: [
          {
            physicalLocation: {
              artifactLocation: {
                uri: 'package.json',
              },
              region: {
                startLine: 1,
              },
            },
          },
        ],
        properties: {
          packageName: analysis.package,
          packageVersion: analysis.version,
        },
      });
    }
  }

  return results;
}

/**
 * Map vulnerability severity to SARIF level
 */
function mapVulnerabilityLevel(severity: string): 'error' | 'warning' | 'note' {
  switch (severity) {
    case 'critical':
    case 'high':
      return 'error';
    case 'moderate':
      return 'warning';
    case 'low':
    default:
      return 'note';
  }
}
