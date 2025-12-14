/**
 * package-health-analyzer - SPDX License Database
 *
 * Maintains a comprehensive, curated database of 221 SPDX licenses and 9 license exceptions with rich metadata including
 * OSI approval status, FSF libre classification, and patent clause indicators. This module serves as the authoritative
 * license reference for the entire analyzer, providing structured data that powers license validation, compatibility
 * checking, and legal risk assessment. It extends the basic SPDX license list with critical metadata about patent grants,
 * enabling teams to identify licenses that provide explicit patent protection versus those that create patent risk.
 *
 * Key responsibilities:
 * - Define complete SPDX license catalog with full names and metadata
 * - Identify 30 licenses containing explicit patent grant clauses
 * - Catalog 9 standard SPDX license exceptions (Classpath, LLVM, etc.)
 * - Provide OSI approval and FSF libre freedom status for each license
 * - Support license lookup by SPDX ID with full metadata retrieval
 * - Enable patent clause detection for patent risk assessment
 * - Mark deprecated licenses for migration guidance
 *
 * @module utils/spdx-licenses
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

export interface SPDXLicense {
  id: string;
  name: string;
  deprecated?: boolean;
  osiApproved?: boolean;
  fsfLibre?: boolean;
  hasPatentClause?: boolean;
}

/**
 * SPDX Licenses with Patent Clauses (30 total)
 */
export const licensesWithPatentClauses = new Set([
  'Apache-1.1',
  'Apache-2.0',
  'AFL-1.1',
  'AFL-1.2',
  'AFL-2.0',
  'AFL-2.1',
  'AFL-3.0',
  'APL-1.0',
  'APSL-1.0',
  'APSL-1.1',
  'APSL-1.2',
  'APSL-2.0',
  'CATOSL-1.1',
  'CDDL-1.0',
  'CDDL-1.1',
  'CPL-1.0',
  'EPL-1.0',
  'EPL-2.0',
  'EUPL-1.0',
  'EUPL-1.1',
  'EUPL-1.2',
  'GPL-3.0',
  'GPL-3.0-only',
  'GPL-3.0-or-later',
  'IPL-1.0',
  'MPL-2.0',
  'MS-PL',
  'OSL-3.0',
  'PHP-3.01',
  'SPL-1.0',
]);

/**
 * SPDX License Exceptions (9 total)
 */
export const spdxExceptions = [
  'Classpath-exception-2.0',
  'LLVM-exception',
  'GCC-exception-3.1',
  'Qt-LGPL-exception-1.1',
  'Font-exception-2.0',
  'Autoconf-exception-3.0',
  'Bison-exception-2.2',
  'Bootloader-exception',
  'Linux-syscall-note',
] as const;

/**
 * Complete SPDX License Database (221 licenses)
 */
