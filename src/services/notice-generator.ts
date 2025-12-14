/**
 * package-health-analyzer - Third-Party Attribution Notice Generator
 *
 * This module generates legally-compliant NOTICE.txt files for third-party dependencies, following Apache Software
 * Foundation and Linux Foundation attribution standards. It fetches actual license texts from package sources
 * (unpkg.com, GitHub raw) rather than using generic templates, which is critical for legal compliance as packages
 * may have customized license texts. The generator supports multiple output formats and grouping strategies.
 *
 * Key responsibilities:
 * - Generate Apache-style or simple-format NOTICE files with comprehensive third-party attribution information
 * - Fetch real license texts from packages via unpkg.com CDN and GitHub raw URLs (master/main branches)
 * - Extract copyright notices from package metadata, authors, and maintainers for proper attribution
 * - Support multiple license file naming conventions (LICENSE, LICENSE.md, LICENSE.txt, LICENCE, COPYING, etc)
 * - Group dependencies by license type when configured for better readability and compliance review
 * - Handle various repository URL formats (git+, ssh://, github:) and clean them for NOTICE inclusion
 * - Implement parallel license text fetching with concurrency control (p-limit) for performance
 * - Include package metadata (version, author, repository, homepage) based on configuration flags
 *
 * @module services/notice-generator
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import pLimit from 'p-limit';
import type {
  PackageMetadata,
  DependencyNoticeInfo,
  NoticeGenerationResult,
} from '../types/index.js';
import type { NoticeConfig } from '../types/config.js';

/**
 * Fetch the REAL license text from a package
 * This is critical for legal compliance - we must use the actual license text
 * from each package, not generic templates, as packages may have modifications
 */
async function fetchRealLicenseText(
  packageName: string,
  version: string,
  repositoryUrl?: string
): Promise<string | null> {
  // Try multiple common LICENSE file names
  const licenseFiles = [
    'LICENSE',
    'LICENSE.md',
    'LICENSE.txt',
    'LICENCE',
    'LICENCE.md',
    'LICENSE-MIT',
    'LICENSE-APACHE',
    'COPYING',
  ];

  // Strategy 1: Try unpkg.com (npm CDN)
  for (const filename of licenseFiles) {
    try {
      const unpkgUrl = `https://unpkg.com/${packageName}@${version}/${filename}`;
      const response = await fetch(unpkgUrl);
      if (response.ok) {
        const text = await response.text();
        // Verify it looks like a license (not an HTML error page)
        if (text.length > 100 && !text.includes('<!DOCTYPE') && !text.includes('<html')) {
          return text.trim();
        }
      }
    } catch {
      // Continue to next strategy
    }
  }

  // Strategy 2: Try GitHub raw if we have a GitHub repo URL
  if (repositoryUrl && repositoryUrl.includes('github.com')) {
    try {
      // Convert github.com URL to raw.githubusercontent.com
      const match = repositoryUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (match && match[1] && match[2]) {
        const [, owner, repo] = match;
        const repoClean = repo.replace(/\.git$/, '');

        for (const filename of licenseFiles) {
          try {
            const rawUrl = `https://raw.githubusercontent.com/${owner}/${repoClean}/master/${filename}`;
            const response = await fetch(rawUrl);
            if (response.ok) {
              const text = await response.text();
              if (text.length > 100 && !text.includes('<!DOCTYPE') && !text.includes('<html')) {
                return text.trim();
              }
            }
          } catch {
            // Try main branch instead of master
            try {
              const rawUrl = `https://raw.githubusercontent.com/${owner}/${repoClean}/main/${filename}`;
              const response = await fetch(rawUrl);
              if (response.ok) {
                const text = await response.text();
                if (text.length > 100 && !text.includes('<!DOCTYPE') && !text.includes('<html')) {
                  return text.trim();
                }
              }
            } catch {
              // Continue
            }
          }
        }
      }
    } catch {
      // Continue to next strategy
    }
  }

  // If all strategies fail, return null
  return null;
}

/**
 * Generate NOTICE.txt content from dependencies
 */
