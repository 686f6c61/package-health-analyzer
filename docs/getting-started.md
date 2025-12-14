# Getting Started with package-health-analyzer

This guide will walk you through installing, configuring, and using package-health-analyzer for the first time, from zero to scanning your dependencies in under 5 minutes.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Your First Scan](#your-first-scan)
4. [Understanding the Output](#understanding-the-output)
5. [Configuration Wizard](#configuration-wizard)
6. [Common Workflows](#common-workflows)
7. [Next Steps](#next-steps)

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18.0.0 or later** installed
- **npm** or **yarn** package manager
- A Node.js project with a `package.json` file
- (Optional) A GitHub Personal Access Token for vulnerability scanning

**Check your Node version:**

```bash
node --version
# Expected: v18.0.0 or higher
```

---

## Installation

You have three options for installation. Choose the one that fits your workflow:

### Option 1: Run without installation (Recommended for first-time users)

```bash
npx package-health-analyzer
```

This is the easiest way to try the tool without installing it globally. The `npx` command will download and run the latest version automatically.

**Pros:**
- [OK] No installation needed
- [OK] Always uses the latest version
- [OK] No global namespace pollution

**Cons:**
- [X] Slightly slower first run (downloads package)
- [X] Requires internet connection

### Option 2: Global installation

```bash
npm install -g package-health-analyzer
```

After installation, you can run the tool from anywhere:

```bash
package-health-analyzer
```

**Pros:**
- [OK] Fast execution (no download needed)
- [OK] Works offline after installation
- [OK] Can run from any directory

**Cons:**
- [X] Requires manual updates (`npm update -g package-health-analyzer`)
- [X] Pollutes global npm namespace

### Option 3: Local installation (Recommended for CI/CD)

```bash
npm install --save-dev package-health-analyzer
```

Add a script to your `package.json`:

```json
{
  "scripts": {
    "health-check": "package-health-analyzer"
  }
}
```

Run with:

```bash
npm run health-check
```

**Pros:**
- [OK] Version-locked to your project
- [OK] Works in CI/CD pipelines
- [OK] Team members use the same version

**Cons:**
- [X] Adds ~4MB to `node_modules`
- [X] Requires script definition

---

## Your First Scan

Let's run your first dependency health analysis!

### Step 1: Navigate to your project

```bash
cd /path/to/your/project
```

Make sure you have a `package.json` file:

```bash
ls package.json
# Expected: package.json
```

### Step 2: Run the scan

```bash
npx package-health-analyzer
```

You'll see output like this:

```
Scanning 87 dependencies...

┌──────────────────┬─────────┬──────┬────────┬──────────┬───────┬──────────┬──────────┐
│ Package          │ Version │ Age  │ Deprecated │ License │ Score │ Rating   │ Severity │
├──────────────────┼─────────┼──────┼────────┼──────────┼───────┼──────────┼──────────┤
│ express          │ 4.18.2  │ 1y   │ No     │ MIT      │ 95    │ excellent │ ok       │
│ moment           │ 2.29.4  │ 2y   │ Yes    │ MIT      │ 45    │ poor      │ warning  │
│ @types/node      │ 20.10.5 │ 2m   │ No     │ MIT      │ 98    │ excellent │ ok       │
└──────────────────┴─────────┴──────┴────────┴──────────┴───────┴──────────┴──────────┘

Summary:
[OK] 85 packages OK
⚠ 2 packages with warnings
```

**Congratulations!** You've just scanned your dependencies.

### Step 3: Interpret the results

The scan shows you:

- **Package**: Dependency name
- **Version**: Current version installed
- **Age**: How long since last update
- **Deprecated**: Whether the package is officially deprecated
- **License**: SPDX license identifier
- **Score**: Health score from 0-100
- **Rating**: excellent (90+), good (70-89), fair (50-69), poor (<50)
- **Severity**: ok, info, warning, critical

---

## Understanding the Output

### Health Score Breakdown

The overall health score (0-100) is calculated from **7 dimensions**:

| Dimension | Weight | What it measures |
|-----------|--------|------------------|
| **Age** | 15% | How recently the package was updated |
| **Deprecation** | 20% | Whether the package is officially deprecated |
| **License** | 15% | License compliance with your project type |
| **Vulnerability** | 25% | Known CVEs (requires GitHub token) |
| **Popularity** | 10% | npm download statistics |
| **Repository** | 10% | GitHub stars, issues, maintenance |
| **Update Frequency** | 5% | Release cadence over lifetime |

**Example:**

```
express 4.18.2
Score: 95/100 (excellent)

Breakdown:
  Age: 100/100         (last updated 1 year ago)
  Deprecation: 100/100 (not deprecated)
  License: 100/100     (MIT - commercial-friendly)
  Vulnerability: 100/100 (no known CVEs)
  Popularity: 70/100   (1M+ weekly downloads)
  Repository: 80/100   (58k stars, 300 open issues)
  Update Frequency: 100/100 (regular releases)
```

### Severity Levels

| Severity | Meaning | Action Required |
|----------|---------|-----------------|
| **ok** | No issues detected | None - you're good! |
| **info** | Minor concern | Review when convenient |
| **warning** | Should be addressed | Plan to fix soon |
| **critical** | Urgent issue | Fix immediately |

**Examples:**

- **ok**: Package is up-to-date, well-maintained, safe license
- **info**: Package is slightly old (1-2 years) but functional
- **warning**: Package is deprecated, or has LGPL license in commercial project
- **critical**: Package has known CVEs, or GPL license in commercial project

---

## Configuration Wizard

For most projects, you'll want to create a configuration file to customize the analysis.

### Running the Wizard

```bash
npx package-health-analyzer init
```

### Wizard Flow

**Question 1: Configuration Mode**

```
? How do you want to configure package-health-analyzer?
  > Default values (quick setup)
    Guided configuration (step-by-step)
```

- **Default values**: Creates config with recommended settings instantly
- **Guided configuration**: Walks you through all options (recommended for first time)

### Guided Configuration Walkthrough

If you choose "Guided configuration", you'll be asked:

#### 1. Project Type

```
? What type of project is this?
  > Commercial
    SaaS
    Open Source
    Library
    Government
    Internal
    Startup
```

**Why it matters:** Each project type has different license policies.

**Example:** Commercial projects typically deny GPL licenses, while Open Source projects are permissive.

#### 2. Include devDependencies

```
? Include devDependencies in analysis? (y/N)
```

**Recommendation:** No for production scans, Yes for complete audits.

**Why:** Dev dependencies (like testing frameworks) don't ship to production, so their licenses matter less.

#### 3. Age Thresholds

```
? Age warning threshold: (2y)
? Age critical threshold: (5y)
```

**Recommendations:**
- **Conservative**: 2y warn, 5y critical (default)
- **Aggressive**: 6m warn, 1y critical (for cutting-edge projects)
- **Relaxed**: 3y warn, 10y critical (for stable enterprise apps)

#### 4. License Policies

```
? Which licenses should be DENIED? (select with space)
  ◯ GPL-*
  ◯ AGPL-*
  ◯ SSPL-*
  ◯ Custom...
```

**For commercial projects**, typically deny:
- [OK] GPL-* (requires source disclosure)
- [OK] AGPL-* (network copyleft)
- [OK] SSPL-* (SaaS restrictions)

**For open source projects**, typically allow all.

#### 5. Scoring Boosters

```
? Boost score for repository health? (1.0 = neutral)
  > 1.0 (neutral)
    1.2 (20% boost)
    1.5 (50% boost)
```

**Use case:** If you value active GitHub communities, boost repository weight.

#### 6. GitHub Token (Optional)

```
? Enable vulnerability scanning? (Y/n)
? GitHub Personal Access Token: (hidden input)
```

**Security:** Token is encrypted with AES-256-GCM before saving. Never stored in plaintext.

**How to get a token:**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it `public_repo` scope
4. Copy your generated token (starts with `ghp_`)

### Generated Config File

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
    "deny": ["GPL-*", "AGPL-*", "SSPL-*"],
    "warn": ["LGPL-*"]
  },
  "github": {
    "token": "encrypted:AES256GCM:...",
    "security": {
      "enableVulnerabilityScanning": true
    }
  },
  "failOn": "critical"
}
```

**Next scan will use these settings automatically!**

---

## Common Workflows

### Workflow 1: Quick Health Check

**Use case:** You want a quick overview of your dependencies before a release.

```bash
npx package-health-analyzer
```

**Time:** 3-5 seconds

**Output:** CLI table with color-coded health scores

### Workflow 2: Full Security Audit

**Use case:** Comprehensive security scan including CVE detection.

```bash
GITHUB_TOKEN="ghp_***" npx package-health-analyzer
```

**Time:** 5-10 seconds (GitHub API calls)

**Output:** Includes vulnerability counts by severity (critical, high, moderate, low)

### Workflow 3: CI/CD Integration

**Use case:** Fail builds if critical issues are found.

Add to `.github/workflows/ci.yml`:

```yaml
- name: Health Check
  run: npx package-health-analyzer --fail-on=warning
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Exit codes:**
- `0` - No issues or only info-level
- `1` - Warnings found
- `2` - Critical issues found
- `3` - Error running scan

### Workflow 4: Generate Compliance Reports

**Use case:** Generate SBOM for supply chain compliance.

```bash
# SPDX 2.3 SBOM (CISA/NIST compliant)
npx package-health-analyzer --json-sbom > sbom.spdx.json

# Apache-style NOTICE.txt
npx package-health-analyzer generate-notice

# Markdown report for GitHub
npx package-health-analyzer --markdown > HEALTH_REPORT.md
```

### Workflow 5: Check Package Before Installing

**Use case:** Evaluate a package before adding it to your project.

```bash
npx package-health-analyzer check moment
```

**Output:**
```
Checking moment...

Package: moment
Version: 2.29.4

AGE:
  Last publish: 2022-07-06
  Age: 2 years 6 months
  Status: [!] OLD - Consider replacing

LICENSE:
  License: MIT
  Category: commercial-friendly
  Status: [OK] Safe for commercial use

HEALTH SCORE:
  Overall: 45/100 (poor)

RECOMMENDATION:
  [!] This package is deprecated.
  Consider alternatives:
    - dayjs (2KB, modern API)
    - date-fns (functional, tree-shakeable)
    - luxon (from Moment creator)
```

---

## Next Steps

Now that you're familiar with the basics, explore advanced features:

### 1. Review Your Configuration

```bash
cat .packagehealthanalyzerrc.json
```

Edit manually or re-run `init` to change settings.

### 2. Scan with Different Output Formats

```bash
# JSON for programmatic processing
npx package-health-analyzer --json > report.json

# CSV for Excel/Sheets
npx package-health-analyzer --csv > report.csv

# Markdown for documentation
npx package-health-analyzer --markdown > DEPENDENCIES.md
```

### 3. Enable Transitive Analysis

By default, the tool analyzes your entire dependency tree (up to 10 layers deep). To scan only direct dependencies:

```bash
npx package-health-analyzer --no-transitive
```

### 4. Set Up Automated Scans

Add to `package.json`:

```json
{
  "scripts": {
    "precommit": "package-health-analyzer --fail-on=critical",
    "weekly-audit": "package-health-analyzer --include-dev --json > audit.json"
  }
}
```

### 5. Read the Full Documentation

- **Compliance Guide**: `docs/compliance-guide.md` - SPDX, CISA, NIST implementation
- **License Reference**: `docs/license-reference.md` - Complete database of 214 licenses
- **Security Guide**: `docs/security.md` - Security features and threat model
- **Scoring Algorithm**: `docs/SCORING-ALGORITHM.md` - How scores are calculated

### 6. Explore v2.0 Features

- **Dependency Tree Analysis**: See circular dependencies, duplicates, depth
- **NOTICE.txt Generation**: Apache-style legal compliance
- **Vulnerability Scanning**: Real-time CVE detection
- **Token Security**: AES-256-GCM encryption

---

## Troubleshooting

### "Command not found: package-health-analyzer"

**Solution:** Install globally or use `npx`:

```bash
npm install -g package-health-analyzer
# or
npx package-health-analyzer
```

### "No package.json found"

**Solution:** Navigate to a directory with a `package.json` file, or initialize one:

```bash
npm init -y
npm install express
npx package-health-analyzer
```

### "GitHub API rate limit exceeded"

**Solution:** Provide a GitHub token to increase rate limits from 60/hour to 5000/hour:

```bash
GITHUB_TOKEN="ghp_***" npx package-health-analyzer
```

Or add it to your config with `init`.

### "Token decryption failed"

**Solution:** Re-run the wizard to re-encrypt your token:

```bash
npx package-health-analyzer init
```

### Scans are slow (>10 seconds)

**Possible causes:**
- Large dependency tree (200+ packages)
- Network latency to npm/GitHub
- No caching (first run)

**Solutions:**
- Use `--no-transitive` to skip deep analysis
- Subsequent scans will be faster (caching enabled)
- Check your internet connection

---

## Getting Help

- **Documentation**: https://package-health-analyzer.onrender.com
- **GitHub Issues**: https://github.com/686f6c61/package-health-analyzer/issues
- **NPM Package**: https://www.npmjs.com/package/package-health-analyzer

**Report bugs or request features** by opening a GitHub issue!

---

**You're now ready to analyze your dependencies like a pro!** 

Start scanning:

```bash
npx package-health-analyzer
```