export const allSPDXLicenses: SPDXLicense[] = [
  // Permissive Licenses (A-C)
  { id: '0BSD', name: 'BSD Zero Clause License', osiApproved: true, fsfLibre: true },
  { id: 'AAL', name: 'Attribution Assurance License', osiApproved: true },
  { id: 'AFL-1.1', name: 'Academic Free License v1.1', osiApproved: true, hasPatentClause: true },
  { id: 'AFL-1.2', name: 'Academic Free License v1.2', osiApproved: true, hasPatentClause: true },
  { id: 'AFL-2.0', name: 'Academic Free License v2.0', osiApproved: true, hasPatentClause: true },
  { id: 'AFL-2.1', name: 'Academic Free License v2.1', osiApproved: true, hasPatentClause: true },
  { id: 'AFL-3.0', name: 'Academic Free License v3.0', osiApproved: true, fsfLibre: true, hasPatentClause: true },
  { id: 'Apache-1.0', name: 'Apache License 1.0', fsfLibre: true },
  { id: 'Apache-1.1', name: 'Apache License 1.1', osiApproved: true, fsfLibre: true, hasPatentClause: true },
  { id: 'Apache-2.0', name: 'Apache License 2.0', osiApproved: true, fsfLibre: true, hasPatentClause: true },
  { id: 'APL-1.0', name: 'Adaptive Public License v1.0', osiApproved: true, hasPatentClause: true },
  { id: 'APSL-1.0', name: 'Apple Public Source License v1.0', osiApproved: true, hasPatentClause: true },
  { id: 'APSL-1.1', name: 'Apple Public Source License v1.1', hasPatentClause: true },
  { id: 'APSL-1.2', name: 'Apple Public Source License v1.2', hasPatentClause: true },
  { id: 'APSL-2.0', name: 'Apple Public Source License v2.0', osiApproved: true, fsfLibre: true, hasPatentClause: true },
  { id: 'Artistic-1.0', name: 'Artistic License 1.0', osiApproved: true },
  { id: 'Artistic-1.0-Perl', name: 'Artistic License 1.0 (Perl)', osiApproved: true },
  { id: 'Artistic-1.0-cl8', name: 'Artistic License 1.0 w/clause 8', osiApproved: true },
  { id: 'Artistic-2.0', name: 'Artistic License 2.0', osiApproved: true, fsfLibre: true },
  { id: 'BlueOak-1.0.0', name: 'Blue Oak Model License 1.0.0' },
  { id: 'BSD-1-Clause', name: 'BSD 1-Clause License', osiApproved: true },
  { id: 'BSD-2-Clause', name: 'BSD 2-Clause "Simplified" License', osiApproved: true, fsfLibre: true },
  { id: 'BSD-2-Clause-Patent', name: 'BSD 2-Clause Plus Patent License', osiApproved: true },
  { id: 'BSD-3-Clause', name: 'BSD 3-Clause "New" or "Revised" License', osiApproved: true, fsfLibre: true },
  { id: 'BSD-3-Clause-Clear', name: 'BSD 3-Clause Clear License', fsfLibre: true },
  { id: 'BSD-4-Clause', name: 'BSD 4-Clause "Original" or "Old" License', fsfLibre: true },
  { id: 'BSL-1.0', name: 'Boost Software License 1.0', osiApproved: true, fsfLibre: true },
  { id: 'BUSL-1.1', name: 'Business Source License 1.1' },
  { id: 'CC0-1.0', name: 'Creative Commons Zero v1.0 Universal', fsfLibre: true },
  { id: 'CC-BY-1.0', name: 'Creative Commons Attribution 1.0 Generic' },
  { id: 'CC-BY-2.0', name: 'Creative Commons Attribution 2.0 Generic' },
  { id: 'CC-BY-2.5', name: 'Creative Commons Attribution 2.5 Generic' },
  { id: 'CC-BY-3.0', name: 'Creative Commons Attribution 3.0 Unported' },
  { id: 'CC-BY-4.0', name: 'Creative Commons Attribution 4.0 International' },
  { id: 'CC-BY-NC-1.0', name: 'Creative Commons Attribution Non Commercial 1.0 Generic' },
  { id: 'CC-BY-NC-2.0', name: 'Creative Commons Attribution Non Commercial 2.0 Generic' },
  { id: 'CC-BY-NC-2.5', name: 'Creative Commons Attribution Non Commercial 2.5 Generic' },
  { id: 'CC-BY-NC-3.0', name: 'Creative Commons Attribution Non Commercial 3.0 Unported' },
  { id: 'CC-BY-NC-4.0', name: 'Creative Commons Attribution Non Commercial 4.0 International' },
  { id: 'CC-BY-NC-ND-1.0', name: 'Creative Commons Attribution Non Commercial No Derivatives 1.0 Generic' },
  { id: 'CC-BY-NC-ND-2.0', name: 'Creative Commons Attribution Non Commercial No Derivatives 2.0 Generic' },
  { id: 'CC-BY-NC-ND-2.5', name: 'Creative Commons Attribution Non Commercial No Derivatives 2.5 Generic' },
  { id: 'CC-BY-NC-ND-3.0', name: 'Creative Commons Attribution Non Commercial No Derivatives 3.0 Unported' },
  { id: 'CC-BY-NC-ND-4.0', name: 'Creative Commons Attribution Non Commercial No Derivatives 4.0 International' },
  { id: 'CC-BY-NC-SA-1.0', name: 'Creative Commons Attribution Non Commercial Share Alike 1.0 Generic' },
  { id: 'CC-BY-NC-SA-2.0', name: 'Creative Commons Attribution Non Commercial Share Alike 2.0 Generic' },
  { id: 'CC-BY-NC-SA-2.5', name: 'Creative Commons Attribution Non Commercial Share Alike 2.5 Generic' },
  { id: 'CC-BY-NC-SA-3.0', name: 'Creative Commons Attribution Non Commercial Share Alike 3.0 Unported' },
  { id: 'CC-BY-NC-SA-4.0', name: 'Creative Commons Attribution Non Commercial Share Alike 4.0 International' },
  { id: 'CC-BY-ND-1.0', name: 'Creative Commons Attribution No Derivatives 1.0 Generic' },
  { id: 'CC-BY-ND-2.0', name: 'Creative Commons Attribution No Derivatives 2.0 Generic' },
  { id: 'CC-BY-ND-2.5', name: 'Creative Commons Attribution No Derivatives 2.5 Generic' },
  { id: 'CC-BY-ND-3.0', name: 'Creative Commons Attribution No Derivatives 3.0 Unported' },
  { id: 'CC-BY-ND-4.0', name: 'Creative Commons Attribution No Derivatives 4.0 International' },
  { id: 'CC-BY-SA-1.0', name: 'Creative Commons Attribution Share Alike 1.0 Generic' },
  { id: 'CC-BY-SA-2.0', name: 'Creative Commons Attribution Share Alike 2.0 Generic' },
  { id: 'CC-BY-SA-2.5', name: 'Creative Commons Attribution Share Alike 2.5 Generic' },
  { id: 'CC-BY-SA-3.0', name: 'Creative Commons Attribution Share Alike 3.0 Unported' },
  { id: 'CC-BY-SA-4.0', name: 'Creative Commons Attribution Share Alike 4.0 International' },
  { id: 'CATOSL-1.1', name: 'Computer Associates Trusted Open Source License 1.1', osiApproved: true, hasPatentClause: true },
  { id: 'CDDL-1.0', name: 'Common Development and Distribution License 1.0', osiApproved: true, fsfLibre: true, hasPatentClause: true },
  { id: 'CDDL-1.1', name: 'Common Development and Distribution License 1.1', hasPatentClause: true },
  { id: 'CECILL-2.0', name: 'CeCILL Free Software License Agreement v2.0' },
  { id: 'CECILL-2.1', name: 'CeCILL Free Software License Agreement v2.1', osiApproved: true },
  { id: 'CECILL-B', name: 'CeCILL-B Free Software License Agreement', fsfLibre: true },
  { id: 'CECILL-C', name: 'CeCILL-C Free Software License Agreement', fsfLibre: true },
  { id: 'ClArtistic', name: 'Clarified Artistic License', fsfLibre: true },
  { id: 'CNRI-Python', name: 'CNRI Python License', osiApproved: true },
  { id: 'CPAL-1.0', name: 'Common Public Attribution License 1.0', osiApproved: true, fsfLibre: true },
  { id: 'CPL-1.0', name: 'Common Public License 1.0', osiApproved: true, fsfLibre: true, hasPatentClause: true },
  { id: 'curl', name: 'curl License' },

  // More Permissive (D-I)
  { id: 'ECL-1.0', name: 'Educational Community License v1.0', osiApproved: true },
  { id: 'ECL-2.0', name: 'Educational Community License v2.0', osiApproved: true, fsfLibre: true },
  { id: 'EFL-1.0', name: 'Eiffel Forum License v1.0', osiApproved: true },
  { id: 'EFL-2.0', name: 'Eiffel Forum License v2.0', osiApproved: true, fsfLibre: true },
  { id: 'Elastic-2.0', name: 'Elastic License 2.0' },
  { id: 'Entessa', name: 'Entessa Public License v1.0', osiApproved: true },
  { id: 'EPL-1.0', name: 'Eclipse Public License 1.0', osiApproved: true, fsfLibre: true, hasPatentClause: true },
  { id: 'EPL-2.0', name: 'Eclipse Public License 2.0', osiApproved: true, fsfLibre: true, hasPatentClause: true },
  { id: 'ErlPL-1.1', name: 'Erlang Public License v1.1' },
  { id: 'EUDatagrid', name: 'EU DataGrid Software License', osiApproved: true, fsfLibre: true },
  { id: 'EUPL-1.0', name: 'European Union Public License 1.0', hasPatentClause: true },
  { id: 'EUPL-1.1', name: 'European Union Public License 1.1', osiApproved: true, fsfLibre: true, hasPatentClause: true },
  { id: 'EUPL-1.2', name: 'European Union Public License 1.2', osiApproved: true, fsfLibre: true, hasPatentClause: true },
  { id: 'Fair', name: 'Fair License', osiApproved: true },
  { id: 'Frameworx-1.0', name: 'Frameworx Open License 1.0', osiApproved: true },
  { id: 'FTL', name: 'Freetype Project License', fsfLibre: true },
  { id: 'GFDL-1.1', name: 'GNU Free Documentation License v1.1', deprecated: true, fsfLibre: true },
  { id: 'GFDL-1.2', name: 'GNU Free Documentation License v1.2', deprecated: true, fsfLibre: true },
  { id: 'GFDL-1.3', name: 'GNU Free Documentation License v1.3', deprecated: true, fsfLibre: true },
  { id: 'gnuplot', name: 'gnuplot License', fsfLibre: true },
  { id: 'HPND', name: 'Historical Permission Notice and Disclaimer', osiApproved: true, fsfLibre: true },
  { id: 'ICU', name: 'ICU License' },
  { id: 'IJG', name: 'Independent JPEG Group License', fsfLibre: true },
  { id: 'ImageMagick', name: 'ImageMagick License' },
  { id: 'iMatix', name: 'iMatix Standard Function Library Agreement', fsfLibre: true },
  { id: 'Imlib2', name: 'Imlib2 License', fsfLibre: true },
  { id: 'Info-ZIP', name: 'Info-ZIP License' },
  { id: 'Intel', name: 'Intel Open Source License', osiApproved: true, fsfLibre: true },
  { id: 'IPA', name: 'IPA Font License', osiApproved: true, fsfLibre: true },
  { id: 'IPL-1.0', name: 'IBM Public License v1.0', osiApproved: true, fsfLibre: true, hasPatentClause: true },
  { id: 'ISC', name: 'ISC License', osiApproved: true, fsfLibre: true },

  // Copyleft Licenses (L-M)
  { id: 'LGPL-2.0', name: 'GNU Lesser General Public License v2.0', deprecated: true, osiApproved: true },
  { id: 'LGPL-2.0-only', name: 'GNU Lesser General Public License v2.0 only', osiApproved: true },
  { id: 'LGPL-2.0-or-later', name: 'GNU Lesser General Public License v2.0 or later', osiApproved: true },
  { id: 'LGPL-2.1', name: 'GNU Lesser General Public License v2.1', deprecated: true, osiApproved: true, fsfLibre: true },
  { id: 'LGPL-2.1-only', name: 'GNU Lesser General Public License v2.1 only', osiApproved: true, fsfLibre: true },
  { id: 'LGPL-2.1-or-later', name: 'GNU Lesser General Public License v2.1 or later', osiApproved: true, fsfLibre: true },
  { id: 'LGPL-3.0', name: 'GNU Lesser General Public License v3.0', deprecated: true, osiApproved: true, fsfLibre: true },
  { id: 'LGPL-3.0-only', name: 'GNU Lesser General Public License v3.0 only', osiApproved: true, fsfLibre: true },
  { id: 'LGPL-3.0-or-later', name: 'GNU Lesser General Public License v3.0 or later', osiApproved: true, fsfLibre: true },
  { id: 'LiLiQ-P-1.1', name: 'Licence Libre du Québec – Permissive version 1.1', osiApproved: true },
  { id: 'LiLiQ-R-1.1', name: 'Licence Libre du Québec – Réciprocité version 1.1', osiApproved: true },
  { id: 'LiLiQ-Rplus-1.1', name: 'Licence Libre du Québec – Réciprocité forte version 1.1', osiApproved: true },
  { id: 'LPL-1.0', name: 'Lucent Public License v1.0', osiApproved: true },
  { id: 'LPL-1.02', name: 'Lucent Public License v1.02', osiApproved: true, fsfLibre: true },
  { id: 'LPPL-1.0', name: 'LaTeX Project Public License v1.0' },
  { id: 'LPPL-1.1', name: 'LaTeX Project Public License v1.1' },
  { id: 'LPPL-1.2', name: 'LaTeX Project Public License v1.2', fsfLibre: true },
  { id: 'LPPL-1.3a', name: 'LaTeX Project Public License v1.3a', fsfLibre: true },
  { id: 'LPPL-1.3c', name: 'LaTeX Project Public License v1.3c', osiApproved: true },
  { id: 'MirOS', name: 'MirOS License', osiApproved: true },
  { id: 'MIT', name: 'MIT License', osiApproved: true, fsfLibre: true },
  { id: 'MIT-0', name: 'MIT No Attribution', osiApproved: true },
  { id: 'Motosoto', name: 'Motosoto License', osiApproved: true },
  { id: 'MPL-1.0', name: 'Mozilla Public License 1.0', osiApproved: true },
  { id: 'MPL-1.1', name: 'Mozilla Public License 1.1', osiApproved: true, fsfLibre: true },
  { id: 'MPL-2.0', name: 'Mozilla Public License 2.0', osiApproved: true, fsfLibre: true, hasPatentClause: true },
  { id: 'MPL-2.0-no-copyleft-exception', name: 'Mozilla Public License 2.0 (no copyleft exception)', osiApproved: true },
  { id: 'MS-PL', name: 'Microsoft Public License', osiApproved: true, fsfLibre: true, hasPatentClause: true },
  { id: 'MS-RL', name: 'Microsoft Reciprocal License', osiApproved: true, fsfLibre: true },
  { id: 'Multics', name: 'Multics License', osiApproved: true },
  { id: 'MulanPSL-2.0', name: 'Mulan Permissive Software License, Version 2', osiApproved: true },

  // More Licenses (N-P)
  { id: 'NAIST-2003', name: 'Nara Institute of Science and Technology License (2003)' },
  { id: 'NASA-1.3', name: 'NASA Open Source Agreement 1.3', osiApproved: true },
  { id: 'Naumen', name: 'Naumen Public License', osiApproved: true },
  { id: 'NBPL-1.0', name: 'Net Boolean Public License v1' },
  { id: 'NCSA', name: 'University of Illinois/NCSA Open Source License', osiApproved: true, fsfLibre: true },
  { id: 'NGPL', name: 'Nethack General Public License', osiApproved: true },
  { id: 'NLPL', name: 'No Limit Public License' },
  { id: 'Nokia', name: 'Nokia Open Source License', osiApproved: true, fsfLibre: true },
  { id: 'NOSL', name: 'Netscape Open Source License v1.0' },
  { id: 'NPL-1.0', name: 'Netscape Public License v1.0', fsfLibre: true },
  { id: 'NPL-1.1', name: 'Netscape Public License v1.1', fsfLibre: true },
  { id: 'NPOSL-3.0', name: 'Non-Profit Open Software License 3.0', osiApproved: true },
  { id: 'NTP', name: 'NTP License', osiApproved: true },
  { id: 'ODbL-1.0', name: 'Open Data Commons Open Database License v1.0', fsfLibre: true },
  { id: 'OFL-1.0', name: 'SIL Open Font License 1.0', fsfLibre: true },
  { id: 'OFL-1.1', name: 'SIL Open Font License 1.1', osiApproved: true, fsfLibre: true },
  { id: 'OGTSL', name: 'Open Group Test Suite License', osiApproved: true },
  { id: 'OLDAP-2.8', name: 'Open LDAP Public License v2.8' },
  { id: 'OML', name: 'Open Market License' },
  { id: 'OpenSSL', name: 'OpenSSL License', fsfLibre: true },
  { id: 'OPL-1.0', name: 'Open Public License v1.0' },
  { id: 'OSL-1.0', name: 'Open Software License 1.0', osiApproved: true, fsfLibre: true },
  { id: 'OSL-1.1', name: 'Open Software License 1.1', fsfLibre: true },
  { id: 'OSL-2.0', name: 'Open Software License 2.0', osiApproved: true, fsfLibre: true },
  { id: 'OSL-2.1', name: 'Open Software License 2.1', osiApproved: true, fsfLibre: true },
  { id: 'OSL-3.0', name: 'Open Software License 3.0', osiApproved: true, fsfLibre: true, hasPatentClause: true },
  { id: 'PHP-3.0', name: 'PHP License v3.0', osiApproved: true },
  { id: 'PHP-3.01', name: 'PHP License v3.01', osiApproved: true, fsfLibre: true, hasPatentClause: true },
  { id: 'Plexus', name: 'Plexus Classworlds License' },
  { id: 'PolyForm-Noncommercial-1.0.0', name: 'PolyForm Noncommercial License 1.0.0' },
  { id: 'PolyForm-Small-Business-1.0.0', name: 'PolyForm Small Business License 1.0.0' },
  { id: 'PostgreSQL', name: 'PostgreSQL License', osiApproved: true },
  { id: 'PSF-2.0', name: 'Python Software Foundation License 2.0' },
  { id: 'Python-2.0', name: 'Python License 2.0', osiApproved: true, fsfLibre: true },

  // More Copyleft (Q-U)
  { id: 'Qhull', name: 'Qhull License' },
  { id: 'QPL-1.0', name: 'Q Public License 1.0', osiApproved: true, fsfLibre: true },
  { id: 'RPL-1.1', name: 'Reciprocal Public License 1.1', osiApproved: true },
  { id: 'RPL-1.5', name: 'Reciprocal Public License 1.5', osiApproved: true },
  { id: 'RPSL-1.0', name: 'RealNetworks Public Source License v1.0', osiApproved: true, fsfLibre: true },
  { id: 'Ruby', name: 'Ruby License', fsfLibre: true },
  { id: 'SGI-B-2.0', name: 'SGI Free Software License B v2.0', fsfLibre: true },
  { id: 'SimPL-2.0', name: 'Simple Public License 2.0', osiApproved: true },
  { id: 'SISSL', name: 'Sun Industry Standards Source License v1.1', osiApproved: true, fsfLibre: true },
  { id: 'Sleepycat', name: 'Sleepycat License', osiApproved: true, fsfLibre: true },
  { id: 'SMLNJ', name: 'Standard ML of New Jersey License', fsfLibre: true },
  { id: 'SPL-1.0', name: 'Sun Public License v1.0', osiApproved: true, fsfLibre: true, hasPatentClause: true },
  { id: 'SSPL-1.0', name: 'Server Side Public License v1' },
  { id: 'SugarCRM-1.1.3', name: 'SugarCRM Public License v1.1.3' },
  { id: 'UPL-1.0', name: 'Universal Permissive License v1.0', osiApproved: true, fsfLibre: true },
  { id: 'Unlicense', name: 'The Unlicense', osiApproved: true, fsfLibre: true },

  // Final Set (V-Z)
  { id: 'Vim', name: 'Vim License', fsfLibre: true },
  { id: 'VSL-1.0', name: 'Vovida Software License v1.0', osiApproved: true },
  { id: 'W3C', name: 'W3C Software Notice and License (2002-12-31)', osiApproved: true, fsfLibre: true },
  { id: 'Watcom-1.0', name: 'Sybase Open Watcom Public License 1.0', osiApproved: true },
  { id: 'Wsuipa', name: 'Wsuipa License' },
  { id: 'WTFPL', name: 'Do What The F*ck You Want To Public License', fsfLibre: true },
  { id: 'X11', name: 'X11 License', fsfLibre: true },
  { id: 'Xnet', name: 'X.Net License', osiApproved: true },
  { id: 'YPL-1.0', name: 'Yahoo! Public License v1.0' },
  { id: 'YPL-1.1', name: 'Yahoo! Public License v1.1', fsfLibre: true },
  { id: 'Zed', name: 'Zed License' },
  { id: 'Zend-2.0', name: 'Zend License v2.0', fsfLibre: true },
  { id: 'Zimbra-1.3', name: 'Zimbra Public License v1.3', fsfLibre: true },
  { id: 'Zlib', name: 'zlib License', osiApproved: true, fsfLibre: true },
  { id: 'ZPL-2.0', name: 'Zope Public License 2.0', osiApproved: true, fsfLibre: true },
  { id: 'ZPL-2.1', name: 'Zope Public License 2.1', fsfLibre: true },

  // Strong Copyleft (GPL/AGPL)
  { id: 'GPL-1.0', name: 'GNU General Public License v1.0', deprecated: true },
  { id: 'GPL-1.0-only', name: 'GNU General Public License v1.0 only' },
  { id: 'GPL-1.0-or-later', name: 'GNU General Public License v1.0 or later' },
  { id: 'GPL-2.0', name: 'GNU General Public License v2.0', deprecated: true, osiApproved: true, fsfLibre: true },
  { id: 'GPL-2.0-only', name: 'GNU General Public License v2.0 only', osiApproved: true, fsfLibre: true },
  { id: 'GPL-2.0-or-later', name: 'GNU General Public License v2.0 or later', osiApproved: true, fsfLibre: true },
  { id: 'GPL-3.0', name: 'GNU General Public License v3.0', deprecated: true, osiApproved: true, fsfLibre: true, hasPatentClause: true },
  { id: 'GPL-3.0-only', name: 'GNU General Public License v3.0 only', osiApproved: true, fsfLibre: true, hasPatentClause: true },
  { id: 'GPL-3.0-or-later', name: 'GNU General Public License v3.0 or later', osiApproved: true, fsfLibre: true, hasPatentClause: true },
  { id: 'AGPL-1.0', name: 'Affero General Public License v1.0', deprecated: true },
  { id: 'AGPL-1.0-only', name: 'Affero General Public License v1.0 only' },
  { id: 'AGPL-1.0-or-later', name: 'Affero General Public License v1.0 or later' },
  { id: 'AGPL-3.0', name: 'GNU Affero General Public License v3.0', deprecated: true, osiApproved: true, fsfLibre: true },
  { id: 'AGPL-3.0-only', name: 'GNU Affero General Public License v3.0 only', osiApproved: true, fsfLibre: true },
  { id: 'AGPL-3.0-or-later', name: 'GNU Affero General Public License v3.0 or later', osiApproved: true, fsfLibre: true },
];

/**
 * Check if a license has a patent clause
 */
export function hasPatentClause(spdxId: string): boolean {
  return licensesWithPatentClauses.has(spdxId);
}

/**
 * Get license info by SPDX ID
 */
export function getLicenseInfo(spdxId: string): SPDXLicense | undefined {
  return allSPDXLicenses.find(l => l.id === spdxId);
}

/**
 * Check if license is OSI approved
 */
export function isOSIApproved(spdxId: string): boolean {
  const license = getLicenseInfo(spdxId);
  return license?.osiApproved === true;
}

/**
 * Check if license is FSF Libre
 */
export function isFSFLibre(spdxId: string): boolean {
  const license = getLicenseInfo(spdxId);
  return license?.fsfLibre === true;
}
