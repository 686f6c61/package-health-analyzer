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

### Core Analysis (v1.0)
- **Age analysis** - Detects outdated and deprecated packages
- **License compliance** - Identifies commercial incompatibilities (GPL, AGPL, etc.)
- **Legal quality ratings** - Blue Oak Council ratings for license clarity
- **Multi-dimensional scoring** - Overall health score from 0-100
- **Smart upgrade paths** - Breaking change analysis and migration guidance
- **Actionable recommendations** - Prioritized list of what to fix first
- **Zero configuration** - Works out of the box with sensible defaults
- **CI/CD ready** - Built for automation with configurable exit codes

### Enterprise Features (v2.0) ⭐ NEW
- **Security vulnerability scanning** - Real-time CVE detection via GitHub Advisory Database
- **Transitive dependency analysis** - Complete dependency tree with circular/duplicate detection
- **NOTICE.txt generation** - Apache-style legal compliance files with real license texts
- **SPDX SBOM export** - CISA SBOM 2025 and NIST 800-161 compliant software bill of materials
- **Token security** - AES-256-GCM encryption for GitHub tokens with secure memory cleanup
- **Extended license database** - 214 SPDX licenses with patent clause detection (30 with patent grants)
- **Performance caching** - In-memory caching with TTL for metadata and vulnerability data
- **Enhanced reporting** - Markdown output with vulnerability counts and tree visualizations

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

## How it works

package-health-analyzer performs a **comprehensive multi-stage analysis** of your dependencies in under 5 seconds:

### Stage 1: Discovery & Fetching (1-2 seconds)

The tool reads your `package.json` and `package-lock.json` files to identify all dependencies. It then fetches metadata from the npm registry in parallel (10 concurrent requests by default) to minimize latency. If you have a GitHub token configured, it also queries the GitHub Advisory Database for real-time vulnerability data.

### Stage 2: Multi-Dimensional Analysis (1-2 seconds)

Each package is analyzed across **7 critical dimensions**:

1. **Age Analysis**: Checks the last publish date and flags packages that haven't been updated in years. This helps identify abandoned or unmaintained dependencies that may contain unpatched security vulnerabilities.

2. **Deprecation Detection**: Queries npm to check if a package has been officially deprecated by its maintainers, indicating it's no longer supported and won't receive security updates.

3. **License Compliance**: Parses SPDX license identifiers and checks them against your project type's policy (e.g., commercial projects may deny GPL licenses). Includes Blue Oak Council quality ratings for license clarity.

4. **Vulnerability Scanning** (v2.0): Queries GitHub's Advisory Database for known CVEs affecting the specific version you're using. Returns severity classifications (critical, high, moderate, low) with links to advisories.

5. **Popularity Metrics**: Analyzes npm download statistics to identify widely-adopted vs niche packages. Popular packages typically have larger communities finding and fixing bugs.

6. **Repository Health**: Fetches GitHub repository data (stars, forks, open issues, last commit) to assess community activity and maintenance status. Archived repositories are flagged as critical issues.

7. **Update Frequency**: Calculates release cadence to determine if a package is actively maintained. Packages with regular releases typically respond faster to security issues.

### Stage 3: Dependency Tree Analysis (1 second)

For v2.0, the tool builds a **complete dependency tree** including transitive dependencies (up to 3 layers deep by default). It detects:

- **Circular dependencies**: Packages that depend on each other in a cycle (can cause installation issues)
- **Duplicate versions**: The same package installed at multiple versions (increases bundle size)
- **Depth indicators**: How many layers deep each dependency is nested (deep nesting = harder to audit)

#### ⚠️ Dependency Tree Depth Limits

The default `maxDepth` is set to **3 layers** (root + direct dependencies + level 2 transitive):

- **Layer 0**: Your project
- **Layer 1**: Direct dependencies (packages in your package.json)
- **Layer 2**: Transitive dependencies (dependencies of your dependencies)

**Why this limit?**

Very large projects with hundreds of nested dependencies can create exponentially large dependency trees. For example:
- A project with 10 direct deps, each with 10 deps, each with 10 deps = 1,000 packages at depth 3
- The same at depth 5 = 10,000+ packages

**For extremely large projects (50+ direct dependencies):**

The tool uses intelligent concurrency limiting and timeout handling to prevent hangs. Most projects complete in under 5 seconds. If you encounter issues with very large dependency trees:

1. **Reduce maxDepth** in your config (recommended for NOTICE.txt generation):
   ```json
   {
     "dependencyTree": {
       "maxDepth": 2
     }
   }
   ```

