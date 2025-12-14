# Compliance Guide

## Overview

package-health-analyzer v2.0.0 provides comprehensive compliance features for legal, security, and regulatory requirements.

---

## SPDX 2.3 SBOM (Software Bill of Materials)

### What is SPDX?

SPDX (Software Package Data Exchange) is an open standard for communicating software bill of material information. Version 2.3 is the latest stable release.

### Generating SPDX SBOM

```bash
# Export SBOM in SPDX 2.3 JSON format
package-health-analyzer scan --json-sbom > sbom.spdx.json
```

The generated SPDX SBOM is a comprehensive machine-readable document that serves as your official software bill of materials. It conforms to the SPDX 2.3 specification and can be validated using standard SPDX tools. This output is accepted by government agencies, security scanners, and compliance automation systems worldwide.

**Each SBOM document includes the following elements:**

- **SPDX version**: 2.3 (latest stable specification)
- **Data license**: CC0-1.0 (public domain dedication for the SBOM itself)
- **Document namespace**: Unique identifier with UUID to ensure global uniqueness
- **Creation info**: Precise timestamp and tool version for audit trails
- **Package information**: Complete metadata for all analyzed dependencies
- **License identifiers**: Standardized SPDX format for legal clarity
- **Package URLs (purl)**: Universal package identifiers for npm ecosystem
- **External references**: Links to homepages, repositories, and documentation
- **Relationship mapping**: Explicit DEPENDS_ON and CONTAINS relationships for dependency trees

**Example SPDX document:**
```json
{
  "spdxVersion": "SPDX-2.3",
  "dataLicense": "CC0-1.0",
  "SPDXID": "SPDXRef-DOCUMENT",
  "name": "my-project-2.0.0",
  "documentNamespace": "https://package-health-analyzer/spdx/my-project-2.0.0-uuid",
  "creationInfo": {
    "created": "2025-12-13T00:00:00Z",
    "creators": ["Tool: package-health-analyzer-2.0.0"],
    "licenseListVersion": "3.27.0"
  },
  "packages": [
    {
      "SPDXID": "SPDXRef-Package-1",
      "name": "express",
      "versionInfo": "4.18.2",
      "licenseConcluded": "MIT",
      "externalRefs": [{
        "referenceCategory": "PACKAGE-MANAGER",
        "referenceType": "purl",
        "referenceLocator": "pkg:npm/express@4.18.2"
      }]
    }
  ],
  "relationships": [
    {
      "spdxElementId": "SPDXRef-DOCUMENT",
      "relationshipType": "DESCRIBES",
      "relatedSpdxElement": "SPDXRef-Package-1"
    }
  ]
}
```

---

## CISA SBOM 2025 Compliance

### What is CISA SBOM?

The Cybersecurity and Infrastructure Security Agency (CISA) requires SBOMs for federal software supply chain security.

### Requirements Met

Our tool meets all baseline requirements mandated by CISA for federal software supply chain security, plus additional recommended elements that provide enhanced visibility and security assurance. This comprehensive coverage ensures your SBOMs pass government validation tools and meet executive order requirements.

**[REQUIRED] Baseline Elements (Required by CISA):**

The minimum fields required for federal compliance. Every SBOM we generate includes these fundamental data points that form the foundation of supply chain visibility:

- **Supplier name**: Package author/maintainer identification
- **Component name**: Official npm package identifier
- **Version of component**: Semantic version or dist-tag
- **Other unique identifiers**: Package URLs (purl) and CPE identifiers where applicable
- **Dependency relationship**: Parent-child dependency mappings
- **Author of SBOM data**: Tool identification (package-health-analyzer v2.0.0)
- **Timestamp**: ISO 8601 formatted scan execution time

**[ENHANCED] Additional Elements (Recommended for Enhanced Security):**

Beyond the baseline, we include these enriched fields that provide deeper insights for security analysis and compliance verification:

- **License information**: SPDX identifiers for legal compliance automation
- **Component hash**: npm package integrity checksums (sha512)
- **External references**: Repository URLs, homepages, and issue trackers
- **Nested dependencies**: Complete transitive dependency analysis up to 10 layers deep

