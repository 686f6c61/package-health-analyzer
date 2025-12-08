# License Reference Guide

Complete list of licenses by category for configuration in package-health-analyzer.

---

## How to Use

Copy the license identifier exactly as shown below to your `.packagehealthanalyzerrc.json`:

```json
{
  "license": {
    "allow": ["MIT", "Apache-2.0"],
    "deny": ["GPL-2.0", "AGPL-3.0"],
    "warn": ["LGPL-3.0"]
  }
}
```

**Wildcards supported:** Use `*` to match multiple versions (e.g., `GPL-*` matches `GPL-2.0`, `GPL-3.0`, etc.)

---

## Commercial-Friendly Licenses

These licenses are safe for commercial/proprietary projects.

### Permissive Licenses

| License ID | Full Name | Notes |
|------------|-----------|-------|
| `MIT` | MIT License | Most popular, very permissive |
| `ISC` | ISC License | Similar to MIT, slightly simpler |
| `BSD-2-Clause` | BSD 2-Clause "Simplified" | Permissive with attribution |
| `BSD-3-Clause` | BSD 3-Clause "New" or "Revised" | Adds non-endorsement clause |
| `0BSD` | BSD Zero Clause | Public domain equivalent |
| `Apache-2.0` | Apache License 2.0 | Permissive with patent grant |
| `Unlicense` | The Unlicense | Public domain dedication |
| `CC0-1.0` | Creative Commons Zero v1.0 | Public domain waiver |
| `Zlib` | zlib License | Permissive for software |
| `BSL-1.0` | Boost Software License 1.0 | Permissive for C++ libraries |
| `Python-2.0` | Python Software Foundation License | Python-specific |
| `Ruby` | Ruby License | Ruby-specific |
| `PHP-3.01` | PHP License v3.01 | PHP-specific |

### Copy-paste ready list:
```json
"allow": [
  "MIT",
  "ISC",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "0BSD",
  "Apache-2.0",
  "Unlicense",
  "CC0-1.0",
  "Zlib",
  "BSL-1.0",
  "Python-2.0",
  "Ruby",
  "PHP-3.01"
]
```

---

## Commercial-Warning Licenses

These licenses require legal review for commercial use.

### Weak Copyleft

| License ID | Full Name | Notes |
|------------|-----------|-------|
| `LGPL-2.1` | GNU Lesser General Public License v2.1 | Dynamic linking allowed |
| `LGPL-3.0` | GNU Lesser General Public License v3.0 | Updated version, GPLv3 compatible |
| `MPL-2.0` | Mozilla Public License 2.0 | File-level copyleft |
| `EPL-1.0` | Eclipse Public License 1.0 | Weak copyleft, commercial-friendly |
| `EPL-2.0` | Eclipse Public License 2.0 | Updated version |
| `CDDL-1.0` | Common Development and Distribution License 1.0 | Oracle's weak copyleft |
| `CPL-1.0` | Common Public License 1.0 | IBM's weak copyleft |
| `APSL-2.0` | Apple Public Source License 2.0 | Apple's weak copyleft |

### Copy-paste ready list:
```json
"warn": [
  "LGPL-2.1",
  "LGPL-3.0",
  "MPL-2.0",
  "EPL-1.0",
  "EPL-2.0",
  "CDDL-1.0",
  "CPL-1.0",
  "APSL-2.0"
]
```

---

## Commercial-Incompatible Licenses

These licenses require derivative works to be open-sourced.

### Strong Copyleft

| License ID | Full Name | Notes |
|------------|-----------|-------|
| `GPL-2.0` | GNU General Public License v2.0 | Strong copyleft |
| `GPL-2.0-only` | GNU General Public License v2.0 only | Explicit version lock |
| `GPL-2.0-or-later` | GNU General Public License v2.0 or later | Can upgrade to v3 |
| `GPL-3.0` | GNU General Public License v3.0 | Updated strong copyleft |
| `GPL-3.0-only` | GNU General Public License v3.0 only | Explicit version lock |
| `GPL-3.0-or-later` | GNU General Public License v3.0 or later | Future-proof |
| `AGPL-3.0` | GNU Affero General Public License v3.0 | Network copyleft (SaaS must open source) |
| `AGPL-3.0-only` | GNU Affero General Public License v3.0 only | Explicit version lock |
| `AGPL-3.0-or-later` | GNU Affero General Public License v3.0 or later | Future-proof |
| `SSPL-1.0` | Server Side Public License v1 | MongoDB's license, similar to AGPL |