2. **Skip transitive analysis** for specific commands:
   ```bash
   package-health-analyzer generate-notice --no-transitive
   ```

3. **Use circular dependency detection** to stop early:
   ```json
   {
     "dependencyTree": {
       "detectCircular": true,
       "stopOnCircular": true
     }
   }
   ```

The default settings work well for 95% of projects. Only projects with unusually large or complex dependency graphs (like webpack plugins, testing frameworks with many peers) may need adjustment.

### Stage 4: Scoring & Recommendations (<1 second)

Each package receives a **health score from 0-100** based on the 7 dimensions above, with configurable weights. The tool then generates prioritized recommendations, sorting issues by severity (critical → warning → info) and suggesting specific actions:

- **Upgrade**: New version available with security fixes or bug fixes
- **Replace**: Package is deprecated, suggests modern alternatives (e.g., moment → dayjs)
- **Audit**: Vulnerabilities found, shows CVE IDs and patched versions
- **OK**: No issues detected

### Stage 5: Output Generation (<1 second)

Finally, the tool formats the results in your chosen output format:

- **CLI Table**: Colored, human-readable table for terminal viewing with color-coded severity indicators
- **JSON**: Complete data for programmatic consumption or CI/CD pipelines
- **CSV**: For importing into Excel or Google Sheets for team review
- **TXT**: Plain text format without colors, suitable for logging or CI/CD output
- **Markdown**: For GitHub README files or pull request comments with formatted tables
- **SPDX SBOM**: Standards-compliant Software Bill of Materials for compliance requirements (use `--json-sbom`)

**Total time: 3-5 seconds** for a typical project with 200+ dependencies.

**Caching:** v2.0 includes in-memory caching with configurable TTL (default 1 hour for package metadata, 24 hours for vulnerabilities). This means subsequent scans complete in <1 second if data is still fresh.

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
| `--markdown` | Output results as Markdown with emojis and tables | `false` |
| `--json-sbom` | Export SPDX 2.3 SBOM (CISA/NIST compliant) | `false` |
| `--no-transitive` | Skip transitive dependency tree analysis | `false` |
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

# Markdown report with emojis and formatted tables
package-health-analyzer --markdown > report.md

# Generate SPDX 2.3 SBOM for compliance (CISA, NIST)
package-health-analyzer --json-sbom > sbom.spdx.json

# Scan only direct dependencies (skip transitive analysis)
package-health-analyzer --no-transitive

# Full security scan with vulnerability detection
GITHUB_TOKEN="ghp_***" package-health-analyzer --json

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

[OK] Configuración creada exitosamente!
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

[OK] Configuración creada exitosamente!
```

**Cancellation:**

Press `Ctrl+C` at any time to cancel without creating a file.

---

## Configuration Wizard Deep Dive

The `init` command launches an **interactive wizard** that guides you through creating a tailored configuration file optimized for your project type.

### What the Wizard Asks

**1. Project Type**

Choose from: Commercial, SaaS, Open Source, Library, Government, Internal, Startup

Each type comes with **preset license policies** optimized for that use case:

- **Commercial**: Denies GPL/AGPL licenses (copyleft incompatible with proprietary code)
- **SaaS**: Extra warnings for AGPL (network copyleft triggers on SaaS deployments)
- **Government**: Strict compliance, denies all copyleft licenses
- **Open Source**: Permissive with all license types
- **Library**: Focuses on avoiding license compatibility issues for library consumers

**2. Age Thresholds**

When should packages be flagged as outdated?

- **Recommended**: Warn after 2 years, Critical after 5 years
- **Aggressive**: Warn after 6 months, Critical after 1 year
- **Relaxed**: Warn after 3 years, Critical after 10 years

Packages older than the critical threshold are often abandoned and contain unpatched vulnerabilities.

**3. License Policies**

Configure which licenses are acceptable for your project:

- **Allow list**: These licenses are always acceptable (e.g., MIT, Apache-2.0, BSD)
- **Deny list**: These licenses will fail the scan (e.g., GPL-*, AGPL-* for commercial projects)
- **Warn list**: These licenses will show warnings but won't fail (e.g., LGPL-*)

Supports **wildcards**: `GPL-*` matches GPL-2.0, GPL-3.0, GPL-2.0-only, GPL-3.0-or-later, etc.

**4. Scoring Boosters**

Adjust importance of different health dimensions:

- Increase weight of **repository** if you value active GitHub communities
- Increase weight of **downloads** if you prefer battle-tested popular packages
- Increase weight of **age** if you want bleeding-edge packages

**5. GitHub Token (Optional)**

For vulnerability scanning via GitHub Advisory Database:

- If provided, the token is **encrypted with AES-256-GCM** before saving to config file
- File permissions are validated (warns if not 600 on Unix systems)
- Token is **never logged or displayed in plain text**
- Automatic token masking in all output: `ghp_****Nt131ylM`

### Generated Configuration File

The wizard creates `.packagehealthanalyzerrc.json`:

```json
{
  "projectType": "commercial",
  "includeDevDependencies": false,
  "age": {
    "warn": "2y",
    "critical": "5y"
  },
  "license": {
    "allow": ["MIT", "Apache-2.0", "BSD-3-Clause", "ISC"],
    "deny": ["GPL-*", "AGPL-*", "SSPL-*"],
    "warn": ["LGPL-*"],
    "checkPatentClauses": true
  },
  "github": {
    "token": "encrypted:AES256GCM:a3f8b2c1...:9d7e4f1a...:5c2b8a9e...",
    "security": {
      "enableVulnerabilityScanning": true
    }
  },
  "scoring": {
    "minScore": 0,
    "boosters": {
      "repository": 1.2,
      "downloads": 1.1
    }
  },
  "output": "cli",
  "failOn": "critical"
}
```

### Security Features

- **Token Encryption**: GitHub tokens are encrypted at rest using AES-256-GCM encryption
- **Permission Validation**: Configuration file permissions are validated (warns if not 600)
- **Plaintext Detection**: If a plaintext token is detected, the tool refuses to use it
- **Memory Cleanup**: Best-effort clearing of sensitive data from memory (JavaScript strings are immutable)

See `docs/security.md` for detailed security documentation.

### Skip the Wizard

If you prefer manual configuration:

```bash
# Use defaults (no config file needed)
package-health-analyzer

