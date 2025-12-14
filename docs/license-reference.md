# License Reference

Complete reference of all 214 SPDX licenses supported by package-health-analyzer v2.0.0, including OSI approval, FSF Libre status, and patent clause detection.

---

## Quick Reference

This table provides a high-level overview of how the 221 supported licenses are categorized by their level of restriction and legal complexity. The Blue Oak Council rating system helps you quickly identify which licenses are safe for commercial use (Gold), which require careful review (Silver/Bronze), and which present significant legal challenges (Lead). Understanding these categories allows you to make informed decisions about dependency selection at a glance.

| Category | Count | Examples | Use Case |
|----------|-------|----------|----------|
| Permissive (Blue Oak Gold) | 47 | MIT, Apache-2.0, BSD-3-Clause | Safe for all projects, minimal restrictions |
| Permissive (Blue Oak Silver) | 23 | ISC, BSD-2-Clause, 0BSD | Generally safe, slightly more complex legal text |
| Weak Copyleft (Blue Oak Bronze) | 12 | LGPL-3.0, MPL-2.0, EPL-2.0 | File/library-level copyleft, requires review |
| Strong Copyleft (Blue Oak Lead) | 18 | GPL-3.0, AGPL-3.0, SSPL-1.0 | Source disclosure required, avoid for commercial |
| Proprietary/Other | 121 | Elastic-2.0, BUSL-1.1, custom | Modern/restrictive licenses, case-by-case review |

---

## Blue Oak Council Ratings

### Gold Tier (Most Permissive)

The Gold tier represents licenses that combine legal clarity with maximum freedom for users. These licenses impose minimal restrictions on how you can use, modify, and distribute the software. They're ideal for all project types including commercial products, SaaS applications, and proprietary software. The legal text is clear and unambiguous, reducing risk of misinterpretation or hidden obligations.

- **MIT** - MIT License
- **Apache-2.0** - Apache License 2.0 (with patent grant)
- **BSD-3-Clause** - BSD 3-Clause "New" or "Revised" License
- **BSD-2-Clause** - BSD 2-Clause "Simplified" License
- **0BSD** - BSD Zero Clause License
- **Unlicense** - The Unlicense (public domain dedication)
- **ISC** - ISC License
- **Zlib** - zlib License
- **Python-2.0** - Python License 2.0
- **PostgreSQL** - PostgreSQL License
- **NCSA** - University of Illinois/NCSA Open Source License
- **X11** - X11 License
- **WTFPL** - Do What The F*ck You Want To Public License

### Silver Tier (Permissive)

Silver tier licenses are still permissive and safe for most uses, but feature slightly more complex legal language or additional clauses compared to Gold tier. While they don't impose significant restrictions, they may require more careful legal review to understand specific requirements like attribution formats or warranty disclaimers. These licenses are suitable for commercial projects but may need legal counsel for high-stakes applications.

- **AFL-3.0** - Academic Free License v3.0
- **Artistic-2.0** - Artistic License 2.0
- **BSL-1.0** - Boost Software License 1.0
- **CDDL-1.0** - Common Development and Distribution License 1.0
- **ECL-2.0** - Educational Community License v2.0
- **EFL-2.0** - Eiffel Forum License v2.0
- **MirOS** - MirOS License
- **MS-PL** - Microsoft Public License
- **NTP** - NTP License
- **OFL-1.1** - SIL Open Font License 1.1
- **OSL-3.0** - Open Software License 3.0
- **PHP-3.01** - PHP License v3.01
- **UPL-1.0** - Universal Permissive License v1.0

### Bronze Tier (Weak Copyleft)

Bronze tier licenses introduce limited copyleft requirements, typically at the file or library level rather than the entire application. This means you must share modifications to the licensed code itself, but your proprietary application code remains private. These licenses are workable for commercial projects if you understand the boundaries: modifications to LGPL library files must be published, but your code using the library doesn't. Always verify compatibility with your distribution model and consult legal counsel for commercial products.