### Copy-paste ready list:
```json
"deny": [
  "GPL-2.0",
  "GPL-2.0-only",
  "GPL-2.0-or-later",
  "GPL-3.0",
  "GPL-3.0-only",
  "GPL-3.0-or-later",
  "AGPL-3.0",
  "AGPL-3.0-only",
  "AGPL-3.0-or-later",
  "SSPL-1.0"
]
```

### Wildcard shortcuts:
```json
"deny": [
  "GPL-*",    // Matches all GPL versions
  "AGPL-*",   // Matches all AGPL versions
  "SSPL-*"    // Matches all SSPL versions
]
```

---

## Creative Commons Licenses

| License ID | Full Name | Commercial Use | Modifications |
|------------|-----------|----------------|---------------|
| `CC0-1.0` | Creative Commons Zero | Allowed | Allowed |
| `CC-BY-4.0` | Attribution 4.0 | Allowed | Allowed |
| `CC-BY-SA-4.0` | Attribution-ShareAlike 4.0 | Allowed | Must share-alike |
| `CC-BY-NC-4.0` | Attribution-NonCommercial 4.0 | Not allowed | Allowed |
| `CC-BY-ND-4.0` | Attribution-NoDerivatives 4.0 | Allowed | Not allowed |
| `CC-BY-NC-SA-4.0` | Attribution-NonCommercial-ShareAlike | Not allowed | Must share-alike |
| `CC-BY-NC-ND-4.0` | Attribution-NonCommercial-NoDerivatives | Not allowed | Not allowed |

**Warning:** Most Creative Commons licenses are **NOT designed for software**. Use SPDX licenses instead.

---

## Other Notable Licenses

| License ID | Category | Notes |
|------------|----------|-------|
| `JSON` | Permissive | "Good, not evil" clause (problematic) |
| `WTFPL` | Permissive | Do What The F*** You Want |
| `Artistic-2.0` | Weak Copyleft | Perl's license |
| `OFL-1.1` | Fonts | SIL Open Font License |
| `PostgreSQL` | Permissive | PostgreSQL License |
| `ODbL-1.0` | Databases | Open Database License |
| `Vim` | Permissive | Vim License (charityware) |
| `X11` | Permissive | Same as MIT |

---

## Configuration Examples

### Strict Commercial Project

Block all copyleft:

```json
{
  "license": {
    "allow": [
      "MIT",
      "ISC",
      "BSD-2-Clause",
      "BSD-3-Clause",
      "Apache-2.0"
    ],
    "deny": [
      "GPL-*",
      "AGPL-*",
      "LGPL-*",
      "SSPL-*"
    ],
    "warn": [],
    "warnOnUnknown": true,
    "checkPatentClauses": true
  }
}
```

### Balanced Commercial Project

Allow weak copyleft, block strong:

```json
{
  "license": {
    "allow": [
      "MIT",
      "ISC",
      "Apache-2.0",
      "BSD-*"
    ],
    "deny": [
      "GPL-*",
      "AGPL-*",
      "SSPL-*"
    ],
    "warn": [
      "LGPL-*",
      "MPL-2.0",
      "EPL-*"
    ],
    "warnOnUnknown": true
  }
}
```

### Open Source Project

Permissive with all licenses:

```json
{
  "license": {
    "allow": [],
    "deny": [],
    "warn": [
      "AGPL-*"
    ],
    "warnOnUnknown": false
  }
}
```

### SaaS Project

Extra AGPL protection:

```json
{
  "license": {
    "allow": [
      "MIT",
      "ISC",
      "Apache-2.0",
      "BSD-*"
    ],
    "deny": [
      "GPL-*",
      "AGPL-*",
      "SSPL-*",
      "CC-BY-NC-*"
    ],
    "warn": [
      "LGPL-*",
      "MPL-2.0"
    ],
    "warnOnUnknown": true
  }
}
```

---

## External Resources

- **SPDX License List:** https://spdx.org/licenses/
- **Choose a License:** https://choosealicense.com/
- **TLDRLegal:** https://www.tldrlegal.com/
- **Blue Oak Council:** https://blueoakcouncil.org/list
- **OSI Approved Licenses:** https://opensource.org/licenses/

---

## Quick Tips

1. **Use wildcards** for version matching: `GPL-*` instead of listing every version
2. **Check patent clauses** - Apache-2.0 includes explicit patent grant
3. **AGPL applies to SaaS** - Network use = distribution
4. **LGPL dynamic linking** - Usually safe if you don't modify the library
5. **Unknown licenses** - Always review before allowing

---

**Last updated:** 2025-12-09