# Copy example config
cp .packagehealthanalyzerrc.example.json .packagehealthanalyzerrc.json

# Edit manually
vim .packagehealthanalyzerrc.json
```

### `generate-notice` ⭐ NEW in v2.0

Generate NOTICE.txt files for legal compliance (Apache-style or simple format).

```bash
package-health-analyzer generate-notice [options]
```

**Options:**

| Option | Description | Default |
|--------|-------------|---------|
| `--format <format>` | Output format: apache, simple | `apache` |
| `--output <path>` | Output file path | `NOTICE.txt` |
| `--group-by-license` | Group packages by license | `false` |
| `--include-dev` | Include devDependencies | `false` |
| `--include-transitive` | Include transitive dependencies | `true` |

**Examples:**

```bash
# Generate Apache-style NOTICE.txt
package-health-analyzer generate-notice

# Simple format with grouped licenses
package-health-analyzer generate-notice --format=simple --group-by-license

# Include dev dependencies, custom output path
package-health-analyzer generate-notice --include-dev --output=THIRD_PARTY_NOTICES.txt

# Only direct dependencies
package-health-analyzer generate-notice --no-transitive
```

**What it includes:**
- Real license texts fetched from npm CDN and GitHub
- Copyright information from package.json
- Package names, versions, authors
- Repository URLs
- SPDX license identifiers

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
"output": "cli" | "json" | "csv" | "txt" | "markdown" | "json-sbom"
```

- **`cli`** - Colorful table in terminal (default)
- **`json`** - Structured data for programmatic use
- **`csv`** - Spreadsheet-ready comma-separated values
- **`txt`** - Plain text format without colors (use `--txt` flag)
- **`markdown`** - Markdown with tables and formatting (use `--markdown` flag)
- **`json-sbom`** - SPDX 2.3 SBOM format (use `--json-sbom` flag)

Can also be set via CLI flags: `--json`, `--csv`, `--txt`, `--markdown`, or `--json-sbom`

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

The tool supports multiple output formats that can be configured via `--json`, `--csv`, `--txt`, `--markdown`, `--json-sbom` flags or in the configuration file (`output` field):

- **CLI** (default): Colorful table in terminal
- **JSON**: Structured data for programmatic use
- **CSV**: Comma-separated values for spreadsheet analysis
- **TXT**: Plain text format without colors
- **Markdown**: Markdown with tables and formatting
- **SPDX SBOM**: JSON-formatted Software Bill of Materials

**Example files:**
- [examples/express-project-outputs/scan-output.json](examples/express-project-outputs/scan-output.json) - Complete JSON output
- [examples/express-project-outputs/scan-output.csv](examples/express-project-outputs/scan-output.csv) - CSV format with all details
- [examples/express-project-outputs/scan-output-cli.txt](examples/express-project-outputs/scan-output-cli.txt) - Plain text output
- [examples/express-project-outputs/scan-output.md](examples/express-project-outputs/scan-output.md) - Markdown report
- [examples/express-project-outputs/scan-output-sbom.json](examples/express-project-outputs/scan-output-sbom.json) - SPDX SBOM format