export async function generateNotice(
  dependencies: Map<string, string>,
  projectName: string,
  projectVersion: string,
  config: NoticeConfig,
  metadataFetcher: (name: string) => Promise<PackageMetadata>
): Promise<NoticeGenerationResult> {
  const dependencyInfos: DependencyNoticeInfo[] = [];

  // Fetch metadata for all dependencies in parallel (limit concurrency to 10)
  const limit = pLimit(10);
  const fetchPromises = Array.from(dependencies.entries()).map(([name, version]) =>
    limit(async () => {
      try {
        const metadata = await metadataFetcher(name);
        const info = extractDependencyInfo(metadata, config);

        // CRITICAL: Fetch the REAL license text from the package
        // This is legally required - we cannot use generic templates
        const licenseText = await fetchRealLicenseText(
          name,
          version,
          info.repository
        );

        if (licenseText) {
          info.licenseText = licenseText;
        }

        return info;
      } catch {
        // If we can't fetch metadata, include basic info
        return {
          name,
          version,
          license: 'Unknown',
        } as DependencyNoticeInfo;
      }
    })
  );

  const results = await Promise.all(fetchPromises);
  dependencyInfos.push(...results);

  // Sort dependencies by name
  dependencyInfos.sort((a, b) => a.name.localeCompare(b.name));

  // Generate content based on format
  const content =
    config.format === 'apache'
      ? formatApacheStyle(projectName, projectVersion, dependencyInfos, config)
      : formatSimpleStyle(projectName, projectVersion, dependencyInfos, config);

  // Group by license if enabled
  const licenseGroups = new Map<string, string[]>();
  if (config.groupByLicense) {
    for (const dep of dependencyInfos) {
      const license = dep.license || 'Unknown';
      if (!licenseGroups.has(license)) {
        licenseGroups.set(license, []);
      }
      licenseGroups.get(license)!.push(dep.name);
    }
  }

  const result: NoticeGenerationResult = {
    content,
    packageCount: dependencyInfos.length,
    format: config.format,
    outputPath: config.outputPath,
  } as any;

  return result;
}

/**
 * Extract dependency information from package metadata
 */
function extractDependencyInfo(
  metadata: PackageMetadata,
  config: NoticeConfig
): DependencyNoticeInfo {
  const info: DependencyNoticeInfo = {
    name: metadata.name,
    version: metadata.version,
    license: metadata.license || 'Unknown',
  };

  // Extract copyright - prioritize existing copyright, then author, then generate generic
  if (config.includeCopyright) {
    if (metadata.copyright) {
      // Preserve existing copyright notice
      info.copyright = metadata.copyright;
    } else if (metadata.author) {
      // Generate from author
      info.copyright = extractCopyrightInfo(metadata.author);
      info.author = extractAuthorName(metadata.author);
    } else {
      // Generate generic copyright
      const currentYear = new Date().getFullYear();
      info.copyright = `Copyright ${currentYear} ${metadata.name} contributors`;
    }
  }

  // Extract repository URL - handle both string and object formats
  if (config.includeUrls) {
    if (typeof metadata.repository === 'string') {
      info.repository = cleanRepositoryUrl(metadata.repository);
    } else if (metadata.repository?.url) {
      info.repository = cleanRepositoryUrl(metadata.repository.url);
    }
  }

  // Extract homepage
  if (config.includeUrls && metadata.homepage) {
    info.homepage = metadata.homepage;
  }

  // Extract maintainers
  if (metadata.maintainers && metadata.maintainers.length > 0) {
    info.maintainers = metadata.maintainers
      .map((m) => (typeof m === 'string' ? m : m.name || ''))
      .filter(Boolean);
  }

  return info;
}

/**
 * Extract copyright information from author field
 */
function extractCopyrightInfo(author: string | { name?: string; email?: string }): string {
  const authorName = typeof author === 'string' ? author : author.name || '';

  // If already has copyright, return as is
  if (authorName.toLowerCase().includes('copyright')) {
    return authorName;
  }

  // Extract just the name (remove email)
  const cleanName = authorName.replace(/<[^>]+>/, '').trim();

  if (!cleanName) {
    return '';
  }

  // Add copyright notice (Apache style without (c))
  const currentYear = new Date().getFullYear();
  return `Copyright ${currentYear} ${cleanName}`;
}

/**
 * Extract author name from author field
 */
function extractAuthorName(author: string | { name?: string; email?: string }): string {
  if (typeof author === 'string') {
    // Remove email if present
    return author.replace(/<[^>]+>/, '').trim();
  }
  return author.name || '';
}

/**
 * Clean repository URL (remove git+ prefix, .git suffix, etc.)
 */
export function cleanRepositoryUrl(url: string): string {
  return url
    .replace(/^git\+/, '')
    .replace(/^git:/, 'https:')
    .replace(/^ssh:\/\/git@/, 'https://')
    .replace(/^git@github\.com:/, 'https://github.com/')
    .replace(/\.git$/, '')
    .replace(/^github:/, 'https://github.com/');
}