- **LGPL-2.1** - GNU Lesser General Public License v2.1
- **LGPL-2.1-only** - GNU Lesser General Public License v2.1 only
- **LGPL-2.1-or-later** - GNU Lesser General Public License v2.1 or later
- **LGPL-3.0** - GNU Lesser General Public License v3.0
- **LGPL-3.0-only** - GNU Lesser General Public License v3.0 only
- **LGPL-3.0-or-later** - GNU Lesser General Public License v3.0 or later
- **MPL-1.1** - Mozilla Public License 1.1
- **MPL-2.0** - Mozilla Public License 2.0
- **EPL-1.0** - Eclipse Public License 1.0
- **EPL-2.0** - Eclipse Public License 2.0
- **EUPL-1.2** - European Union Public License 1.2
- **CDDL-1.1** - Common Development and Distribution License 1.1

### Lead Tier (Strong Copyleft)

Lead tier licenses impose the strongest copyleft requirements, typically mandating that your entire application's source code be released under the same license if you distribute the software. For GPL/AGPL, this includes any code that links with or incorporates the licensed library. The AGPL extends this to network use (SaaS), and SSPL specifically targets cloud providers. These licenses are generally incompatible with commercial proprietary software and should be avoided unless you're building an open-source project under compatible terms.

- **GPL-2.0** - GNU General Public License v2.0
- **GPL-2.0-only** - GNU General Public License v2.0 only
- **GPL-2.0-or-later** - GNU General Public License v2.0 or later
- **GPL-3.0** - GNU General Public License v3.0
- **GPL-3.0-only** - GNU General Public License v3.0 only
- **GPL-3.0-or-later** - GNU General Public License v3.0 or later
- **AGPL-3.0** - GNU Affero General Public License v3.0
- **AGPL-3.0-only** - GNU Affero General Public License v3.0 only
- **AGPL-3.0-or-later** - GNU Affero General Public License v3.0 or later
- **SSPL-1.0** - Server Side Public License v1
- **OSL-1.0** - Open Software License 1.0
- **OSL-2.0** - Open Software License 2.0
- **RPSL-1.0** - RealNetworks Public Source License v1.0
- **SISSL** - Sun Industry Standards Source License v1.1
- **Sleepycat** - Sleepycat License
- **QPL-1.0** - Q Public License 1.0
- **Watcom-1.0** - Sybase Open Watcom Public License 1.0

---

## Patent Clauses

Patent clauses in open source licenses provide legal protection against patent litigation from contributors. When a license includes an explicit patent grant, contributors automatically license any patents they hold that cover their contributions. This protects users from the "submarine patent" problem where someone contributes code, then sues users for patent infringement. Defensive termination clauses go further, automatically revoking patent grants if licensees initiate patent litigation. Our database tracks 30 licenses with various levels of patent protection:

**Licenses with explicit patent grants (30 total):**

### Strong Patent Protection

These licenses provide the most comprehensive patent protection through explicit grants and defensive termination clauses. They're ideal for projects where patent litigation is a concern, particularly in enterprise environments or fields with active patent disputes:

- **Apache-2.0** - Explicit patent grant covering all contributions, automatic termination if you sue for patent infringement
- **GPL-3.0** - Patent retaliation clause ensures contributors can't sue users for patents covered by their contributions
- **AGPL-3.0** - Same patent protection as GPL-3.0, extended to network use scenarios
- **MPL-2.0** - Explicit patent grant scoped to modified files, defensive termination provisions
- **EPL-2.0** - Explicit patent grant with termination upon patent litigation initiation
- **OSL-3.0** - Comprehensive patent grant with broad defensive termination triggers