### Generating CISA-Compliant SBOM

```bash
# Full dependency tree with transitive analysis
package-health-analyzer scan --json > sbom-cisa.json

# Include devDependencies
package-health-analyzer scan --include-dev --json > sbom-cisa-full.json
```

**Validation:**
- All components have unique identifiers (name@version)
- Relationships tracked via dependency tree
- Timestamps in ISO 8601 format
- SPDX license identifiers used
- Tool and version documented

---

## NIST 800-161 Supply Chain Security

### What is NIST 800-161?

NIST Special Publication 800-161 provides guidance for supply chain risk management (C-SCRM) for federal information systems.

### Controls Implemented

#### 1. Component Inventory (SA-5)
```bash
# Generate complete component inventory
package-health-analyzer scan --json
```

This control ensures complete visibility into your software supply chain by maintaining an exhaustive inventory of every component, both direct and transitive. The analyzer automatically discovers and catalogs all dependencies, creating a comprehensive map of your software's building blocks.

**The inventory tracking system captures:**

- **All direct dependencies**: Packages explicitly listed in your package.json
- **All transitive dependencies**: Nested dependencies up to 10 layers deep for complete visibility
- **Version information**: Exact versions installed, including lockfile resolution
- **License information**: SPDX identifiers for every component
- **Source repositories**: Git repository URLs for provenance tracking

#### 2. Vulnerability Management (RA-5)
```bash
# Scan for known vulnerabilities
GITHUB_TOKEN="YOUR_GITHUB_TOKEN_HERE" package-health-analyzer scan
```

Real-time vulnerability management powered by the GitHub Advisory Database provides continuous security monitoring for your entire dependency tree. This automated scanning identifies known security issues before they reach production, enabling proactive risk mitigation.

**The vulnerability scanner provides:**

- **CVE identification**: GHSA and CVE identifiers for every known security issue
- **Severity classification**: CVSS-based ratings (critical, high, moderate, low)
- **Affected version ranges**: Precise version constraints showing vulnerable releases
- **Advisory links**: Direct links to GitHub Security Advisories with full details
- **Mitigation guidance**: Recommended actions including version upgrades and patches

#### 3. License Compliance (SA-15)
```bash
# Check license compliance for project type
package-health-analyzer scan --project-type=government
```

**Government project defaults:**
- Denies: GPL-*, AGPL-*, SSPL-*
- Warns: LGPL-*, MPL-*
- Minimum score: 70
- Fail on: warning

#### 4. Dependency Tracking (CM-8)
```bash
# Generate dependency tree with relationships
package-health-analyzer scan --json
```

**Tree includes:**
- Parent-child relationships
- Depth indicators (layer 0-10)
- Circular dependency detection
- Duplicate version tracking
- Total nodes count

#### 5. Secure Configuration (CM-6)
```bash
# Initialize with secure defaults
package-health-analyzer init

# Use environment variables for tokens
export GITHUB_TOKEN="YOUR_GITHUB_TOKEN_HERE"
```

**Security measures:**
- Token encryption (AES-256-GCM)
- File permission validation
- Plaintext token detection
- Automatic token masking

---

## Apache Software Foundation Compliance

### NOTICE.txt Generation

Apache-style NOTICE.txt files are required for ASF projects and recommended for all open-source projects.

**Generate NOTICE.txt:**
```bash
# Apache format (full license texts)
package-health-analyzer generate-notice

# Simple format (attribution only)
package-health-analyzer generate-notice --format=simple

# With transitive dependencies
package-health-analyzer generate-notice --include-transitive

# Grouped by license
package-health-analyzer generate-notice --group-by-license
```

**Apache format includes:**
```
NOTICE

my-project
Copyright 2025 Your Name

This product includes software developed by third parties:

================================================================================
express (4.18.2)
================================================================================
License: MIT
Repository: https://github.com/expressjs/express
Copyright: 2009-2014 TJ Holowaychuk <tj@vision-media.ca>

[Full MIT License Text]

...
```

