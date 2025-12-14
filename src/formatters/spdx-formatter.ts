/**
 * package-health-analyzer - SPDX SBOM Formatter
 *
 * This module generates Software Package Data Exchange (SPDX) 2.3 compliant Software Bill of Materials
 * (SBOM) documents for regulatory compliance, supply chain security, and vulnerability tracking. Organizations
 * choose this format to meet government requirements (Executive Order 14028), industry standards, and security
 * auditing needs where standardized machine-readable SBOMs are mandatory.
 *
 * Key responsibilities:
 * - Generating SPDX 2.3 specification-compliant SBOM JSON documents
 * - Creating package relationship graphs with DEPENDS_ON relationships
 * - Including Package URL (purl) external references for package identification
 * - Providing license information in SPDX license expression format
 * - Supporting regulatory compliance (NTIA, Executive Order 14028, EU Cyber Resilience Act)
 *
 * @module formatters/spdx-formatter
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import type { ScanResult } from '../types/index.js';

export interface SPDXDocument {
  spdxVersion: string;
  dataLicense: string;
  SPDXID: string;
  name: string;
  documentNamespace: string;
  creationInfo: {
    created: string;
    creators: string[];
    licenseListVersion: string;
  };
  packages: SPDXPackage[];
  relationships: SPDXRelationship[];
}

export interface SPDXPackage {
  SPDXID: string;
  name: string;
  versionInfo: string;
  downloadLocation: string;
  filesAnalyzed: boolean;
  licenseConcluded: string;
  licenseDeclared: string;
  copyrightText: string;
  externalRefs?: Array<{
    referenceCategory: string;
    referenceType: string;
    referenceLocator: string;
  }>;
}

export interface SPDXRelationship {
  spdxElementId: string;
  relationshipType: string;
  relatedSpdxElement: string;
}

/**
 * Format scan result as SPDX 2.3 SBOM
 */
export function formatSPDX(result: ScanResult): SPDXDocument {
  const timestamp = new Date().toISOString();

  const doc: SPDXDocument = {
    spdxVersion: 'SPDX-2.3',
    dataLicense: 'CC0-1.0',
    SPDXID: 'SPDXRef-DOCUMENT',
    name: `${result.project.name}-${result.project.version}`,
    documentNamespace: `https://sbom.${result.project.name}/${result.project.version}/${timestamp}`,
    creationInfo: {
      created: timestamp,
      creators: [
        'Tool: package-health-analyzer-2.0.0',
      ],
      licenseListVersion: '3.27.0',
    },
    packages: [],
    relationships: [],
  };

  // Add root package
  doc.packages.push({
    SPDXID: 'SPDXRef-Package-root',
    name: result.project.name,
    versionInfo: result.project.version,
    downloadLocation: 'NOASSERTION',
    filesAnalyzed: false,
    licenseConcluded: 'NOASSERTION',
    licenseDeclared: 'NOASSERTION',
    copyrightText: 'NOASSERTION',
  });

  // Add dependencies
  result.packages.forEach((pkg, index) => {
    const spdxId = `SPDXRef-Package-${index + 1}`;

    doc.packages.push({
      SPDXID: spdxId,
      name: pkg.package,
      versionInfo: pkg.version,
      downloadLocation: `https://registry.npmjs.org/${pkg.package}/-/${pkg.package}-${pkg.version}.tgz`,
      filesAnalyzed: false,
      licenseConcluded: pkg.license.license || 'NOASSERTION',
      licenseDeclared: pkg.license.license || 'NOASSERTION',
      copyrightText: 'NOASSERTION',
      externalRefs: [
        {
          referenceCategory: 'PACKAGE-MANAGER',
          referenceType: 'purl',
          referenceLocator: `pkg:npm/${pkg.package}@${pkg.version}`,
        },
      ],
    });

    // Add relationship
    doc.relationships.push({
      spdxElementId: 'SPDXRef-Package-root',
      relationshipType: 'DEPENDS_ON',
      relatedSpdxElement: spdxId,
    });
  });

  return doc;
}
