# package-health-analyzer

> Comprehensive dependency health analyzer for Node.js projects - combining age detection, license compliance, and security analysis into a single, fast tool.

[![npm version](https://img.shields.io/npm/v/package-health-analyzer.svg)](https://www.npmjs.com/package/package-health-analyzer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/tests-98%25%20coverage-brightgreen.svg)](https://github.com/686f6c61/package-health-analyzer)

[**Live Demo**](https://package-health-analyzer.onrender.com) | [**Complete Documentation**](https://package-health-analyzer.onrender.com) | [NPM Package](https://www.npmjs.com/package/package-health-analyzer)

## The problem

Modern JavaScript projects rely on hundreds of dependencies. Each dependency introduces risk:

- **Outdated packages** may contain unpatched vulnerabilities
- **Deprecated packages** are no longer maintained and won't receive security updates
- **Incompatible licenses** can create legal liability for commercial projects
- **Complex dependency trees** make it difficult to track and maintain package health

Existing tools address pieces of this puzzle, but none provide a complete, fast solution that developers actually want to use.

## The solution

This tool analyzes all your dependencies in less than 5 seconds and gives you a clear health report covering multiple critical areas:

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

**For detailed guides, examples, and use cases, visit the complete documentation at [package-health-analyzer.onrender.com](https://package-health-analyzer.onrender.com)**

## Installation

```bash
# Global installation
npm install -g package-health-analyzer

# Local installation as dev dependency
npm install --save-dev package-health-analyzer

# Use with npx (no installation needed)
npx package-health-analyzer
```

## Commands

### `scan` (default)

Analyzes all dependencies in the current project.

```bash
package-health-analyzer scan [options]
# or simply
package-health-analyzer
```

**Main options:**

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

**Ignore options:**

| Option | Description | Example |
|--------|-------------|---------|
| `--ignore-scope <scopes...>` | Ignore packages by scope | `@types/* @babel/*` |
| `--ignore-prefix <prefixes...>` | Ignore packages by prefix | `eslint-* webpack-*` |
| `--ignore <packages...>` | Ignore specific packages | `moment lodash` |

**Examples:**

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
package-health-analyzer --csv > report.csv

# Plain text output
package-health-analyzer --output=txt > report.txt

# Markdown report
package-health-analyzer --output=md > report.md

# Strict configuration for CI/CD
package-health-analyzer --fail-on=warning --age-warn=1y --age-critical=3y
```

### `check`

Check the health of a specific package before installing it.

```bash
package-health-analyzer check <package-name> [options]
```

**Example:**

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

LICENSE:
  License: MIT (commercial-friendly)
  Blue Oak Rating: Gold
  Commercial use: Yes

HEALTH SCORE:
  Overall: 95/100 (excellent)
```

### `init`

Create a configuration file with interactive or default setup.

```bash
package-health-analyzer init
```

**Interactive Mode:**

When you run `init`, you'll choose between:
- **Default values**: Creates `.packagehealthanalyzerrc.json` with recommended settings instantly
- **Guided configuration**: Step-by-step wizard asking about project type, age thresholds, licenses, scoring, security, and more

**What it does:**

1. Checks if a config file already exists (asks before overwriting)
2. Asks how you want to configure (default vs. guided)
3. In guided mode, walks through 12 key configuration decisions
4. Validates your choices using Zod schema
5. Creates `.packagehealthanalyzerrc.json` in the current directory
6. Shows next steps and links to documentation

**Example outputs:**

Default mode:
```
📦 Package Health Analyzer - Configuración Inicial

? ¿Cómo quieres configurar package-health-analyzer? Valores por defecto

Usando valores por defecto...

✓ Configuración creada exitosamente!
```

Guided mode:
```
? ¿Cómo quieres configurar package-health-analyzer? Configuración guiada
? ¿Qué tipo de proyecto es? Commercial
? ¿Incluir devDependencies en el análisis? No
? Umbral de edad para WARNING: 2 años (recomendado)
? Umbral de edad para CRITICAL: 5 años (recomendado)
? Licencias DENEGADAS (marcar con espacio): (none selected)
? Licencias con WARNING (marcar con espacio): LGPL-*, MPL-2.0, EPL-*
? Score mínimo de salud (0-100): 0 - Sin mínimo (recomendado)
? Nivel de severidad para fallar: critical - Solo en critical
? Formato de salida por defecto: cli - Tabla en terminal
? ¿Habilitar análisis de seguridad avanzado? No
? Ignorar packages por scope: Ninguno
? Ignorar packages por prefijo: Ninguno

✓ Configuración creada exitosamente!
```

**Cancellation:**

Press `Ctrl+C` at any time to cancel without creating a file.

---

**For complete command reference with detailed examples, visit [package-health-analyzer.onrender.com](https://package-health-analyzer.onrender.com)**

---

## Configuration

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
    "warnOnUnknown": true
  },
  "scoring": {
    "enabled": true,
    "minimumScore": 60
  },
  "ignore": {
    "scopes": ["@mycompany/*", "@types/*"],
    "prefixes": ["eslint-*"],
    "packages": ["legacy-lib"]
  },
  "includeDevDependencies": false,
  "failOn": "critical",
  "output": "cli"
}
```

**Note:** For a complete example with all options and comments, see [examples/config-example.json](examples/config-example.json).

### Configuration Examples by Project Type

#### Commercial/Enterprise Projects

Strict configuration focused on license compliance and stability:

```json
{
  "projectType": "commercial",
  "age": {
    "warn": "1y",
    "critical": "3y"
  },
  "license": {
    "deny": ["GPL-*", "AGPL-*", "SSPL-*"],
    "warn": ["LGPL-*", "MPL-2.0"]
  },
  "scoring": {
    "minimumScore": 70
  },
  "ignore": {
    "scopes": ["@types/*"],
    "prefixes": ["@testing-library/*"]
  },
  "failOn": "warning"
}
```

**Use case:** Financial services, healthcare, or any regulated industry where license compliance is critical.

#### SaaS Projects

Balanced configuration with extra AGPL awareness:

```json
{
  "projectType": "saas",
  "age": {
    "warn": "2y",
    "critical": "5y"
  },
  "license": {
    "deny": ["GPL-*", "AGPL-*"],
    "warn": ["LGPL-*", "MPL-2.0"]
  },
  "scoring": {
    "minimumScore": 60
  },
  "includeDevDependencies": false,
  "failOn": "critical"
}
```

**Use case:** Cloud-based applications, web apps, API services where AGPL's network clause is a concern.

#### Open Source Projects

Permissive configuration accepting most licenses:

```json
{
  "projectType": "open-source",
  "age": {
    "warn": "3y",
    "critical": "7y"
  },
  "license": {
    "deny": [],
    "warn": ["AGPL-*"]
  },
  "scoring": {
    "minimumScore": 0
  },
  "includeDevDependencies": true,
  "failOn": "critical"
}
```

**Use case:** Public repositories, community projects where copyleft licenses are acceptable.

---

### Configuration in package.json

You can also add configuration to your `package.json`:

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

## Configuration Reference

Complete documentation of all available configuration options.

### Project Type

Define your project type to apply appropriate license checks and compliance rules.

```json
"projectType":
  | "commercial"
  | "saas"
  | "open-source"
  | "personal"
  | "internal"
  | "library"
  | "startup"
  | "government"
  | "educational"
  | "custom"
```

#### Project Types:

- **`commercial`** - Proprietary/closed-source projects. Strict GPL/AGPL blocking for commercial safety.
- **`saas`** - Software as a Service. Extra AGPL warnings (network copyleft applies).
- **`open-source`** - Public/community projects. Permissive with copyleft licenses.
- **`personal`** - Personal/hobby projects. Very relaxed license policies, no commercial concerns.
- **`internal`** - Enterprise internal tools. More permissive (internal use only, not distributed).
- **`library`** - npm packages/libraries. Focus on distribution-compatible licenses for reusability.
- **`startup`** - Early-stage startup projects. Balance between speed and basic compliance.
- **`government`** - Public sector/governmental projects. Specific regulatory requirements and audits.
- **`educational`** - Academic/educational projects. Very permissive, focus on learning.
- **`custom`** - Fully customized configuration. Define your own license policies from scratch.

---

### Age Thresholds

Configure when packages are considered outdated.

```json
"age": {
  "warn": "2y",
  "critical": "5y",
  "checkDeprecated": true,
  "checkRepository": true
}
```

**Fields:**
- **`warn`** (string) - Warning threshold. Format: number + unit (`y`=years, `m`=months, `d`=days). Default: `"2y"`
- **`critical`** (string) - Critical threshold. Same format as warn. Default: `"5y"`
- **`checkDeprecated`** (boolean) - Alert on deprecated packages. Default: `true`
- **`checkRepository`** (boolean) - Check repository activity and health. Default: `true`

**Examples:**
```json
"warn": "1y"      // 1 year
"warn": "18m"     // 18 months
"warn": "730d"    // 730 days (2 years)
```

---

### License Control

Define which licenses are allowed, denied, or require review.

```json
"license": {
  "allow": ["MIT", "ISC", "Apache-2.0"],
  "deny": ["GPL-*", "AGPL-*"],
  "warn": ["LGPL-*", "MPL-2.0"],
  "warnOnUnknown": true,
  "checkPatentClauses": true
}
```

**Fields:**
- **`allow`** (string[]) - Explicitly allowed licenses. Empty array allows all except denied. Default: `[]`
- **`deny`** (string[]) - Blocked licenses that fail the build. Supports wildcards (`*`). Default: `[]`
- **`warn`** (string[]) - Licenses that trigger warnings but don't fail. Default: `[]`
- **`warnOnUnknown`** (boolean) - Alert when license is unrecognized or missing. Default: `true`
- **`checkPatentClauses`** (boolean) - Verify explicit patent protection clauses. Default: `true`

**Common License Categories:**
- **Permissive:** MIT, ISC, BSD-2-Clause, BSD-3-Clause, Apache-2.0, Unlicense, CC0-1.0
- **Weak Copyleft:** LGPL-2.1, LGPL-3.0, MPL-2.0, EPL-1.0, EPL-2.0
- **Strong Copyleft:** GPL-2.0, GPL-3.0, AGPL-3.0, SSPL-1.0

**For a complete list of license identifiers with exact SPDX names to copy/paste, see [LICENSES-REFERENCE.md](LICENSES-REFERENCE.md)**

**For interactive license guide with detailed examples and project-specific recommendations, visit [package-health-analyzer.onrender.com](https://package-health-analyzer.onrender.com)**

---

### Health Scoring

Configure the 0-100 health score system for each dependency.

```json
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
}
```

**Fields:**
- **`enabled`** (boolean) - Enable/disable the scoring system. Default: `true`
- **`minimumScore`** (number) - Minimum acceptable score (0-100). Set to 0 for no minimum. Default: `0`
- **`boosters`** (object) - Weight multipliers for each metric. Higher values = more impact on final score.

**Score Ratings:**
- 90-100: Excellent
- 75-89: Good
- 60-74: Fair
- 0-59: Poor

**Recommended Settings:**
- Production apps: `minimumScore: 60-70`
- Open source: `minimumScore: 0` (informational only)
- Enterprise: `minimumScore: 70-80`

**For complete details on the scoring formula and how each dimension is calculated, see [SCORING-ALGORITHM.md](SCORING-ALGORITHM.md)**

**For interactive scoring calculator and customization examples, visit [package-health-analyzer.onrender.com](https://package-health-analyzer.onrender.com)**

---

### Ignore Patterns

Exclude specific packages from analysis.

```json
"ignore": {
  "scopes": ["@types/*", "@mycompany/*"],
  "prefixes": ["eslint-*", "webpack-*"],
  "authors": ["internal-team"],
  "packages": ["legacy-lib", "old-dependency"]
}
```

**Fields:**
- **`scopes`** (string[]) - Ignore by npm scope. Supports wildcards. Default: `[]`
- **`prefixes`** (string[]) - Ignore by package name prefix. Supports wildcards. Default: `[]`
- **`authors`** (string[]) - Ignore by package author/maintainer. Default: `[]`
- **`packages`** (string[]) - Ignore specific package names. Exact match. Default: `[]`

**Common Use Cases:**
```json
// Ignore TypeScript definitions
"scopes": ["@types/*"]

// Ignore development tools
"prefixes": ["eslint-*", "webpack-*", "@babel/*"]

// Ignore internal packages
"scopes": ["@mycompany/*"]
```

---

### Output Format

Choose how analysis results are displayed.

```json
"output": "cli" | "json" | "csv" | "txt" | "md"
```

- **`cli`** - Colorful table in terminal (default)
- **`json`** - Structured data for programmatic use
- **`csv`** - Spreadsheet-ready comma-separated values
- **`txt`** - Human-readable plain text format
- **`md`** - Markdown with tables and formatting

Can also be set via CLI flags: `--json`, `--csv`, or `--output=txt`

---

### Caching

Speed up repeated analysis with intelligent caching.

```json
"cache": {
  "enabled": true,
  "ttl": 3600
}
```

**Fields:**
- **`enabled`** (boolean) - Enable results caching. Default: `true`
- **`ttl`** (number) - Cache time-to-live in seconds. Default: `3600` (1 hour)

Cache is stored in `.cache/package-health-analyzer/` and is automatically invalidated when:
- TTL expires
- package.json changes
- Configuration changes

---

### GitHub Integration

Enhanced repository analysis with GitHub API.

```json
"github": {
  "enabled": false
}
```

**Fields:**
- **`enabled`** (boolean) - Enable GitHub API integration. Default: `false`

**Requirements:**
- Set `GITHUB_TOKEN` environment variable with a personal access token
- Token needs `public_repo` scope for public repositories
- Provides enhanced data: commit activity, issue metrics, contributor stats

**Example:**
```bash
export GITHUB_TOKEN=ghp_your_token_here
package-health-analyzer scan
```

---

### Upgrade Path Analysis

Intelligent upgrade recommendations and breaking change detection.

```json
"upgradePath": {
  "enabled": true,
  "analyzeBreakingChanges": true,
  "suggestAlternatives": true,
  "fetchChangelogs": false,
  "estimateEffort": true
}
```

**Fields:**
- **`enabled`** (boolean) - Enable upgrade path analysis. Default: `true`
- **`analyzeBreakingChanges`** (boolean) - Detect semver breaking changes in available updates. Default: `true`
- **`suggestAlternatives`** (boolean) - Recommend modern alternatives for outdated packages. Default: `true`
- **`fetchChangelogs`** (boolean) - Fetch and parse package changelogs (slower). Default: `false`
- **`estimateEffort`** (boolean) - Estimate migration effort (low/medium/high). Default: `true`

---

### Additional Options

**Include Development Dependencies:**
```json
"includeDevDependencies": true | false
```
- `true` - Analyze both dependencies and devDependencies
- `false` - Only analyze production dependencies (default)

**Fail On Severity:**
```json
"failOn": "none" | "info" | "warning" | "critical"
```
- `none` - Never exit with error code (informational only)
- `info` - Fail on info-level issues and above
- `warning` - Fail on warnings and critical issues
- `critical` - Only fail on critical issues (default)

Used for CI/CD integration to control build failures.

---

**For comprehensive configuration guide with interactive examples and project-type specific recommendations, visit [package-health-analyzer.onrender.com](https://package-health-analyzer.onrender.com)**

---

## Project types

### Commercial (default)

For proprietary commercial projects. Alerts on strong copyleft licenses (GPL, AGPL).

```bash
package-health-analyzer --project-type=commercial
```

### SaaS

For Software as a Service applications. Includes additional warnings about AGPL (network copyleft).

```bash
package-health-analyzer --project-type=saas
```

### Open source

For open source projects. More permissive with copyleft licenses.

```bash
package-health-analyzer --project-type=open-source
```

## License categories

### Commercial-friendly

- **MIT, ISC, BSD-2-Clause, BSD-3-Clause** - Simple and permissive
- **Apache-2.0** - Includes explicit patent grant
- **Unlicense, CC0-1.0** - Public domain

### Commercial-warning (require review)

- **LGPL-2.1, LGPL-3.0** - Weak copyleft, dynamic linking allowed
- **MPL-2.0** - File-level copyleft
- **EPL-1.0, EPL-2.0** - Eclipse Public License

### Commercial-incompatible

- **GPL-2.0, GPL-3.0** - Requires derivative works to use GPL
- **AGPL-3.0** - Network copyleft, applies to SaaS
- **SSPL-1.0** - Server Side Public License

## CI/CD integration

### GitHub Actions

```yaml
name: Dependency Health Check

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  dependency-health:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npx package-health-analyzer --fail-on=critical --json > dep-health-report.json
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: dependency-health-report
          path: dep-health-report.json
```

**For complete CI/CD integration guides including GitLab CI, CircleCI, and Jenkins, visit [package-health-analyzer.onrender.com](https://package-health-analyzer.onrender.com)**

### Exit codes

| Exit code | Meaning | When it occurs |
|-----------|---------|----------------|
| `0` | Success | No issues found |
| `1` | Warnings | Warnings found and `--fail-on=warning` |
| `2` | Critical | Critical issues found |
| `3` | Error | Execution error |

## Output Formats

The tool supports multiple output formats that can be configured via `--json`, `--csv` flags or in the configuration file (`output` field):

- **CLI** (default): Colorful table in terminal
- **JSON**: Structured data for programmatic use
- **CSV**: Comma-separated values for spreadsheet analysis
- **TXT**: Plain text readable format
- **MD**: Markdown with tables

**Example files:**
- [examples/sample-output.json](examples/sample-output.json) - Complete JSON output example
- [examples/sample-output.csv](examples/sample-output.csv) - CSV format with all package details
- [examples/sample-output.txt](examples/sample-output.txt) - Plain text readable report
- [examples/sample-report.md](examples/sample-report.md) - Comprehensive markdown report

**For live examples and downloadable sample outputs in all formats, visit [package-health-analyzer.onrender.com](https://package-health-analyzer.onrender.com)**

### JSON output

The `--json` flag outputs structured data. For a complete example, see [examples/sample-output.json](examples/sample-output.json).

**Basic structure:**

```json
{
  "meta": {
    "version": "1.0.0",
    "timestamp": "2025-12-08T10:00:00Z",
    "projectType": "commercial"
  },
  "project": {
    "name": "my-app",
    "version": "1.0.0"
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
        "deprecated": false,
        "severity": "warning"
      },
      "license": {
        "license": "MIT",
        "category": "commercial-friendly",
        "blueOakRating": "gold",
        "severity": "ok"
      },
      "score": {
        "overall": 62,
        "rating": "fair"
      },
      "overallSeverity": "warning"
    }
  ],
  "recommendations": [
    {
      "package": "request",
      "reason": "Package is deprecated",
      "priority": "high",
      "estimatedEffort": "2-4 hours"
    }
  ]
}
```

## Blue Oak Council ratings

Quality ratings for open source licenses:

- **Gold** - Perfectly drafted, no legal ambiguities
- **Silver** - Very good with minor issues
- **Bronze** - Acceptable but with drafting problems
- **Lead** - Problematic, poorly drafted or confusing terms

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `test:` Adding or updating tests

## License

MIT © [686f6c61](https://github.com/686f6c61)

## Links

- [npm Package](https://www.npmjs.com/package/package-health-analyzer)
- [GitHub Repository](https://github.com/686f6c61/package-health-analyzer)
- [Issue Tracker](https://github.com/686f6c61/package-health-analyzer/issues)
- [Changelog](https://github.com/686f6c61/package-health-analyzer/blob/main/CHANGELOG.md)

---

Made by developers, for developers.