**Simple format includes:**
```
NOTICE

my-project uses the following third-party packages:

- express 4.18.2 (MIT) - https://github.com/expressjs/express
- lodash 4.17.21 (MIT) - https://github.com/lodash/lodash
...
```

### What to Include in Your NOTICE.txt

When generating NOTICE.txt files, you have flexibility in choosing the level of detail based on your project's needs and legal requirements. The tool supports three tiers of attribution: required elements for basic compliance, recommended elements for professional projects, and optional enhancements for comprehensive documentation.

**Required Elements (Minimum Legal Compliance):**

These fields are legally necessary to satisfy most open source license requirements and provide proper attribution to third-party authors:

- **Package name and version**: Exact identification of each third-party component
- **License identifier (SPDX)**: Machine-readable license designation (e.g., MIT, Apache-2.0)
- **Copyright information**: Copyright holder names and years from package metadata
- **Repository URL**: Source code location for transparency and verification

**Recommended Elements (Professional Standard):**

For production applications and distributed software, include these additional fields to demonstrate thorough compliance practices and facilitate future audits:

- **Full license text (Apache format)**: Complete license text for each unique license type
- **Author information**: Maintainer names and contact details where available
- **Homepage URL**: Project website for user reference and support

**Optional Elements (Enhanced Documentation):**

Advanced options for organizations with strict compliance requirements or projects seeking comprehensive attribution documentation:

- **Grouped by license type**: Organize packages by license family for easier review
- **Transitive dependencies**: Include nested dependencies for complete supply chain visibility
- **Development dependencies**: Document build-time and testing tools for full transparency

---

## License Compliance by Project Type

### Commercial Projects

```json
{
  "projectType": "commercial",
  "license": {
    "deny": ["GPL-*", "AGPL-*", "SSPL-*"],
    "warn": ["LGPL-*", "MPL-*", "EPL-*"]
  },
  "scoring": {
    "minimumScore": 60
  },
  "failOn": "critical"
}
```

**Legal Rationale for These Restrictions:**

Understanding why certain licenses are problematic for commercial software helps teams make informed decisions about dependencies and avoid legal complications down the road:

- **GPL/AGPL require source disclosure**: These strong copyleft licenses mandate that you publish your entire application source code if you distribute the software
- **SSPL has cloud restrictions**: The Server Side Public License specifically targets SaaS providers, requiring source disclosure for cloud-based services
- **LGPL requires dynamic linking consideration**: Lesser GPL allows use if dynamically linked, but static linking may trigger copyleft obligations
- **MPL/EPL require file-level copyleft**: Mozilla and Eclipse licenses require publishing modifications to library files, though your code remains proprietary

### SaaS Projects

```json
{
  "projectType": "saas",
  "license": {
    "deny": ["AGPL-*", "SSPL-*"],
    "warn": ["GPL-*", "LGPL-*", "MPL-*"]
  },
  "scoring": {
    "minimumScore": 65
  },
  "failOn": "warning"
}
```

**Rationale:**
- AGPL triggers on network use
- SSPL specifically targets SaaS
- GPL may require disclosure depending on distribution model

### Library/SDK Projects

```json
{
  "projectType": "library",
  "license": {
    "deny": ["GPL-*", "AGPL-*", "LGPL-*"],
    "warn": ["MPL-*", "EPL-*"]
  },
  "scoring": {
    "minimumScore": 70
  },
  "failOn": "warning"
}
```

**Rationale:**
- Libraries should use permissive licenses
- Copyleft licenses limit adoption
- Downstream users need maximum flexibility

### Government Projects

```json
{
  "projectType": "government",
  "license": {
    "deny": ["GPL-*", "AGPL-*", "SSPL-*"],
    "warn": ["LGPL-*", "MPL-*"]
  },
  "scoring": {
    "minimumScore": 70
  },
  "failOn": "warning"
}
```

**Rationale:**
- Government procurement often requires permissive licenses
- Source disclosure may conflict with security requirements
- Public sector prefers MIT, Apache-2.0, BSD

---

## Audit Reports

### Generate Compliance Reports

**JSON (machine-readable):**
```bash
package-health-analyzer scan --json > audit-report.json
```

