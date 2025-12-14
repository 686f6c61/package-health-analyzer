# package-health-analyzer

> Comprehensive dependency health analyzer for Node.js projects - combining age detection, license compliance, and security analysis into a single, fast tool.

[![npm version](https://img.shields.io/npm/v/package-health-analyzer.svg)](https://www.npmjs.com/package/package-health-analyzer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/tests-98%25%20coverage-brightgreen.svg)](https://github.com/686f6c61/package-health-analyzer)

[**Live Demo**](https://package-health-analyzer.onrender.com) | [NPM Package](https://www.npmjs.com/package/package-health-analyzer)

## The problem

Modern JavaScript projects rely on hundreds of dependencies. Each dependency introduces risk:

- **Outdated packages** may contain unpatched vulnerabilities
- **Deprecated packages** are no longer maintained and won't receive security updates
- **Incompatible licenses** can create legal liability for commercial projects
- **Poor quality licenses** with ambiguous legal terms create uncertainty
- **Complex dependency trees** make it difficult to track and maintain package health

Existing tools address pieces of this puzzle, but none provide a complete, fast solution that developers actually want to use.

## The solution

This tool analyzes all your dependencies in less than 5 seconds and gives you a clear health report covering multiple critical areas. It combines age detection, license compliance, and security analysis into a single, fast command.

Key capabilities include:

- **Age analysis** - Detects outdated and deprecated packages
- **License compliance** - Identifies commercial incompatibilities (GPL, AGPL, etc.)
- **Legal quality ratings** - Blue Oak Council ratings for license clarity
- **Multi-dimensional scoring** - Overall health score from 0-100
- **Smart upgrade paths** - Breaking change analysis and migration guidance
- **Actionable recommendations** - Prioritized list of what to fix first
- **Zero configuration** - Works out of the box with sensible defaults
- **CI/CD ready** - Built for automation with configurable exit codes

## Quick start

```bash
# Run without installation (recommended)
npx package-health-analyzer

# Check a specific package before installing
npx package-health-analyzer check moment

# Generate a configuration file
npx package-health-analyzer init
```

## Installation

```bash
# Global installation
npm install -g package-health-analyzer

# Local installation as dev dependency
npm install --save-dev package-health-analyzer

# Use with npx (no installation needed)
npx package-health-analyzer
```

## Features

### Comprehensive analysis

The tool performs deep analysis of every dependency in your project, examining multiple dimensions of package health beyond simple version checking.

Core analysis features include:

- **Age detection** - Identifies packages that haven't been updated in years
- **Deprecation warnings** - Catches deprecated packages before they cause issues
- **License categorization** - Commercial-friendly, copyleft, unknown, unlicensed
- **Blue Oak ratings** - Gold, Silver, Bronze, Lead ratings for license quality
- **Repository analysis** - Checks if packages have active GitHub repositories
- **Health scoring** - 0-100 score based on multiple health dimensions

### Fast and efficient

Performance is a priority. The tool is designed to analyze large dependency trees quickly without sacrificing accuracy.

Performance characteristics:

- Analyzes typical projects (100-200 dependencies) in under 5 seconds
- Intelligent caching reduces repeated API calls
- Parallel processing for maximum speed
- Minimal memory footprint

### Developer friendly

The tool is designed to integrate seamlessly into existing workflows with minimal configuration or learning curve.

Developer experience features:

- **Zero configuration required** - sensible defaults work for most projects
- **Beautiful CLI output** - color-coded severity levels for quick scanning
- **JSON/CSV export** - programmatic use and reporting
- **Flexible ignore rules** - scope, prefix, author, or specific packages
- **Pre-installation checks** - verify package health before adding to project

### Enterprise ready

Built for teams and organizations with compliance requirements and standardized workflows.

Enterprise features:

- **Project type awareness** - Commercial, SaaS, Open Source
- **CI/CD integration** - configurable exit codes
- **Compliance reporting** - for legal and security teams
- **Customizable thresholds** - for age, scoring, and severity
- **Configuration file support** - team-wide standards

## Commands

### `scan` (default)

Analyzes all dependencies in the current project.

```bash
package-health-analyzer scan [options]
# or simply
package-health-analyzer
```

#### Main options

The scan command accepts various options to customize the analysis behavior and output format.

| Option | Description | Default |
|--------|-------------|---------|
| `-d, --include-dev` | Include devDependencies in analysis | `false` |
| `--project-type <type>` | Project type: commercial, saas, open-source | `commercial` |
| `--age-warn <threshold>` | Warning threshold for package age (e.g., 2y) | `2y` |
| `--age-critical <threshold>` | Critical threshold for package age (e.g., 5y) | `5y` |
| `--fail-on <level>` | Fail on severity: none, info, warning, critical | `critical` |
| `--json` | Output results as JSON | `false` |
| `--csv` | Output results as CSV | `false` |
| `--config <path>` | Path to configuration file | auto-detect |

#### Ignore options

You can exclude specific packages or patterns from analysis using these ignore options.

| Option | Description | Example |
|--------|-------------|---------|
| `--ignore-scope <scopes...>` | Ignore packages by scope | `@types/* @babel/*` |
| `--ignore-prefix <prefixes...>` | Ignore packages by prefix | `eslint-* webpack-*` |
| `--ignore <packages...>` | Ignore specific packages | `moment lodash` |

#### Examples

```bash
# Basic scan of production dependencies
package-health-analyzer

# Include development dependencies
package-health-analyzer --include-dev

# SaaS project (extra AGPL warnings)
package-health-analyzer --project-type=saas

# Ignore development tools
package-health-analyzer --ignore-scope="@types/*" --ignore-prefix="eslint-*"

# JSON output for further processing
package-health-analyzer --json > report.json

# CSV output for spreadsheet analysis
package-health-analyzer --csv > licenses.csv

# Strict configuration for CI/CD
package-health-analyzer --fail-on=warning --age-warn=1y --age-critical=3y
```

### `check`

Check the health of a specific package before installing it.

```bash
package-health-analyzer check <package-name> [options]
```

This command helps you make informed decisions about which packages to add to your project.

#### Example

```bash
$ package-health-analyzer check moment

PACKAGE ANALYSIS: moment

BASIC INFO:
  Package: moment@2.30.1
  Published: 1 month ago (55 days)
  Repository: https://github.com/moment/moment

AGE ANALYSIS:
  Status: Recent (55 days old)
  Last publish: 2024-01-15
  Deprecated: No
  Severity: OK

LICENSE:
  License: MIT (commercial-friendly)
  SPDX ID: MIT
  Blue Oak Rating: Gold
  Commercial use: Yes
  Dual license: No

HEALTH SCORE:
  Overall: 95/100 (excellent)
  Dimensions:
    Age: 95/100
    Deprecation: 100/100
    License: 100/100
    Repository: 100/100

ASSESSMENT:
  Severity: OK
  Message: No issues detected
```

### `init`

Create a configuration file with default values.

```bash
package-health-analyzer init [options]
```

#### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--config <path>` | Output path for config file | `.packagehealthanalyzerrc.json` |

Creates a `.packagehealthanalyzerrc.json` file in the current directory with all available options documented.

```bash
# Create config file in current directory
package-health-analyzer init

# Create config file in custom location
package-health-analyzer init --config=config/deps.json
```

## CLI output

The default CLI output provides a clear, color-coded view of your dependency health:

```
package-health-analyzer

Project: my-app@1.0.0
Dependencies: 142
Scan duration: 2.34s

CRITICAL ISSUES

┌─────────────┬──────────┬────────────┬──────────┬───────┬────────────────────┐
│ Package     │ Version  │ Age        │ License  │ Score │ Issues             │
├─────────────┼──────────┼────────────┼──────────┼───────┼────────────────────┤
│ request     │ 2.88.2   │ 5 years    │ Apache-2 │ 12    │ Deprecated         │
│ gpl-package │ 1.0.0    │ 1 year     │ GPL-3.0  │ 0     │ License: GPL-3.0   │
└─────────────┴──────────┴────────────┴──────────┴───────┴────────────────────┘

WARNINGS

┌──────────────┬─────────┬─────────────┬─────────┬───────┬────────────────────┐
│ Package      │ Version │ Age         │ License │ Score │ Issues             │
├──────────────┼─────────┼─────────────┼─────────┼───────┼────────────────────┤
│ moment       │ 2.29.4  │ 3 years     │ MIT     │ 62    │ Old (3 years)      │
│ copyleft-lib │ 1.2.3   │ 2 years     │ LGPL-2  │ 58    │ License: LGPL-2.1  │
└──────────────┴─────────┴─────────────┴─────────┴───────┴────────────────────┘

SUMMARY

Excellent: 136 | Good: 3 | Fair: 2 | Poor: 1
Average health score: 87/100
Risk level: MEDIUM

Critical: 2 | Warnings: 2 | Info: 0

RECOMMENDATIONS

! request: Package is deprecated: No longer maintained
  Estimated effort: 2-4 hours

! gpl-package: License GPL-3.0 is incompatible with commercial use
```

### Blue Oak Council ratings

The Blue Oak Council provides quality ratings for open source licenses based on how well-drafted they are from a legal perspective. These ratings help you assess not just whether a license is compatible, but whether it's well-written and will hold up legally.

License quality indicators:

- **Gold** - Perfectly drafted, no legal ambiguities
- **Silver** - Very good with minor issues
- **Bronze** - Acceptable but with drafting problems
- **Lead** - Problematic, poorly drafted or confusing terms

## JSON output

The `--json` flag outputs structured data for programmatic use:

```json
{
  "meta": {
    "version": "0.1.0",
    "timestamp": "2025-12-08T10:00:00Z",
    "projectType": "commercial",
    "scanDuration": 2.34,
    "configSource": ".packagehealthanalyzerrc.json"
  },
  "project": {
    "name": "my-app",
    "version": "1.0.0",
    "type": "commercial"
  },
  "summary": {
    "total": 142,
    "excellent": 136,
    "good": 3,
    "fair": 2,
    "poor": 1,
    "averageScore": 87,
    "riskLevel": "medium",
    "issues": {
      "critical": 2,
      "warning": 2,
      "info": 0
    }
  },
  "packages": [
    {
      "package": "moment",
      "version": "2.29.4",
      "age": {
        "ageDays": 1247,
        "ageHuman": "3 years 5 months",
        "lastPublish": "2020-07-15T12:00:00Z",
        "deprecated": false,
        "severity": "warning",
        "hasRepository": true,
        "repositoryUrl": "https://github.com/moment/moment"
      },
      "license": {
        "license": "MIT",
        "spdxId": "MIT",
        "category": "commercial-friendly",
        "blueOakRating": "gold",
        "commercialUse": true,
        "isDualLicense": false,
        "hasPatentClause": false,
        "severity": "ok"
      },
      "score": {
        "overall": 62,
        "rating": "fair",
        "dimensions": {
          "age": 0.45,
          "deprecation": 1.0,
          "license": 1.0,
          "vulnerability": 0.8,
          "popularity": 0.9,
          "repository": 1.0,
          "updateFrequency": 0.4
        }
      },
      "overallSeverity": "warning"
    }
  ],
  "recommendations": [
    {
      "package": "request",
      "reason": "Package is deprecated: No longer maintained",
      "priority": "high",
      "estimatedEffort": "2-4 hours"
    }
  ],
  "exitCode": 1
}
```

## Configuration

`package-health-analyzer` uses cosmiconfig to search for configuration in the following locations (in order of priority):

1. Command line arguments (highest priority)
2. `.packagehealthanalyzerrc.json`
3. `.packagehealthanalyzerrc.yaml` or `.packagehealthanalyzerrc.yml`
4. `.packagehealthanalyzerrc.js`
5. `packagehealthanalyzer` field in `package.json`
6. Default values (lowest priority)

### Configuration file example

Create a `.packagehealthanalyzerrc.json` file in your project root:

```json
{
  "projectType": "commercial",
  "age": {
    "warn": "2y",
    "critical": "5y",
    "checkDeprecated": true,
    "checkRepository": true
  },
  "license": {
    "allow": ["MIT", "ISC", "BSD-2-Clause", "BSD-3-Clause", "Apache-2.0"],
    "deny": ["GPL-*", "AGPL-*"],
    "warn": ["LGPL-*"],
    "warnOnUnknown": true,
    "checkPatentClauses": true
  },
  "scoring": {
    "enabled": true,
    "minimumScore": 60,
    "boosters": {
      "age": 1.5,
      "deprecation": 4.0,
      "license": 3.0,
      "vulnerability": 2.0,
      "popularity": 1.0,
      "repository": 2.0,
      "updateFrequency": 1.5
    }
  },
  "ignore": {
    "scopes": ["@mycompany/*", "@types/*"],
    "prefixes": ["eslint-*"],
    "authors": ["internal-team@company.com"],
    "packages": ["legacy-lib"],
    "reasons": {
      "@mycompany/*": "Internal packages under company control",
      "@types/*": "TypeScript definitions, no runtime impact",
      "eslint-*": "Development tools, not in production"
    }
  },
  "includeDevDependencies": false,
  "failOn": "critical",
  "output": "cli",
  "cache": {
    "enabled": true,
    "ttl": 3600
  },
  "github": {
    "enabled": false,
    "token": "YOUR_GITHUB_TOKEN_HERE"
  },
  "upgradePath": {
    "enabled": true,
    "analyzeBreakingChanges": true,
    "suggestAlternatives": true,
    "fetchChangelogs": false,
    "estimateEffort": true
  }
}
```

### Configuration in package.json

You can also add configuration directly to your `package.json`:

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "packagehealthanalyzer": {
    "projectType": "commercial",
    "age": {
      "warn": "1y",
      "critical": "3y"
    },
    "license": {
      "deny": ["GPL-*", "AGPL-*"]
    },
    "failOn": "warning"
  }
}
```

### Configuration options reference

This section describes all available configuration options and their behavior.

#### Project type

Determines how licenses are evaluated:

- **`commercial`** (default): Strict about copyleft licenses (GPL, AGPL)
- **`saas`**: Extra strict about AGPL (network copyleft)
- **`open-source`**: More permissive, focuses on age and quality

#### Age thresholds

Configure how package age affects analysis results:

- **`warn`**: Package age that triggers a warning (e.g., "2y", "730d")
- **`critical`**: Package age that triggers critical severity (e.g., "5y", "1825d")
- **`checkDeprecated`**: Check if packages are marked as deprecated (default: `true`)
- **`checkRepository`**: Check if packages have a repository URL (default: `true`)

#### License configuration

Control license validation behavior with allow lists, deny lists, and warnings:

- **`allow`**: Whitelist of allowed licenses (bypasses other checks)
- **`deny`**: Blacklist of forbidden licenses (always critical)
- **`warn`**: Licenses that should generate warnings
- **`warnOnUnknown`**: Warn about unrecognized licenses (default: `true`)
- **`checkPatentClauses`**: Check for explicit patent grants (default: `true`)

#### Scoring

Configure the health scoring system:

- **`enabled`**: Enable health scoring (default: `true`)
- **`minimumScore`**: Minimum acceptable score 0-100 (default: `0`)
- **`boosters`**: Weight multipliers for each dimension (1.0-5.0)

#### Ignore rules

Define patterns for packages that should be excluded from analysis:

- **`scopes`**: Array of scope patterns to ignore (e.g., `["@types/*"]`)
- **`prefixes`**: Array of prefix patterns to ignore (e.g., `["eslint-*"]`)
- **`authors`**: Array of author emails/names to ignore
- **`packages`**: Array of specific package names to ignore
- **`reasons`**: Object mapping patterns to human-readable reasons

#### Behavior

Control general tool behavior and output options:

- **`includeDevDependencies`**: Include devDependencies in scan (default: `false`)
- **`failOn`**: Exit with non-zero code on: `none`, `info`, `warning`, `critical` (default: `critical`)
- **`output`**: Output format: `cli`, `json`, `csv` (default: `cli`)

## Use cases and examples

### 1. Pre-installation package check

Before adding a new dependency, check its health:

```bash
$ package-health-analyzer check axios

# Output shows:
# - Package age and deprecation status
# - License compatibility
# - Health score
# - Repository status
```

**Use this when:**
- Evaluating new dependencies
- Comparing alternative packages
- Making informed decisions about what to install

### 2. Commercial project audit

Strict scanning for commercial projects:

```bash
package-health-analyzer \
  --project-type=commercial \
  --fail-on=warning \
  --age-warn=1y \
  --age-critical=2y
```

**Ensures:**
- No GPL/AGPL licenses that require source disclosure
- All packages updated within the last 2 years
- No deprecated packages
- High legal quality (Blue Oak ratings)

### 3. Complete project analysis

Scan everything including development dependencies:

```bash
package-health-analyzer --include-dev --csv > full-report.csv
```

**Useful for:**
- Comprehensive project audits
- Security team reports
- Planning major upgrades
- Annual compliance reviews

### 4. Ignore internal and development tools

Focus on production dependencies that matter:

```bash
package-health-analyzer \
  --ignore-scope="@mycompany/*" \
  --ignore-scope="@types/*" \
  --ignore-prefix="eslint-" \
  --ignore-prefix="prettier-"
```

**Use cases:**
- Internal packages already controlled by your team
- Type definitions that don't affect runtime
- Development tools that don't go to production
- Reducing noise in reports

### 5. Legal compliance report

Generate reports for legal review:

```bash
# CSV format for spreadsheet software
package-health-analyzer --csv --include-dev > licenses-report.csv

# JSON format for automated processing
package-health-analyzer --json > compliance-report.json
```

**Useful for:**
- Legal team compliance reviews
- Quarterly dependency audits
- Integration with other compliance tools
- Documentation for auditors

### 6. SaaS project configuration

Special handling for SaaS applications:

```bash
package-health-analyzer --project-type=saas --fail-on=warning
```

**Why SaaS is different:**
- AGPL licenses require source disclosure even for network services
- Stricter requirements than standard commercial projects
- Critical for cloud-based applications

### 7. CI/CD integration

Automated checking in continuous integration:

```bash
# Fail build on critical issues
package-health-analyzer --fail-on=critical --json

# Strict mode - fail on warnings
package-health-analyzer --fail-on=warning --age-critical=3y
```

**Exit codes:**
- `0`: Success - no issues found
- `1`: Warnings found (if `--fail-on=warning`)
- `2`: Critical issues found
- `3`: Execution error

## Project types

### Commercial (default)

This project type is for proprietary commercial projects. It alerts on strong copyleft licenses (GPL, AGPL) that require releasing source code.

```bash
package-health-analyzer --project-type=commercial
```

**Treats as incompatible:**
- GPL-2.0, GPL-3.0
- AGPL-3.0
- SSPL-1.0

**Warns about:**
- LGPL (weak copyleft - requires review)
- MPL, EPL (require review for commercial use)

### SaaS

This project type is for Software as a Service applications. It includes additional warnings about AGPL, which requires code disclosure even for network services.

```bash
package-health-analyzer --project-type=saas
```

**Treats as incompatible:**
- All GPL variants
- AGPL (critical - applies to network services)
- SSPL

**Why this matters:**
AGPL's "network copyleft" clause means you must release your source code even if you only provide the software as a web service, not just when distributing binaries.

### Open source

This project type is for open source projects. It is more permissive with copyleft licenses, but still alerts on age, deprecation, and legal quality issues.

```bash
package-health-analyzer --project-type=open-source
```

**Allows:**
- GPL, LGPL, AGPL licenses
- Most copyleft licenses

**Still checks:**
- Package age and deprecation
- License legal quality (Blue Oak ratings)
- Repository availability

## License categories

### Commercial-friendly

These are permissive licenses that allow commercial use without restrictions:

- **MIT** - Simple and permissive
- **ISC** - Functionally identical to MIT
- **BSD-2-Clause** - Permissive with attribution
- **BSD-3-Clause** - BSD with non-endorsement clause
- **Apache-2.0** - Includes explicit patent grant
- **Unlicense** - Public domain equivalent
- **CC0-1.0** - Creative Commons public domain
- **0BSD** - BSD without attribution requirement

### Commercial-warning

These are weak copyleft licenses that require legal review:

- **LGPL-2.1, LGPL-3.0** - Weak copyleft, dynamic linking allowed
- **MPL-2.0** - Mozilla Public License, file-level copyleft
- **EPL-1.0, EPL-2.0** - Eclipse Public License
- **CDDL-1.0, CDDL-1.1** - Common Development and Distribution License

**Note:** These licenses typically allow commercial use if you dynamically link or use them as separate modules, but require legal review to ensure compliance.

### Commercial-incompatible

These are strong copyleft licenses that require releasing source code:

- **GPL-2.0, GPL-3.0** - Requires derivative works to use GPL
- **AGPL-3.0** - Network copyleft, applies to SaaS
- **SSPL-1.0** - Server Side Public License

**Impact:** Using these in commercial software typically requires you to release your source code under the same license.

### Unlicensed

These are packages without clear licensing:

- **UNLICENSED** - Explicitly marked as unlicensed
- **No license field** - Missing license information
- **Unrecognized licenses** - Non-standard license identifiers

**Risk:** Without a license, you have no legal right to use the software.

## CI/CD integration

### GitHub Actions

Add dependency health checks to your GitHub workflow:

```yaml
name: Dependency Health Check

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    # Run weekly on Monday at 9am UTC
    - cron: '0 9 * * 1'

jobs:
  dependency-health:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run dependency health check
        run: npx package-health-analyzer --fail-on=critical --json > dep-health-report.json

      - name: Upload health report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: dependency-health-report
          path: dep-health-report.json
          retention-days: 30

      - name: Comment PR with results
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const report = JSON.parse(fs.readFileSync('dep-health-report.json', 'utf8'));
            const comment = `## Dependency Health Check

            **Summary:** ${report.summary.total} dependencies analyzed
            - Excellent: ${report.summary.excellent}
            - Good: ${report.summary.good}
            - Fair: ${report.summary.fair}
            - Poor: ${report.summary.poor}

            **Risk Level:** ${report.summary.riskLevel.toUpperCase()}
            **Average Score:** ${report.summary.averageScore}/100

            **Issues:**
            - Critical: ${report.summary.issues.critical}
            - Warnings: ${report.summary.issues.warning}
            - Info: ${report.summary.issues.info}
            `;

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
```

### GitLab CI

Add to your `.gitlab-ci.yml`:

```yaml
dependency-health:
  stage: test
  image: node:20

  before_script:
    - npm ci

  script:
    - npx package-health-analyzer --fail-on=critical --json > dep-health-report.json

  artifacts:
    reports:
      json: dep-health-report.json
    paths:
      - dep-health-report.json
    expire_in: 30 days

  only:
    - merge_requests
    - main
    - develop
```

### Jenkins

Add to your `Jenkinsfile`:

```groovy
pipeline {
    agent any

    stages {
        stage('Dependency Health Check') {
            steps {
                sh 'npm ci'
                sh 'npx package-health-analyzer --fail-on=critical --json > dep-health-report.json'
            }
            post {
                always {
                    archiveArtifacts artifacts: 'dep-health-report.json', fingerprint: true
                }
            }
        }
    }
}
```

### CircleCI

Add to your `.circleci/config.yml`:

```yaml
version: 2.1

jobs:
  dependency-health:
    docker:
      - image: cimg/node:20.0

    steps:
      - checkout
      - restore_cache:
          keys:
            - v1-dependencies-{{ checksum "package-lock.json" }}
      - run: npm ci
      - save_cache:
          paths:
            - node_modules
          key: v1-dependencies-{{ checksum "package-lock.json" }}

      - run:
          name: Run dependency health check
          command: npx package-health-analyzer --fail-on=critical --json > dep-health-report.json

      - store_artifacts:
          path: dep-health-report.json
          destination: dependency-health

workflows:
  version: 2
  build-and-test:
    jobs:
      - dependency-health
```

### Exit codes

Understanding exit codes for CI/CD integration:

| Exit code | Meaning | When it occurs |
|-----------|---------|----------------|
| `0` | Success | No issues found, or all issues below configured threshold |
| `1` | Warnings | Warnings found and `--fail-on=warning` or `--fail-on=info` |
| `2` | Critical | Critical issues found and `--fail-on=critical` or higher |
| `3` | Error | Execution error (can't read package.json, network failure, etc.) |

**Configuration examples:**

```bash
# Fail only on critical issues (recommended for most projects)
package-health-analyzer --fail-on=critical

# Fail on warnings (strict mode for production)
package-health-analyzer --fail-on=warning

# Never fail (informational only)
package-health-analyzer --fail-on=none

# Fail on everything including info messages (very strict)
package-health-analyzer --fail-on=info
```

## Health scoring

Each package receives a health score from 0-100 based on multiple dimensions. The scoring system evaluates various aspects of package health and combines them into a single, easy-to-understand metric.

### Score dimensions

The health score is calculated using seven dimensions, each with a different weight reflecting its importance:

1. **Age (weight: 1.5x)** - How recently the package was updated
2. **Deprecation (weight: 4.0x)** - Whether the package is deprecated
3. **License (weight: 3.0x)** - License compatibility and quality
4. **Vulnerability (weight: 2.0x)** - Known security issues (future feature)
5. **Popularity (weight: 1.0x)** - Download statistics
6. **Repository (weight: 2.0x)** - Active repository presence
7. **Update Frequency (weight: 1.5x)** - How often the package is maintained

### Score ratings

Scores are categorized into four quality levels:

- **90-100** - Excellent: Best in class
- **80-89** - Good: Solid choice
- **60-79** - Fair: Acceptable with caveats
- **0-59** - Poor: Consider alternatives

### Customizing score weights

You can adjust the importance of each dimension in your configuration:

```json
{
  "scoring": {
    "boosters": {
      "age": 1.5,
      "deprecation": 4.0,
      "license": 3.0,
      "vulnerability": 2.0,
      "popularity": 1.0,
      "repository": 2.0,
      "updateFrequency": 1.5
    }
  }
}
```

**Example use cases:**

- **Security-focused**: Increase `vulnerability` and `deprecation` weights
- **Legal-focused**: Increase `license` weight
- **Stability-focused**: Increase `age` and `updateFrequency` weights

## Upgrade path analysis

When enabled, the tool provides intelligent upgrade guidance to help you plan and execute dependency updates safely.

### Features

The upgrade path analysis includes several key capabilities:

- **Breaking change detection** - Identifies major version jumps
- **Risk assessment** - Low, Medium, High risk ratings
- **Effort estimation** - Time required for upgrades
- **Alternative suggestions** - Better packages for deprecated dependencies
- **Migration guides** - Links to official migration documentation

### Configuration

Configure upgrade path analysis behavior with these options:

```json
{
  "upgradePath": {
    "enabled": true,
    "analyzeBreakingChanges": true,
    "suggestAlternatives": true,
    "fetchChangelogs": false,
    "estimateEffort": true
  }
}
```

### Known package alternatives

The tool includes built-in knowledge of common migration paths for deprecated or problematic packages:

- **moment** → `date-fns`, `dayjs`, `luxon`
- **request** → `axios`, `node-fetch`, `got`
- **lodash** → `lodash-es`, native ES6+

## Advanced configuration

### Multi-environment configuration

You can define different configurations for different environments:

```json
{
  "projectType": "commercial",
  "environments": {
    "production": {
      "includeDevDependencies": false,
      "failOn": "critical"
    },
    "development": {
      "includeDevDependencies": true,
      "failOn": "warning"
    }
  }
}
```

### Custom license rules

You can override default license categorization to match your organization's policies:

```json
{
  "license": {
    "allow": ["MIT", "Apache-2.0"],
    "deny": ["GPL-*", "AGPL-*", "Commons-Clause"],
    "warn": ["LGPL-*", "MPL-*"],
    "warnOnUnknown": true
  }
}
```

### Ignore rules with reasons

Document why packages are ignored for better team communication:

```json
{
  "ignore": {
    "packages": ["legacy-lib"],
    "scopes": ["@company/*"],
    "reasons": {
      "legacy-lib": "Required for backward compatibility, scheduled for removal in Q2",
      "@company/*": "Internal packages under company control and regular security audit"
    }
  }
}
```

## Troubleshooting

### Common issues

This section covers common problems you might encounter and their solutions.

#### "Package not found" errors

Some packages may not be available in the npm registry or may have been unpublished.

**Solution:**
```bash
# Check if package exists
npm view package-name

# If it's a private package, ensure you're authenticated
npm login
```

#### Rate limiting from npm registry

Heavy usage may trigger npm rate limits.

**Solution:**
```bash
# Enable caching to reduce API calls
{
  "cache": {
    "enabled": true,
    "ttl": 3600
  }
}
```

#### False positives for internal packages

Internal packages may trigger warnings incorrectly.

**Solution:**
```bash
# Ignore internal package scopes
package-health-analyzer --ignore-scope="@company/*"

# Or in config:
{
  "ignore": {
    "scopes": ["@company/*"]
  }
}
```

### Debug mode

Enable verbose logging for troubleshooting:

```bash
DEBUG=package-health-analyzer:* package-health-analyzer
```

## Development

### Setup

Clone and set up the project for development:

```bash
# Clone repository
git clone https://github.com/686f6c61/package-health-analyzer.git
cd package-health-analyzer

# Install dependencies
npm install

# Build
npm run build

# Run in development mode
npm run dev
```

### Testing

Run the test suite using these commands:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Code quality

Check code quality with type checking, linting, and formatting:

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Format code
npm run format
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `test:` Adding or updating tests
- `chore:` Maintenance tasks
- `perf:` Performance improvements
- `refactor:` Code refactoring
- `style:` Code style changes
- `ci:` CI/CD changes

### Development guidelines

Follow these guidelines when contributing code:

- Write tests for new features
- Maintain test coverage above 95%
- Update documentation for user-facing changes
- Follow TypeScript best practices
- Keep functions small and focused

## Roadmap

- [ ] **GitHub API Integration** - Enhanced repository analysis
- [ ] **Vulnerability Database** - Integration with npm audit and OSV
- [ ] **Historical Tracking** - Track dependency health over time
- [ ] **Team Dashboards** - Web UI for team-wide visibility
- [ ] **Slack/Discord Notifications** - Alert channels on issues
- [ ] **Auto-fix Suggestions** - Automated PR generation
- [ ] **Monorepo Support** - Handle workspaces and lerna projects
- [ ] **Docker Support** - Analyze dependencies in container images

## FAQ

### Q: How is this different from npm audit?

**A:** `npm audit` focuses on known security vulnerabilities. `package-health-analyzer` provides a broader analysis including:
- Package age and deprecation
- License compliance
- Legal quality assessment
- Health scoring
- Upgrade path recommendations

Both tools are complementary and should be used together.

### Q: Can this replace legal review?

**A:** No. This tool provides automated analysis to identify issues, but you should still have legal counsel review license compliance for commercial projects. Think of it as a first-pass filter, not a replacement for legal expertise.

### Q: How often should I run this?

**A:** We recommend:
- **On every PR** (CI/CD integration)
- **Weekly scheduled scans** for active projects
- **Before major releases**
- **After adding new dependencies**

### Q: Does this require internet access?

**A:** Yes, the tool needs to fetch package metadata from the npm registry. However, it includes intelligent caching to minimize API calls.

### Q: Can I use this with private npm packages?

**A:** Yes! Ensure you're authenticated with npm (`npm login`) and the tool will respect your npm credentials.

### Q: What about pnpm and yarn?

**A:** The tool reads from `package.json` and works with any package manager. It doesn't matter whether you use npm, yarn, or pnpm.

## License

MIT © [686f6c61](https://github.com/686f6c61)

See [LICENSE](LICENSE) file for details.

## Links

- [npm Package](https://www.npmjs.com/package/package-health-analyzer)
- [GitHub Repository](https://github.com/686f6c61/package-health-analyzer)
- [Issue Tracker](https://github.com/686f6c61/package-health-analyzer/issues)
- [Changelog](https://github.com/686f6c61/package-health-analyzer/blob/main/CHANGELOG.md)

## Acknowledgments

- [Blue Oak Council](https://blueoakcouncil.org/) for license quality ratings
- [SPDX](https://spdx.org/) for license standardization
- [npm](https://www.npmjs.com/) for package metadata
- The open source community for inspiration and feedback

---

Made by developers, for developers.