### Moderate Patent Protection
- **CPL-1.0** - Common Public License 1.0
- **IPL-1.0** - IBM Public License v1.0
- **MS-PL** - Microsoft Public License
- **AFL-3.0** - Academic Free License v3.0
- **APL-1.0** - Adaptive Public License v1.0
- **CATOSL-1.1** - Computer Associates Trusted Open Source License 1.1

### Defensive Termination Only
- **PHP-3.01** - PHP License v3.01
- **SPL-1.0** - Sun Public License v1.0
- **Watcom-1.0** - Sybase Open Watcom Public License 1.0
- **APSL-2.0** - Apple Public Source License v2.0

---

## Modern Licenses (2020+)

The software licensing landscape has evolved significantly in recent years, with companies creating new licenses to address modern business models like SaaS and cloud hosting. These licenses attempt to balance open collaboration with sustainable business models, often by restricting commercial use for a period or prohibiting competitors from offering the software as a service. Understanding these modern licenses is critical for teams building on contemporary infrastructure software.

### Business Source License (BSL)

The Business Source License represents a "delayed open source" model where software starts proprietary but automatically converts to a permissive license after a specified time period or under certain conditions. This allows companies to monetize their software initially while still committing to eventual open source release:

- **BUSL-1.1** - Business Source License 1.1
  - **Conversion timeline**: Automatically converts to open source (typically Apache-2.0 or MIT) after a specified period, usually 3-4 years
  - **Commercial restrictions**: Limits production commercial use during the restriction period, but allows development and testing
  - **Popular implementations**: Adopted by CockroachDB, MariaDB MaxScale, and other database vendors seeking to prevent cloud providers from offering hosted versions without contribution

### Elastic License

Created by Elastic (the company behind Elasticsearch) to prevent AWS and other cloud providers from offering their software as a managed service without contributing back. This license allows most uses but specifically prohibits the "SaaS loophole" that companies like AWS exploited:

- **Elastic-2.0** - Elastic License 2.0
  - **SaaS restriction**: Prohibits offering the software as a managed service to third parties (e.g., cannot create "Elasticsearch as a Service")
  - **Permitted uses**: Allows modification, redistribution, and internal use, including for commercial purposes
  - **Real-world application**: Used by Elasticsearch, Kibana, and other Elastic products after their high-profile conflict with AWS over OpenSearch

### PolyForm Licenses
- **PolyForm-Noncommercial-1.0.0** - PolyForm Noncommercial License 1.0.0
- **PolyForm-Small-Business-1.0.0** - PolyForm Small Business License 1.0.0
- **PolyForm-Free-Trial-1.0.0** - PolyForm Free Trial License 1.0.0
- **PolyForm-Internal-Use-1.0.0** - PolyForm Internal Use License 1.0.0
- **PolyForm-Shield-1.0.0** - PolyForm Shield License 1.0.0
- **PolyForm-Perimeter-1.0.0** - PolyForm Perimeter License 1.0.0

---

## SPDX License Exceptions (9 total)

License exceptions are legal modifiers that can be combined with base licenses (typically GPL/LGPL) to grant additional permissions beyond what the base license allows. These exceptions solve specific practical problems, like allowing GPL'd compilers to output proprietary code or permitting Java libraries to link with proprietary applications. The `WITH` keyword in SPDX expressions combines a base license with its exception (e.g., "GPL-2.0 WITH Classpath-exception-2.0"). Understanding exceptions is crucial because they fundamentally change the obligations imposed by strong copyleft licenses.

**Available exceptions that modify GPL/LGPL licenses:**

1. **Classpath-exception-2.0** - Allows linking with any code (used by OpenJDK)
2. **LLVM-exception** - Allows linking with proprietary code (LLVM project)
3. **GCC-exception-3.1** - Runtime library exception for GCC
4. **Qt-LGPL-exception-1.1** - Qt Company LGPL exception
5. **Font-exception-2.0** - Font embedding exception
6. **Autoconf-exception-3.0** - Autoconf configure script exception
7. **Bison-exception-2.2** - Bison parser exception
8. **Bootloader-exception** - Bootloader exception
9. **Linux-syscall-note** - Linux kernel syscall exception