/**
 * Format NOTICE in Apache style
 */
function formatApacheStyle(
  projectName: string,
  _projectVersion: string,
  dependencies: DependencyNoticeInfo[],
  config: NoticeConfig
): string {
  const lines: string[] = [];

  // Custom header or default Apache-style header
  if (config.customHeader) {
    lines.push(config.customHeader);
  } else {
    lines.push(`${projectName}`);
    lines.push(`Copyright ${new Date().getFullYear()}`);
    lines.push('');
    lines.push('This product is modeled after the Apache Software Foundation');
  }

  lines.push('');
  lines.push('This product includes the following third-party software:');
  lines.push('');
  lines.push('='.repeat(80));
  lines.push('');

  if (config.groupByLicense) {
    // Group by license
    const byLicense = new Map<string, DependencyNoticeInfo[]>();

    for (const dep of dependencies) {
      const license = dep.license || 'Unknown';
      if (!byLicense.has(license)) {
        byLicense.set(license, []);
      }
      byLicense.get(license)!.push(dep);
    }

    // Sort by license name
    const licenses = Array.from(byLicense.keys()).sort();

    for (const license of licenses) {
      const deps = byLicense.get(license)!;

      lines.push(`## ${license}`);
      lines.push('');

      for (const dep of deps) {
        lines.push(...formatDependencyApache(dep, config));
        lines.push('');
      }
    }
  } else {
    // List all dependencies
    for (const dep of dependencies) {
      lines.push(...formatDependencyApache(dep, config));
      lines.push('');
    }
  }

  lines.push('='.repeat(80));
  lines.push('');
  lines.push(`Generated on: ${new Date().toISOString()}`);
  lines.push(`Total dependencies: ${dependencies.length}`);
  lines.push('');

  return lines.join('\n');
}

/**
 * Format a single dependency in Apache style
 */
function formatDependencyApache(
  dep: DependencyNoticeInfo,
  config: NoticeConfig
): string[] {
  const lines: string[] = [];

  lines.push(`Package: ${dep.name}`);
  lines.push(`Version: ${dep.version}`);
  lines.push(`License: ${dep.license}`);

  if (config.includeCopyright && dep.copyright) {
    lines.push(`Copyright: ${dep.copyright}`);
  }

  if (config.includeUrls && dep.repository) {
    lines.push(`Repository: ${dep.repository}`);
  } else if (config.includeUrls && dep.homepage) {
    lines.push(`Homepage: ${dep.homepage}`);
  }

  // CRITICAL: Include the REAL license text from the package
  // This is legally required for proper attribution
  if (dep.licenseText) {
    lines.push('');
    lines.push('License Text:');
    lines.push('');
    lines.push(dep.licenseText);
  } else {
    lines.push('');
    lines.push('[License text not available - please review package manually]');
  }

  return lines;
}

/**
 * Format NOTICE in simple style
 */
function formatSimpleStyle(
  projectName: string,
  projectVersion: string,
  dependencies: DependencyNoticeInfo[],
  config: NoticeConfig
): string {
  const lines: string[] = [];

  // Header
  if (config.customHeader) {
    lines.push(config.customHeader);
  } else {
    lines.push(`Third-Party Notices for ${projectName} (${projectVersion})`);
    lines.push(`Generated: ${new Date().toISOString()}`);
  }

  lines.push('');
  lines.push(`This software includes ${dependencies.length} third-party packages:`);
  lines.push('');

  // List dependencies
  for (const dep of dependencies) {
    lines.push('-'.repeat(80));
    lines.push('');
    lines.push(`Package: ${dep.name}@${dep.version}`);
    lines.push(`License: ${dep.license}`);

    if (config.includeCopyright && dep.author) {
      lines.push(`Author: ${dep.author}`);
    }

    if (config.includeUrls && dep.repository) {
      lines.push(`Repository: ${dep.repository}`);
    }

    // CRITICAL: Include the REAL license text from the package
    if (dep.licenseText) {
      lines.push('');
      lines.push('License Text:');
      lines.push('');
      // Indent the license text for readability
      const indentedText = dep.licenseText
        .split('\n')
        .map(line => `  ${line}`)
        .join('\n');
      lines.push(indentedText);
    } else {
      lines.push('');
      lines.push('[License text not available - please review package manually]');
    }

    lines.push('');
  }

  return lines.join('\n');
}
