# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - 2025-12-14

### Added

#### Enterprise Security Features
- **GitHub Advisory Database Integration**: Real-time vulnerability scanning using GitHub's official security advisory database with CVE detection
- **Token Security System**: AES-256-GCM encryption for GitHub tokens with automatic masking in all output
- **Configuration File Permission Validation**: Automatic detection and warnings for insecure file permissions
- **Secure Memory Cleanup**: Automatic cleanup of sensitive data after use

#### Transitive Dependency Analysis
- **Complete Dependency Tree Analysis**: Full dependency tree traversal up to 10 layers deep
- **Circular Dependency Detection**: Automatic detection and tracking of circular dependencies
- **Duplicate Version Detection**: Identification of duplicate packages across the dependency tree
- **ASCII Tree Visualization**: Visual representation of dependency hierarchies with depth indicators
- **Enhanced CSV/JSON Output**: Tree metadata included in export formats (totalNodes, uniquePackages, maxDepth, circularDependencies, duplicatePackages)

#### NOTICE.txt Generation (Apache-Compliant)
- **Apache Software Foundation Compliant Format**: Generate legally-compliant NOTICE.txt files
- **Automatic License Text Fetching**: Real license texts from npm CDN and GitHub repositories
- **Copyright Extraction**: Automatic copyright notice extraction from package metadata
- **Transitive Dependency Support**: Include all transitive dependencies in NOTICE files
- **License Grouping**: Optional grouping by license type for better compliance review
- **Multiple Format Support**: Apache-style and simple formats

#### Compliance & Standards
- **SPDX 2.3 SBOM Export**: Software Bill of Materials in SPDX JSON format
- **CISA SBOM 2025 Compliant**: Meets U.S. CISA minimum requirements for SBOM
- **NIST 800-161 Compatible**: Aligns with NIST supply chain risk management guidelines
- **SARIF 2.1.0 Output**: Integration with GitHub Code Scanning and security platforms
- **Extended License Database**: Support for 221 licenses + 9 SPDX exceptions
- **Modern License Support**: Elastic-2.0, BUSL-1.1, PolyForm-* licenses
- **Patent Clause Detection**: Automatic detection for 30+ licenses

#### Enhanced Analysis Features
- **NPM Popularity Metrics**: Real download statistics with logarithmic scoring (1-100K, 100K-1M, 1M-10M, 10M+ tiers)
- **Repository Metrics**: Stars, forks, issues, archived status from GitHub API
- **Breaking Changes Analysis**: Automatic detection of major version changes with CHANGELOG parsing
- **Upgrade Path Guidance**: Step-by-step upgrade recommendations with effort estimates
- **Changelog Fetching**: Automatic retrieval of CHANGELOG files and GitHub releases
- **Vulnerability Severity Counts**: Breakdown by critical/high/moderate/low in all formats

#### Project-Type Specific Defaults
- **9 Project Type Profiles**: Commercial, SaaS, Open-Source, Personal, Internal, Library, Startup, Government, Educational
- **Customized Thresholds**: Age, license, and scoring defaults tailored per project type
- **Smart Booster Configuration**: Optimized scoring weights for different use cases
- **Automatic License Lists**: Pre-configured allow/deny/warn lists based on project type

#### CLI Enhancements
- **SARIF Output**: `--sarif` flag for GitHub Code Scanning integration
- **SPDX SBOM Output**: `--json-sbom` flag for SBOM generation
- **Markdown Output**: `--markdown` flag for GitHub-ready reports
- **Transitive Analysis Control**: `--no-transitive` flag to skip dependency tree analysis
- **Generate NOTICE Command**: `generate-notice` command with full configuration options

#### Enhanced Output Formats
- **Vulnerability Counts**: Detailed breakdown in all output formats
- **Dependency Tree Summary**: Statistics in scan results
- **Improved CLI Output**: Color-coded severity indicators with emoji support
- **Markdown Reporter**: GitHub-flavored markdown with tables and emoji indicators

### Changed

- **Version Number**: Updated to 2.0.0 across all modules (cli.ts, scan.ts, sarif.ts, spdx-formatter.ts)
- **Build Pipeline**: Added typecheck to prepublishOnly script (`typecheck && test && build`)
- **Configuration Loader**: Improved handling of optional config sections (notice, dependencyTree, github.security)
- **Type System**: Enhanced type definitions with proper optional fields and union types
- **License Category Mapping**: Renamed 'denied' to 'commercial-incompatible' for SARIF compliance
- **Package Metadata Types**: Support for repository as both string and object formats
- **NoticeConfig**: Added customHeader field for custom NOTICE.txt headers

### Fixed