**CSV (spreadsheet):**
```bash
package-health-analyzer scan --csv > audit-report.csv
```

**Markdown (human-readable):**
```bash
package-health-analyzer scan --output=md > audit-report.md
```

### Report Contents

Every compliance report generated by the tool provides a comprehensive snapshot of your software's dependency health and security posture. These reports are designed to serve multiple audiences: developers need technical details for remediation, managers need summary metrics for decision-making, and auditors need complete data trails for compliance verification.

**All report formats include these core elements:**

- **Package inventory**: Complete list of all dependencies with exact versions
- **License information**: SPDX identifiers and compatibility analysis
- **Vulnerability counts by severity**: Breakdown of CVEs by criticality level
- **Dependency tree metadata**: Relationship graphs showing package hierarchy
- **Health scores**: 0-100 ratings across 7 dimensions for each package
- **Recommendations**: Prioritized action items for upgrades and replacements
- **Timestamp and tool version**: Audit trail showing when and how the scan was performed

**Additional metadata introduced in v2.0:**

Enhanced visibility features that provide deeper insights into dependency structure and potential issues:

- **Tree depth per package**: Layer number showing how far removed each dependency is from your code
- **Parent package tracking**: Direct ancestor identification for transitive dependencies
- **Circular dependency flags**: Warnings when packages create cyclical reference loops
- **Duplicate version flags**: Detection of multiple versions of the same package in your tree
- **Repository metrics**: GitHub statistics including stars, forks, open issues, and archived status

---

## Continuous Compliance

### CI/CD Integration

**GitHub Actions:**
```yaml
name: Dependency Compliance

on: [push, pull_request]

jobs:
  compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Analyze dependencies
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          npx package-health-analyzer scan \
            --project-type=commercial \
            --fail-on=critical \
            --json > compliance-report.json

      - name: Upload SBOM
        uses: actions/upload-artifact@v3
        with:
          name: sbom
          path: compliance-report.json

      - name: Generate NOTICE.txt
        run: npx package-health-analyzer generate-notice

      - name: Commit NOTICE.txt
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add NOTICE.txt
          git diff --staged --quiet || git commit -m "Update NOTICE.txt"
          git push
```

**GitLab CI:**
```yaml
compliance:
  stage: test
  script:
    - npx package-health-analyzer scan --fail-on=critical --json
  artifacts:
    reports:
      sbom: compliance-report.json
```

### Scheduled Audits

```yaml
on:
  schedule:
    - cron: '0 0 * * 1'  # Every Monday at midnight
```

---

## Compliance Checklist

### For Every Release

- [ ] Generate fresh SBOM (`--json`)
- [ ] Update NOTICE.txt (`generate-notice`)
- [ ] Scan for vulnerabilities (with `GITHUB_TOKEN`)
- [ ] Check license compliance (`--project-type`)
- [ ] Review dependency tree for circulars
- [ ] Verify no denied licenses
- [ ] Ensure minimum health score met
- [ ] Archive compliance reports
- [ ] Update security documentation

### For Audits

- [ ] Historical SBOM records
- [ ] Vulnerability scan history
- [ ] License policy documentation
- [ ] Third-party attribution (NOTICE.txt)
- [ ] Dependency tree analysis
- [ ] Tool configuration files
- [ ] CI/CD pipeline logs

---

## Standards Reference

| Standard | Version | Compliance | Documentation |
|----------|---------|------------|---------------|
| SPDX | 2.3 | [FULL] Full | https://spdx.dev/specifications/ |
| CISA SBOM | 2025 | [FULL] Full | https://www.cisa.gov/sbom |
| NIST 800-161 | Rev 1 | [PARTIAL] Partial | https://csrc.nist.gov/publications/detail/sp/800-161/rev-1/final |
| Apache NOTICE | Current | [FULL] Full | https://www.apache.org/licenses/LICENSE-2.0.html#notices |
| Blue Oak Council | 2023 | [FULL] Full | https://blueoakcouncil.org/list |

---

**Last Updated:** 2025-12-13
**Version:** 2.0.0
