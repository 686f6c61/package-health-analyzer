# Security Features

## Overview

package-health-analyzer v2.0.0 includes enterprise-grade security features for vulnerability scanning, token encryption, and secure configuration management.

## GitHub Advisory Database Integration

### Real-time CVE Scanning

The tool integrates with GitHub's Advisory Database to detect known vulnerabilities in your dependencies.

**Features:**
- Real-time CVE detection for all dependencies
- Severity classification (critical, high, moderate, low)
- Vulnerability caching (24-hour default TTL)
- Detailed advisory information including GHSA IDs and CVE numbers
- Affected version range tracking

**Configuration:**

```json
{
  "github": {
    "enabled": true,
    "token": "",
    "security": {
      "enabled": true,
      "cacheTtl": 86400
    }
  }
}
```

**Usage:**

```bash
# Enable vulnerability scanning with GitHub token
GITHUB_TOKEN="YOUR_GITHUB_TOKEN_HERE" package-health-analyzer scan

# Or configure in .packagehealthanalyzerrc.json (not recommended for tokens)
```

**Output includes:**
- Total vulnerability count by severity
- Affected packages with version ranges
- GHSA and CVE identifiers
- Severity levels for each vulnerability
- Summary in all output formats (CLI, JSON, CSV, Markdown)

---

## Token Security System

### AES-256-GCM Encryption

GitHub tokens and other sensitive credentials are protected using military-grade encryption.

**Features:**
- AES-256-GCM authenticated encryption
- Random IV (initialization vector) generation
- Salt-based key derivation
- Authentication tag validation
- Secure memory cleanup after use

**Implementation:**

```typescript
import { encryptToken, decryptToken, clearTokenFromMemory } from './utils/token-security';

// Encrypt
const key = Buffer.alloc(32); // 256-bit key
const encrypted = encryptToken('YOUR_TOKEN_HERE', key);

// Decrypt
const decrypted = decryptToken(encrypted, key);

// Cleanup
clearTokenFromMemory(decrypted);
```

### Token Masking

All tokens are automatically masked in output to prevent accidental exposure.

**Examples:**
```
ghp_YourActualGitHubTokenHere123456789012
↓
ghp_****...***012
```

**Patterns detected:**
- GitHub personal access tokens: `ghp_*`
- GitHub OAuth tokens: `gho_*`
- GitHub fine-grained tokens: `github_pat_*`
- npm tokens: `npm_*`

---

## Configuration File Security

### Permission Validation

The tool automatically checks configuration file permissions and warns about insecure settings.

**Recommended permissions:**
```bash
chmod 600 .packagehealthanalyzerrc.json
```

**Warnings triggered when:**
- File is world-readable (mode 004)
- File is group-readable (mode 040)
- File contains plaintext tokens

**Example warning:**
```
[!]  WARNING: Configuration file has insecure permissions!
/path/to/.packagehealthanalyzerrc.json is readable by others
   Recommended: chmod 600 .packagehealthanalyzerrc.json
```

### Plaintext Token Detection

The tool scans configuration files for plaintext tokens and warns users.

**Detected patterns:**
- `ghp_[a-zA-Z0-9]{36}`
- `gho_[a-zA-Z0-9]{36}`
- `github_pat_[a-zA-Z0-9_]{82}`
- `npm_[a-zA-Z0-9]{36}`

**Warning message:**
```
[!]  WARNING: Plaintext token detected in configuration file!
   For better security, use environment variables instead:

      export GITHUB_TOKEN="your_token"
   Or via command line:
   GITHUB_TOKEN="your_token" package-health-analyzer scan
```

---

## Best Practices

### 1. Use Environment Variables

**Recommended:**
```bash
export GITHUB_TOKEN="YOUR_GITHUB_TOKEN_HERE"
package-health-analyzer scan
```

**Not recommended:**
```json
{
  "github": {
    "token": "YOUR_GITHUB_TOKEN_HERE"
  }
}
```

### 2. Secure Configuration Files

```bash
# Set restrictive permissions
chmod 600 .packagehealthanalyzerrc.json

# Add to .gitignore
echo ".packagehealthanalyzerrc.json" >> .gitignore
```

### 3. Use GitHub Secrets in CI/CD

**GitHub Actions example:**
```yaml
- name: Analyze dependencies
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  run: npx package-health-analyzer scan
```

### 4. Rotate Tokens Regularly

- Rotate GitHub tokens every 90 days
- Use fine-grained tokens with minimal permissions
- Revoke tokens immediately if compromised

### 5. Enable Vulnerability Caching

Reduce API calls and improve performance:

```json
{
  "github": {
    "security": {
      "cacheTtl": 86400
    }
  }
}
```

---

## Vulnerability Cache

### How It Works

- First scan fetches fresh vulnerability data from GitHub
- Results cached in-memory with TTL (default: 24 hours)
- Subsequent scans use cached data if not expired
- Cache invalidated automatically after TTL expires

### Configuration

```json
{
  "github": {
    "security": {
      "enabled": true,
      "cacheTtl": 86400
    }
  }
}
```

**TTL values:**
- `3600` - 1 hour (frequent updates)
- `86400` - 24 hours (recommended)
- `604800` - 7 days (stable projects)

---

## Security Compliance

### Standards Supported

- **NIST 800-161** - Supply Chain Risk Management
- **CISA SBOM 2025** - Software Bill of Materials
- **OWASP Top 10** - Dependency vulnerabilities (A06:2021)

### Audit Trail

All vulnerability scans include:
- Timestamp of scan
- GitHub API version used
- CVE database version
- Affected packages with versions
- Severity classifications

---

## Reporting Security Issues

If you discover a security vulnerability in package-health-analyzer itself, please report it to:

**Email:** 686f6c61@proton.me
**Subject:** [SECURITY] package-health-analyzer vulnerability

**Include:**
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if available)

We will respond within 48 hours and provide a fix within 7 days for critical issues.

---

## Security Roadmap

### Planned Features (v2.1+)

- [ ] npm Advisory Database integration
- [ ] Snyk vulnerability database support
- [ ] SARIF output format for GitHub Security
- [ ] Dependabot alert integration
- [ ] CVE severity override configuration
- [ ] Custom vulnerability database support
- [ ] Token rotation automation
- [ ] Encrypted configuration file support

---

**Last Updated:** 2025-12-13
**Version:** 2.0.0
