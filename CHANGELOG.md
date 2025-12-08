# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[unreleased]: https://github.com/686f6c61/package-health-analyzer/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/686f6c61/package-health-analyzer/releases/tag/v0.1.0