**For live examples and downloadable sample outputs in all formats, visit [package-health-analyzer.onrender.com](https://package-health-analyzer.onrender.com)**

### Important Distinction: Output Formats vs NOTICE.txt

**Output Formats** (`--json`, `--csv`, `--txt`, `--markdown`, `--json-sbom`):
- Control how the **analysis report** is formatted
- Shows health scores, vulnerabilities, license compliance
- Output to stdout or file redirection

**NOTICE.txt** (generated with `generate-notice` command):
- Separate legal compliance file for attribution
- Contains license texts and copyright information
- Apache Software Foundation format
- **NOT an output format** for the scan command

Example:
```bash
# Generate analysis report in TXT format
package-health-analyzer --txt > report.txt

# Generate legal NOTICE.txt file (separate command)
package-health-analyzer generate-notice
```

---

### JSON output

The `--json` flag outputs structured data. For complete examples, see [examples/express-project-outputs/](examples/express-project-outputs/).

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

---

## Security

package-health-analyzer v2.0 implements **enterprise-grade security** for handling sensitive tokens and preventing common vulnerabilities.

### Token Encryption (AES-256-GCM)

GitHub personal access tokens are **never stored in plaintext**. When you provide a token via the configuration wizard:

1. The token is encrypted using **AES-256-GCM** (Galois/Counter Mode) encryption
2. A unique initialization vector (IV) is generated for each encryption
3. The encrypted token, IV, and authentication tag are stored in the config file
4. The plaintext token is cleared from memory (best-effort, JavaScript strings are immutable)

**Example encrypted token in config:**

```json
{
  "github": {
    "token": "encrypted:AES256GCM:a3f8b2c1...:9d7e4f1a...:5c2b8a9e..."
  }
}
```

The decryption key is derived from your system's environment, ensuring tokens remain secure even if the config file is accidentally committed to version control.

### Automatic Token Masking

All tokens are automatically masked in output to prevent accidental exposure:

- **CLI output**: `ghp_****Nt131ylM` (shows first 4 chars + last 8 chars)
- **JSON output**: `ghp_****Nt131ylM`
- **Error messages**: Tokens are redacted before logging
- **Debug logs**: Tokens never appear in any log output

### Plaintext Token Detection

If the tool detects a plaintext token in your configuration file, it will:

1. **Warn you immediately** with a security message
2. **Refuse to use the token** until it's encrypted
3. **Suggest running `init` again** to properly encrypt it
4. **Check file permissions** and warn if config file is world-readable

### Configuration File Permissions

The tool validates that your `.packagehealthanalyzerrc.json` file has secure permissions:

- **Recommended**: `600` (read/write for owner only on Unix systems)
- **Warns** if permissions are too open (e.g., `644` or `777`)
- **On Windows**: Checks ACLs instead of Unix permissions
- **Auto-fix option**: Offers to fix permissions automatically

### SSRF Prevention

When fetching package data from npm and GitHub:

- [OK] URL parameters are validated and URL-encoded
- [OK] Repository names are validated against strict regex patterns (no `..`, `/`, or `\`)
- [OK] Path traversal attempts are blocked in package identifiers
- [OK] Requests have 10-second timeouts with AbortController for automatic cancellation
- [OK] Only fetches from known, trusted domains (`registry.npmjs.org`, `api.github.com`)
- [OK] Validates HTTP response status codes before processing

### Path Traversal Prevention

When generating NOTICE.txt or SBOM files with custom output paths:

- [OK] Output paths are validated against the current working directory
- [OK] Symbolic links are resolved and checked to prevent escape
- [OK] Attempts to write outside the project directory are blocked
- [OK] Normalizes paths to prevent `../` escape sequences

### Input Validation

All user inputs are validated before processing:

- [OK] **Package names**: Alphanumeric + hyphens/underscores/dots only
- [OK] **GitHub owner/repo**: RFC-compliant identifiers (1-39 chars for owners, 1-100 for repos)
- [OK] **Config file paths**: No path traversal sequences allowed
- [OK] **License identifiers**: Validated against SPDX license list (214 licenses)
- [OK] **Version strings**: Validated with semver library

### Dependency Security

We practice what we preach:

- [OK] All dependencies are scanned for vulnerabilities using this tool itself
- [OK] Minimal dependency tree (only essential packages)
- [OK] No dependencies with known critical CVEs
- [OK] Regular automated security audits via GitHub Dependabot

**For full security documentation and threat model, see [`docs/security.md`](docs/security.md)**

---

## Compliance & Standards

package-health-analyzer v2.0 is designed to meet **enterprise compliance requirements** out of the box.

### SPDX 2.3 Software Bill of Materials (SBOM)

Generate standards-compliant SBOMs for supply chain transparency:

```bash
package-health-analyzer --json-sbom > sbom.spdx.json
```

**What's included:**

- [OK] SPDX version 2.3 specification compliance
- [OK] CC0-1.0 data license (SPDX requirement)
- [OK] Unique document namespace with ISO 8601 timestamp
- [OK] Package URLs (purl) for all dependencies (`pkg:npm/express@4.18.2`)
- [OK] SPDX license identifiers (all 214 supported licenses)
- [OK] External references (homepage, repository, npm registry)
- [OK] Relationship mappings (DEPENDS_ON, CONTAINS, DESCRIBES)
- [OK] Creation info with tool name and version

**Compliance:** [OK] CISA SBOM 2025, [OK] NIST 800-161, [OK] NTIA Minimum Elements

### CISA SBOM 2025 Requirements

All **baseline elements** are included:

| CISA Requirement | Implemented | Location |
|------------------|-------------|----------|
| Supplier name | [OK] | `packages[].supplier` (package author) |
| Component name | [OK] | `packages[].name` |
| Version of component | [OK] | `packages[].versionInfo` |
| Other unique identifiers | [OK] | Package URL (purl), SPDX ID |
| Dependency relationships | [OK] | `relationships[]` array with tree data |
| Author of SBOM data | [OK] | `creationInfo.creators` (tool name) |
| Timestamp | [OK] | `creationInfo.created` (ISO 8601) |

**Additional elements** included:

- [OK] License information (SPDX identifiers)
- [OK] External references (repository, homepage)
- [OK] Nested dependencies (transitive analysis with depth tracking)
- [OK] Component hashes (npm registry download URLs)

### NIST 800-161 Supply Chain Security

Implements controls for **Cybersecurity Supply Chain Risk Management (C-SCRM)**:

| Control | Description | Implementation |
|---------|-------------|----------------|
| **SA-5** | Component Inventory | Complete dependency listing with transitive analysis |
| **RA-5** | Vulnerability Management | CVE scanning via GitHub Advisory Database |
| **SA-15** | License Compliance | Automated policy enforcement with deny/warn lists |
| **CM-8** | Dependency Tracking | Tree analysis with circular/duplicate detection |
| **CM-6** | Secure Configuration | Token encryption, file permission validation |

### Apache Software Foundation NOTICE.txt

Generate Apache-style NOTICE files for legal attribution:

```bash
package-health-analyzer generate-notice
```

**Features:**

- [OK] Full license texts fetched from npm CDN (`unpkg.com`)
- [OK] Copyright information extracted from package metadata
- [OK] Repository URLs for proper attribution
- [OK] Supports transitive dependencies (include all layers)
- [OK] Grouping by license type for easier review
- [OK] Both Apache format (with full texts) and Simple format (list only)

**Output formats:**

- **Apache format**: Full license texts + detailed attributions (recommended for ASF projects)
- **Simple format**: Package names + licenses only (minimal footprint)

### SPDX License Database

Supports **214 SPDX licenses** including:

- [OK] All OSI-approved licenses (MIT, Apache-2.0, GPL, BSD, etc.)
- [OK] FSF Free/Libre licenses
- [OK] Modern licenses (Elastic-2.0, BUSL-1.1, PolyForm-* family)
- [OK] 30 licenses with explicit patent grants
- [OK] 9 SPDX license exceptions (Classpath-exception-2.0, LLVM-exception, etc.)
- [OK] Deprecated license detection (GPL-2.0, LGPL-2.1, etc. → use -only/-or-later)

**Patent clause detection** for licenses including:

Apache-2.0, MPL-2.0, EPL-2.0, GPL-3.0+, AFL-*, OSL-*, MS-PL, and 23 others.

### Compliance Documentation

For detailed compliance guides and examples:

- **Compliance Guide**: [`docs/compliance-guide.md`](docs/compliance-guide.md) - Full SPDX, CISA, NIST implementation guide
- **License Reference**: [`docs/license-reference.md`](docs/license-reference.md) - Complete database of 214 licenses
- **Security Guide**: [`docs/security.md`](docs/security.md) - Security features and threat model

---

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