**Usage:**
```
GPL-2.0-only WITH Classpath-exception-2.0
LGPL-3.0-or-later WITH Qt-LGPL-exception-1.1
```

---

## Complete License List (221 Licenses)

Every license in our database has an official SPDX documentation page where you can view the complete license text, legal analysis, and usage notes. All licenses follow the SPDX URL pattern for easy reference and verification.

**How to access any license documentation:**

Each SPDX license has a permanent URL at: `https://spdx.org/licenses/[LICENSE-ID].html`

For example:
- MIT → https://spdx.org/licenses/MIT.html
- Apache-2.0 → https://spdx.org/licenses/Apache-2.0.html
- GPL-3.0-only → https://spdx.org/licenses/GPL-3.0-only.html

Below is the complete alphabetical list of all 221 supported licenses. The most commonly used licenses include direct links, while others can be accessed using the URL pattern above.

### A

**Most Common A Licenses (with direct links):**

- [0BSD](https://spdx.org/licenses/0BSD.html) - BSD Zero Clause License
- [AFL-3.0](https://spdx.org/licenses/AFL-3.0.html) - Academic Free License v3.0
- [AGPL-3.0-only](https://spdx.org/licenses/AGPL-3.0-only.html) - GNU Affero General Public License v3.0 only
- [AGPL-3.0-or-later](https://spdx.org/licenses/AGPL-3.0-or-later.html) - GNU Affero General Public License v3.0 or later
- [Apache-1.0](https://spdx.org/licenses/Apache-1.0.html) - Apache License 1.0
- [Apache-1.1](https://spdx.org/licenses/Apache-1.1.html) - Apache License 1.1
- [Apache-2.0](https://spdx.org/licenses/Apache-2.0.html) - Apache License 2.0
- [Artistic-1.0](https://spdx.org/licenses/Artistic-1.0.html) - Artistic License 1.0
- [Artistic-2.0](https://spdx.org/licenses/Artistic-2.0.html) - Artistic License 2.0

**Other A Licenses:**

AAL, Abstyles, Adobe-2006, Adobe-Glyph, ADSL, AFL-1.1, AFL-1.2, AFL-2.0, AFL-2.1, Afmparse, AGPL-1.0-only, AGPL-1.0-or-later, Aladdin, AMDPLPA, AML, AMPAS, ANTLR-PD, APAFML, APL-1.0, APSL-1.0, APSL-1.1, APSL-1.2, APSL-2.0, Artistic-1.0-Perl, Artistic-1.0-cl8

*Access any license above at: `https://spdx.org/licenses/[LICENSE-ID].html`*

### B

**Most Common B Licenses (with direct links):**

- [BSD-1-Clause](https://spdx.org/licenses/BSD-1-Clause.html) - BSD 1-Clause License
- [BSD-2-Clause](https://spdx.org/licenses/BSD-2-Clause.html) - BSD 2-Clause "Simplified" License
- [BSD-2-Clause-Patent](https://spdx.org/licenses/BSD-2-Clause-Patent.html) - BSD 2-Clause Plus Patent License
- [BSD-3-Clause](https://spdx.org/licenses/BSD-3-Clause.html) - BSD 3-Clause "New" or "Revised" License
- [BSD-4-Clause](https://spdx.org/licenses/BSD-4-Clause.html) - BSD 4-Clause "Original" or "Old" License
- [BSL-1.0](https://spdx.org/licenses/BSL-1.0.html) - Boost Software License 1.0
- [BUSL-1.1](https://spdx.org/licenses/BUSL-1.1.html) - Business Source License 1.1

**Other B Licenses:**

Bahyph, Barr, Beerware, BitTorrent-1.0, BitTorrent-1.1, Borceux, BSD-3-Clause-Attribution, BSD-3-Clause-Clear, BSD-4-Clause-UC, BSD-Protection, BSD-Source-Code, bzip2-1.0.5, bzip2-1.0.6

*Access any license above at: `https://spdx.org/licenses/[LICENSE-ID].html`*

### C

**Most Common C Licenses (with direct links):**

- [CC-BY-4.0](https://spdx.org/licenses/CC-BY-4.0.html) - Creative Commons Attribution 4.0 International
- [CC-BY-SA-4.0](https://spdx.org/licenses/CC-BY-SA-4.0.html) - Creative Commons Attribution Share Alike 4.0 International
- [CC-BY-NC-4.0](https://spdx.org/licenses/CC-BY-NC-4.0.html) - Creative Commons Attribution Non Commercial 4.0 International
- [CC0-1.0](https://spdx.org/licenses/CC0-1.0.html) - Creative Commons Zero v1.0 Universal
- [CDDL-1.0](https://spdx.org/licenses/CDDL-1.0.html) - Common Development and Distribution License 1.0
- [CDDL-1.1](https://spdx.org/licenses/CDDL-1.1.html) - Common Development and Distribution License 1.1
- [CPL-1.0](https://spdx.org/licenses/CPL-1.0.html) - Common Public License 1.0

**Other C Licenses:**

bzip2-1.0.5, bzip2-1.0.6, Caldera, CATOSL-1.1, CC-BY-1.0, CC-BY-2.0, CC-BY-2.5, CC-BY-3.0, CC-BY-NC-1.0, CC-BY-NC-2.0, CC-BY-NC-2.5, CC-BY-NC-3.0, CC-BY-NC-ND-1.0, CC-BY-NC-ND-2.0, CC-BY-NC-ND-2.5, CC-BY-NC-ND-3.0, CC-BY-NC-ND-4.0, CC-BY-NC-SA-1.0, CC-BY-NC-SA-2.0, CC-BY-NC-SA-2.5, CC-BY-NC-SA-3.0, CC-BY-NC-SA-4.0, CC-BY-ND-1.0, CC-BY-ND-2.0, CC-BY-ND-2.5, CC-BY-ND-3.0, CC-BY-ND-4.0, CC-BY-SA-1.0, CC-BY-SA-2.0, CC-BY-SA-2.5, CC-BY-SA-3.0, CECILL-1.0, CECILL-1.1, CECILL-2.0, CECILL-2.1, CECILL-B, CECILL-C, ClArtistic, CNRI-Jython, CNRI-Python, CNRI-Python-GPL-Compatible, Condor-1.1, CPAL-1.0, CPOL-1.02, Crossword, CrystalStacker, CUA-OPL-1.0, Cube, curl

*Access any license above at: `https://spdx.org/licenses/[LICENSE-ID].html`*

### D-E

**Most Common D-E Licenses (with direct links):**

- [ECL-2.0](https://spdx.org/licenses/ECL-2.0.html) - Educational Community License v2.0
- [EPL-1.0](https://spdx.org/licenses/EPL-1.0.html) - Eclipse Public License 1.0
- [EPL-2.0](https://spdx.org/licenses/EPL-2.0.html) - Eclipse Public License 2.0
- [EUPL-1.2](https://spdx.org/licenses/EUPL-1.2.html) - European Union Public License 1.2
- [Elastic-2.0](https://spdx.org/licenses/Elastic-2.0.html) - Elastic License 2.0

**Other D-E Licenses:**

D-FSL-1.0, diffmark, DOC, Dotseqn, DSDP, dvipdfm, ECL-1.0, EFL-1.0, EFL-2.0, eGenix, Entessa, ErlPL-1.1, EUDatagrid, EUPL-1.0, EUPL-1.1, Eurosym

*Access any license above at: `https://spdx.org/licenses/[LICENSE-ID].html`*

### F-I

**Most Common F-I Licenses (with direct links):**

- [GFDL-1.3](https://spdx.org/licenses/GFDL-1.3-only.html) - GNU Free Documentation License v1.3
- [GPL-2.0-only](https://spdx.org/licenses/GPL-2.0-only.html) - GNU General Public License v2.0 only
- [GPL-2.0-or-later](https://spdx.org/licenses/GPL-2.0-or-later.html) - GNU General Public License v2.0 or later
- [GPL-3.0-only](https://spdx.org/licenses/GPL-3.0-only.html) - GNU General Public License v3.0 only
- [GPL-3.0-or-later](https://spdx.org/licenses/GPL-3.0-or-later.html) - GNU General Public License v3.0 or later
- [ISC](https://spdx.org/licenses/ISC.html) - ISC License

**Other F-I Licenses:**

Fair, Frameworx-1.0, FreeImage, FSFAP, FSFUL, FSFULLR, FTL, GFDL-1.1, GFDL-1.2, Giftware, GL2PS, Glide, Glulxe, gnuplot, GPL-1.0, gSOAP-1.3b, HaskellReport, HPND, IBM-pibs, ICU, IJG, ImageMagick, iMatix, Imlib2, Info-ZIP, Intel, Intel-ACPI, Interbase-1.0, IPA, IPL-1.0

*Access any license above at: `https://spdx.org/licenses/[LICENSE-ID].html`*

### J-N

**Most Common J-N Licenses (with direct links):**

- [LGPL-2.0-only](https://spdx.org/licenses/LGPL-2.0-only.html) - GNU Lesser General Public License v2.0 only
- [LGPL-2.0-or-later](https://spdx.org/licenses/LGPL-2.0-or-later.html) - GNU Lesser General Public License v2.0 or later
- [LGPL-2.1-only](https://spdx.org/licenses/LGPL-2.1-only.html) - GNU Lesser General Public License v2.1 only
- [LGPL-2.1-or-later](https://spdx.org/licenses/LGPL-2.1-or-later.html) - GNU Lesser General Public License v2.1 or later
- [LGPL-3.0-only](https://spdx.org/licenses/LGPL-3.0-only.html) - GNU Lesser General Public License v3.0 only
- [LGPL-3.0-or-later](https://spdx.org/licenses/LGPL-3.0-or-later.html) - GNU Lesser General Public License v3.0 or later
- [MIT](https://spdx.org/licenses/MIT.html) - MIT License
- [MIT-0](https://spdx.org/licenses/MIT-0.html) - MIT No Attribution
- [MPL-1.1](https://spdx.org/licenses/MPL-1.1.html) - Mozilla Public License 1.1
- [MPL-2.0](https://spdx.org/licenses/MPL-2.0.html) - Mozilla Public License 2.0
- [MS-PL](https://spdx.org/licenses/MS-PL.html) - Microsoft Public License
- [NCSA](https://spdx.org/licenses/NCSA.html) - University of Illinois/NCSA Open Source License
- [NTP](https://spdx.org/licenses/NTP.html) - NTP License

**Other J-N Licenses:**

JasPer-2.0, JSON, LAL-1.2, LAL-1.3, Latex2e, Leptonica, LGPLLR, Libpng, libtiff, LiLiQ-P-1.1, LiLiQ-R-1.1, LiLiQ-Rplus-1.1, LPL-1.0, LPL-1.02, LPPL-1.0, LPPL-1.1, LPPL-1.2, LPPL-1.3a, LPPL-1.3c, MakeIndex, MirOS, MIT-advertising, MIT-CMU, MIT-enna, MIT-feh, MITNFA, Motosoto, mpich2, MPL-1.0, MPL-2.0-no-copyleft-exception, MS-RL, MTLL, Multics, Mup, NASA-1.3, Naumen, NBPL-1.0, Net-SNMP, NetCDF, Newsletr, NGPL, NLOD-1.0, NLPL, Nokia, NOSL, Noweb, NPL-1.0, NPL-1.1, NPOSL-3.0, NRL

*Access any license above at: `https://spdx.org/licenses/[LICENSE-ID].html`*

### O-S

**Most Common O-S Licenses (with direct links):**

- [OFL-1.1](https://spdx.org/licenses/OFL-1.1.html) - SIL Open Font License 1.1
- [OpenSSL](https://spdx.org/licenses/OpenSSL.html) - OpenSSL License
- [OSL-3.0](https://spdx.org/licenses/OSL-3.0.html) - Open Software License 3.0
- [PHP-3.01](https://spdx.org/licenses/PHP-3.01.html) - PHP License v3.01
- [PostgreSQL](https://spdx.org/licenses/PostgreSQL.html) - PostgreSQL License
- [Python-2.0](https://spdx.org/licenses/Python-2.0.html) - Python License 2.0
- [Ruby](https://spdx.org/licenses/Ruby.html) - Ruby License
- [SSPL-1.0](https://spdx.org/licenses/SSPL-1.0.html) - Server Side Public License v1

**Other O-S Licenses:**

OCCT-PL, OCLC-2.0, ODbL-1.0, OFL-1.0, OGTSL, OLDAP-1.1 through OLDAP-2.8, OML, OPL-1.0, OSET-PL-2.1, OSL-1.0, OSL-1.1, OSL-2.0, OSL-2.1, PDDL-1.0, PHP-3.0, Plexus, PolyForm-Noncommercial-1.0.0, PolyForm-Small-Business-1.0.0, PolyForm-Free-Trial-1.0.0, PolyForm-Internal-Use-1.0.0, PolyForm-Shield-1.0.0, PolyForm-Perimeter-1.0.0, psfrag, psutils, Qhull, QPL-1.0, Rdisc, RHeCos-1.1, RPL-1.1, RPL-1.5, RPSL-1.0, RSA-MD, RSCPL, SAX-PD, Saxpath, SCEA, Sendmail, SGI-B-1.0, SGI-B-1.1, SGI-B-2.0, SimPL-2.0, SISSL, SISSL-1.2, Sleepycat, SMLNJ, SMPPL, SNIA, Spencer-86, Spencer-94, Spencer-99, SPL-1.0, SugarCRM-1.1.3, SWL

*Access any license above at: `https://spdx.org/licenses/[LICENSE-ID].html`*

### T-Z

**Most Common T-Z Licenses (with direct links):**

- [Unlicense](https://spdx.org/licenses/Unlicense.html) - The Unlicense
- [UPL-1.0](https://spdx.org/licenses/UPL-1.0.html) - Universal Permissive License v1.0
- [W3C](https://spdx.org/licenses/W3C.html) - W3C Software Notice and License
- [WTFPL](https://spdx.org/licenses/WTFPL.html) - Do What The F*ck You Want To Public License
- [X11](https://spdx.org/licenses/X11.html) - X11 License
- [Zlib](https://spdx.org/licenses/Zlib.html) - zlib License
- [ZPL-2.1](https://spdx.org/licenses/ZPL-2.1.html) - Zope Public License 2.1

**Other T-Z Licenses:**

TCL, TCP-wrappers, TMate, TORQUE-1.1, TOSL, Unicode-DFS-2015, Unicode-DFS-2016, Unicode-TOU, Vim, VOSTROM, VSL-1.0, W3C-19980720, W3C-20150513, Watcom-1.0, Wsuipa, Xerox, XFree86-1.1, xinetd, Xnet, xpp, XSkat, YPL-1.0, YPL-1.1, Zed, Zend-2.0, Zimbra-1.3, Zimbra-1.4, zlib-acknowledgement, ZPL-1.1, ZPL-2.0

*Access any license above at: `https://spdx.org/licenses/[LICENSE-ID].html`*

---

## License Compatibility

Understanding license compatibility is essential when combining dependencies with different licenses in a single application. When you use multiple libraries together, you must satisfy all their license requirements simultaneously. Some licenses are compatible (can be combined), while others create conflicts that make legal compliance impossible. The general rule: combining licenses results in the most restrictive license applying to the whole work.

### Safe Combinations (Permissive + Permissive)

These combinations work perfectly because all permissive licenses allow proprietary use and have similar attribution requirements. The result is a work licensed under both licenses simultaneously, which is legally straightforward:

- [OK] **MIT + Apache-2.0**: Common in modern JavaScript projects, no conflicts
- [OK] **BSD-3-Clause + ISC**: Both require attribution, fully compatible
- [OK] **MIT + BSD-2-Clause**: Similar requirements, safe to combine
- [OK] **Apache-2.0 + BSD-3-Clause**: Can distribute under both licenses concurrently

### Compatible but Restricted (Permissive + Weak Copyleft)

These combinations are legally valid, but the copyleft license "wins" and imposes its requirements on the combined work. You can still create proprietary software, but must comply with the copyleft license's specific requirements (usually file-level source disclosure):

- [WARNING] **MIT + LGPL-2.1**: Result is LGPL-2.1 - must disclose library modifications but your code stays private
- [WARNING] **Apache-2.0 + MPL-2.0**: Result is MPL-2.0 - modified MPL files must be published
- [WARNING] **BSD + EPL-2.0**: Result is EPL-2.0 - file-level copyleft applies

### Incompatible (Permissive + Strong Copyleft)

These combinations create irreconcilable conflicts for proprietary software. The strong copyleft license requires source disclosure of the entire application, which is incompatible with building closed-source commercial products:

- [FAIL] **MIT + GPL-3.0**: Cannot distribute proprietary - GPL requires full source disclosure
- [FAIL] **Apache-2.0 + AGPL-3.0**: Network copyleft triggers even for SaaS, must publish all code
- [FAIL] **BSD + SSPL-1.0**: SaaS providers must publish infrastructure code, extremely restrictive

### Copyleft Compatibility

Copyleft licenses can sometimes be combined with each other, but version and license family matter significantly. "Or-later" clauses provide upgrade paths, while "only" versions create strict boundaries:

- [OK] **GPL-2.0 + GPL-3.0-or-later**: Can upgrade entire work to GPL-3.0, compatible
- [OK] **LGPL-2.1 + LGPL-3.0**: Can upgrade to LGPL-3.0, same license family
- [FAIL] **GPL-2.0-only + Apache-2.0**: Patent clause in Apache-2.0 is incompatible with GPL-2.0's terms
- [FAIL] **GPL-2.0-only + GPL-3.0-only**: Version mismatch prevents combination without explicit "or-later" clause

---

## Usage in Configuration

```json
{
  "license": {
    "allow": ["MIT", "ISC", "BSD-2-Clause", "BSD-3-Clause", "Apache-2.0"],
    "deny": ["GPL-*", "AGPL-*", "SSPL-*"],
    "warn": ["LGPL-*", "MPL-2.0", "EPL-2.0"],
    "warnOnUnknown": true,
    "checkPatentClauses": true
  }
}
```

**Wildcard support:**
- `GPL-*` matches GPL-2.0, GPL-2.0-only, GPL-3.0, GPL-3.0-or-later
- `LGPL-*` matches all LGPL variants
- `CC-BY-NC-*` matches all Creative Commons NonCommercial licenses

---

## Resources

- **SPDX License List:** https://spdx.org/licenses/
- **Blue Oak Council:** https://blueoakcouncil.org/list
- **Choose a License:** https://choosealicense.com/
- **TLDRLegal:** https://tldrlegal.com/
- **OSI Approved:** https://opensource.org/licenses

---

**Last Updated:** 2025-12-13
**Version:** 2.0.0
**SPDX License List Version:** 3.27.0