- **TypeScript Compilation**: Resolved all 63 TypeScript errors for complete type safety
- **Configuration Type Errors**: Fixed undefined handling for `config.notice`, `GitHubSecurityConfig`, and `DependencyTreeConfig` with proper fallback defaults
- **License Extraction**: Corrected SPDX license field extraction (`pkg.license.license` instead of `pkg.license`)
- **SARIF License Categories**: Fixed mapping to use correct category names ('commercial-incompatible' instead of 'denied')
- **Init Command Output Format**: Added proper mapping from 'md' to 'markdown' format
- **Unused Variables**: Removed 15+ unused variables and imports across codebase
- **Regex Escape Characters**: Fixed unnecessary escape characters in regular expressions (notice-generator.ts:76)
- **Empty Catch Blocks**: Added proper error handling comments for all catch blocks
- **Unreachable Code**: Removed unreachable code paths in github-advisories.ts
- **Linter Errors**: Reduced from 29 problems (15 errors, 14 warnings) to 14 warnings (0 errors)
- **Dependency Tree Filtering**: Fixed type guard for filtering null nodes
- **Token Security**: Fixed unused salt variable in decryption
- **Time Utils**: Added proper null checks for regex match groups
- **Ignore Matcher**: Fixed maintainer type handling (string | object)
- **Upgrade Path**: Fixed repository URL extraction for string union type

### Performance

- **Concurrent Package Fetching**: Configurable concurrency limits (default: 10 parallel requests)
- **In-Memory Package Cache**: TTL-based caching for npm registry data
- **Vulnerability Cache**: 24-hour default cache for GitHub Advisory queries
- **Intelligent Rate Limiting**: GitHub API rate limit detection and handling
- **Optimized Tree Building**: Promise.allSettled for handling individual timeouts

### Documentation

- **Comprehensive Module Documentation**: Detailed JSDoc comments for all major modules
- **License Reference Guide**: Complete documentation for 221 supported licenses
- **Compliance Guide**: Best practices for regulatory compliance (CISA, NIST, EU Cyber Resilience Act)
- **Security Features Documentation**: Guide for token security and encryption
- **Scoring Algorithm Breakdown**: Transparent explanation of health score calculation
- **CHANGELOG.md**: Comprehensive changelog following Keep a Changelog format
- **Enhanced Keywords**: Added sbom, spdx, sarif, cve, advisory, transitive, dependency-tree, notice, patent-clause, cisa, supply-chain

### Migration Guide

#### Breaking Changes from 1.x
- Configuration schema has been extended with new optional fields (`dependencyTree`, `notice`, `github.security`)
- Output formats now include additional metadata (`severityCounts`, `treeSummary`)
- SARIF output uses updated license category names

#### Upgrading from 1.x
1. Update your configuration file to include new optional sections (if desired):
   ```json
   {
     "dependencyTree": {
       "enabled": true,
       "maxDepth": 10,
       "detectCircular": true
     },
     "notice": {
       "format": "apache",
       "includeTransitive": true
     },
     "github": {
       "security": {
         "enabled": true,
         "cacheTtl": 86400000
       }
     }
   }
   ```

2. Review your license deny/warn lists for new license identifiers

3. Update any scripts that parse JSON output to handle new fields:
   - `summary.severityCounts` (optional)
   - `treeSummary` (optional)
   - `meta.version` (now "2.0.0")

#### New Environment Variables
- `GITHUB_TOKEN`: GitHub personal access token for API access and vulnerability scanning (optional but recommended for full features)

---

## [1.0.0] - 2025-12-08

### Added

#### Core Features
- Comprehensive dependency health analyzer for npm packages
- Multi-dimensional health scoring system (age, deprecation, license, vulnerabilities, popularity, repository, update frequency)
- Blue Oak Council license quality ratings (Gold, Silver, Bronze, Lead)
- Smart upgrade path analysis with breaking change estimation
- License compliance analysis for commercial, SaaS, and open-source projects

#### CLI Commands
- `scan` - Scan all dependencies in a project
- `check <package>` - Analyze a single package
- `init` - Generate configuration file

#### Output Formats
- CLI table output with colors and ratings
- JSON output for programmatic use
- CSV output for spreadsheet analysis

#### Configuration System
- Cosmiconfig integration supporting multiple config formats
- `.packagehealthanalyzerrc.json`
- `.packagehealthanalyzerrc.yaml`
- `package.json` field
- JavaScript config files
- CLI argument overrides

#### Analysis Features
- Age detection and human-readable formatting
- Deprecation detection with warning messages
- GitHub repository analysis (stars, issues, commits, archived status)
- Download statistics from npm
- SPDX license parsing with dual-license support
- Package alternatives database (moment, request, etc.)

#### Ignore Rules
- Scope-based filtering (`@types/*`, `@company/*`)
- Prefix-based filtering (`eslint-*`, `webpack-*`)
- Author-based filtering by email or name
- Exact package name filtering
- Wildcard pattern matching support

#### Developer Experience
- TypeScript support with strict mode
- ESM and CommonJS dual exports
- Zero configuration required
- Concurrent dependency analysis (10 parallel requests)
- Comprehensive test coverage (69 tests across unit, integration, and E2E)

#### CI/CD
- GitHub Actions workflows for CI, releases, and publishing
- Automated npm and GitHub Packages publishing
- Multi-version Node.js testing (18.x, 20.x, 22.x)
- Code coverage reporting

### Technical Details
- Node.js >= 18.0.0 required
- TypeScript 5.x
- Commander.js for CLI
- Vitest for testing
- tsup for building
- p-limit for concurrency control

[unreleased]: https://github.com/686f6c61/package-health-analyzer/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/686f6c61/package-health-analyzer/releases/tag/v2.0.0
[1.0.0]: https://github.com/686f6c61/package-health-analyzer/releases/tag/v1.0.0
