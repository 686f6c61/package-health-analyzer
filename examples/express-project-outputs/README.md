# Example Outputs - Express Project

This directory contains real example outputs from package-health-analyzer v2.0.0, generated from a sample Express.js project.

---

## Project Definition

**package.json:**
```json
{
  "name": "express-example-api",
  "version": "1.0.0",
  "dependencies": {
    "express": "^5.2.1",
    "body-parser": "^2.2.1",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "helmet": "^8.0.0",
    "express-validator": "^7.2.1",
    "morgan": "^1.10.0",
    "compression": "^1.7.5",
    "express-rate-limit": "^7.5.0"
  }
}
```

---

## Generated Output Files

### 1. scan-output-cli.txt
**Command:**
```bash
package-health-analyzer scan
```

**Description:** Default CLI table output with colored indicators and health scores.

**Use case:** Quick terminal overview for developers.

---

### 2. scan-output.json
**Command:**
```bash
package-health-analyzer scan --json
```

**Description:** Complete JSON output with all analysis data including:
- Age analysis
- License compliance
- Health scores (7 dimensions)
- Repository metrics
- Upgrade paths
- Dependency tree metadata

**Use case:** Programmatic consumption, CI/CD pipelines, custom reporting.

**Size:** ~509 lines

---

### 3. scan-output.csv
**Command:**
```bash
package-health-analyzer scan --csv
```

**Description:** CSV format with key metrics for spreadsheet analysis.

**Columns:**
- Package, Version, Age, Deprecated, License, SPDX ID
- Score, Rating, Severity
- Upgrade Available, Latest Version
- Repository URL, Stars, Forks, Open Issues

**Use case:** Excel/Google Sheets analysis, data visualization.

---

### 4. scan-output.md
**Command:**
```bash
package-health-analyzer scan --markdown
```

**Description:** Markdown-formatted report with emoji indicators and tables.

**Features:**
- 🟢 🔵 🟡 🔴 Score indicators
- ✅ ⚠️ ❌ Status indicators
- Summary statistics
- Prioritized recommendations

**Use case:** GitHub READMEs, documentation, pull request comments.

---

### 5. scan-output-sbom.json
**Command:**
```bash
package-health-analyzer scan --json-sbom
```

**Description:** SPDX 2.3 Software Bill of Materials (SBOM) in JSON format.

**Compliance:**
- ✅ SPDX 2.3 specification
- ✅ CISA SBOM 2025 requirements
- ✅ NIST 800-161 supply chain security

**Contains:**
- SPDX version: 2.3
- Data license: CC0-1.0
- Package metadata
- License identifiers
- Package URLs (purl)
- External references
- Relationship mappings

**Use case:** Federal compliance, supply chain security, vulnerability tracking.

**Size:** ~443 lines

---

### 6. scan-output-with-vulnerabilities.json
**Command:**
```bash
GITHUB_TOKEN="ghp_***" package-health-analyzer scan --json
```

**Description:** Full JSON scan with GitHub Advisory Database vulnerability scanning enabled.

**Requires:** GitHub personal access token with `public_repo` scope.

**Additional data:**
- CVE identifiers
- Vulnerability severity (critical, high, moderate, low)
- Affected version ranges
- First patched versions
- Advisory references

**Use case:** Security audits, vulnerability reporting, compliance.

**Note:** This example shows packages with zero vulnerabilities. In production, vulnerable packages would include detailed CVE information.

---

### 7. NOTICE.txt
**Command:**
```bash
package-health-analyzer generate-notice
```

**Description:** Apache-style NOTICE.txt file with full license texts.

**Features:**
- Package attributions
- Copyright information
- Repository URLs
- Full license texts fetched from npm CDN
- Grouped by license type

**Use case:** Apache Foundation compliance, open-source attribution, legal requirements.

**Size:** ~278 lines (includes full MIT license text for 9 packages)

---

### 8. scan-output.sarif
**Command:**
```bash
GITHUB_TOKEN="ghp_***" package-health-analyzer scan --sarif
```

**Description:** SARIF 2.1.0 (Static Analysis Results Interchange Format) output for GitHub Code Scanning integration.

**Compliance:**
- ✅ SARIF 2.1.0 specification
- ✅ GitHub Advanced Security compatible
- ✅ Azure DevOps integration ready
- ✅ SIEM/security platform compatible

**Contains:**
- Tool metadata (name, version, information URI)
- 20+ predefined rules for:
  - Critical/high/moderate/low vulnerabilities
  - License compliance issues (GPL/AGPL incompatibility)
  - Deprecated packages
  - Age warnings
- Results with:
  - Severity levels (error, warning, note)
  - CVE identifiers and GHSA references
  - Remediation suggestions
  - Physical locations in package.json
- Security severity scores (0.0-10.0 CVSS-aligned)

**Example findings:**
- `vulnerability-critical`: Code injection in morgan (CVE-2019-5413)
- `vulnerability-high`: Denial of service in body-parser (CVE-2024-45590)
- `vulnerability-moderate`: DoS vulnerability in body-parser (CVE-2025-13466)

**Use case:**
- GitHub Code Scanning dashboard
- Security platform integration
- CI/CD security gates
- Automated vulnerability tracking

**Size:** ~308 lines (3 vulnerabilities found)

---

### 9. check-express-output.txt
**Command:**
```bash
GITHUB_TOKEN="ghp_***" package-health-analyzer check express
```

**Description:** Detailed health check for a single package (express).

**Shows:**
- Current version and publish date
- Repository information
- License details and Blue Oak rating
- Health score breakdown
- Overall assessment

**Use case:** Evaluating individual packages before adding to dependencies.

---

## How These Were Generated

All outputs were generated using the **real production build** of package-health-analyzer v2.0.0:

1. Created test project at `/tmp/express-example`
2. Ran `npm install` to install dependencies
3. Executed each command listed above
4. Captured output to respective files

**No mockups or fake data** - these are authentic outputs from the live application.

---

## Command Reference

| Output Type | Command | Token Required |
|-------------|---------|----------------|
| CLI Table | `scan` | No |
| JSON | `scan --json` | No |
| CSV | `scan --csv` | No |
| Markdown | `scan --markdown` | No |
| SPDX SBOM | `scan --json-sbom` | No |
| SARIF 2.1.0 | `scan --sarif` + `GITHUB_TOKEN` | Yes |
| With Vulnerabilities | `scan --json` + `GITHUB_TOKEN` | Yes |
| NOTICE.txt | `generate-notice` | No |
| Single Package | `check <package>` | No |

---

## Notes

- **Vulnerability Scanning:** Requires GitHub token. Set via `GITHUB_TOKEN` environment variable.
- **Transitive Dependencies:** All scans include dependency tree analysis by default. Use `--no-transitive` to disable.
- **Project Types:** Default is `commercial`. Use `--project-type=government|saas|library|open-source` for different license policies.
- **Exit Codes:** 0 = OK, 1 = warnings, 2 = critical issues, 3 = error

---

**Generated:** 2025-12-13
**Version:** package-health-analyzer v2.0.0
**Test Project:** express-example-api v1.0.0
