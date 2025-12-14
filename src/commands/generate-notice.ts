/**
 * package-health-analyzer - NOTICE File Generation Command
 *
 * This module implements automated generation of NOTICE.txt files for compliance with
 * open source license requirements. It collects dependency metadata and formats attribution
 * notices in Apache or simple formats, supporting both direct and transitive dependencies
 * to ensure complete license compliance documentation.
 *
 * Key responsibilities:
 * - Generate legally-compliant NOTICE.txt files with proper attribution for all dependencies
 * - Support multiple output formats (Apache-style and simple) based on project requirements
 * - Collect and deduplicate dependency information from direct and transitive dependency trees
 * - Group dependencies by license type for better readability and compliance review
 * - Integrate with dependency tree builder for comprehensive transitive dependency analysis
 * - Handle CLI option overrides for format, output path, and inclusion settings
 *
 * @module commands/generate-notice
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import type { Config } from '../types/config.js';
import type { NoticeGenerationResult } from '../types/index.js';
import { readPackageJson, getAllDependencies } from '../services/package-reader.js';
import { fetchPackageMetadata } from '../services/npm-registry.js';
import { generateNotice } from '../services/notice-generator.js';
import {
  DependencyTreeBuilder,
  collectUniquePackages,
} from '../services/dependency-tree.js';

export interface GenerateNoticeOptions {
  output?: string;
  format?: 'apache' | 'simple';
  groupByLicense?: boolean;
  includeDev?: boolean;
  includeTransitive?: boolean;
}

/**
 * Generate NOTICE.txt file for third-party dependencies
 */
export async function generateNoticeFile(
  config: Config,
  options: GenerateNoticeOptions = {},
  directory?: string
): Promise<NoticeGenerationResult> {
  // Read package.json
  const pkg = await readPackageJson(directory);

  // Define defaults for notice configuration
  const noticeDefaults = {
    format: 'apache' as const,
    outputPath: 'NOTICE.txt',
    groupByLicense: false,
    includeDevDependencies: false,
    includeTransitive: true,
    includeCopyright: true,
    includeUrls: true,
  };

  // Override config with CLI options, falling back to defaults
  const noticeConfig = {
    format: options.format || config.notice?.format || noticeDefaults.format,
    outputPath: options.output || config.notice?.outputPath || noticeDefaults.outputPath,
    groupByLicense: options.groupByLicense ?? config.notice?.groupByLicense ?? noticeDefaults.groupByLicense,
    includeDevDependencies: options.includeDev ?? config.notice?.includeDevDependencies ?? noticeDefaults.includeDevDependencies,
    includeTransitive: options.includeTransitive ?? config.notice?.includeTransitive ?? noticeDefaults.includeTransitive,
    includeCopyright: config.notice?.includeCopyright ?? noticeDefaults.includeCopyright,
    includeUrls: config.notice?.includeUrls ?? noticeDefaults.includeUrls,
    customHeader: config.notice?.customHeader,
  };

  // Get dependencies
  let dependenciesToInclude: Map<string, string>;

  if (noticeConfig.includeTransitive && config.dependencyTree?.enabled) {
    // Build dependency tree to get all transitive dependencies
    console.log('Building dependency tree for NOTICE.txt...');

    const directDeps = getAllDependencies(pkg, noticeConfig.includeDevDependencies);
    const treeBuilder = new DependencyTreeBuilder(config.dependencyTree);

    const tree = await treeBuilder.buildTree(pkg.name, pkg.version, directDeps);
    dependenciesToInclude = collectUniquePackages(tree);

    console.log(
      `Found ${dependenciesToInclude.size} dependencies (including ${tree.totalNodes} total with duplicates)`
    );
  } else {
    // Only direct dependencies
    dependenciesToInclude = getAllDependencies(pkg, noticeConfig.includeDevDependencies);
  }

  // Generate NOTICE content
  const result = await generateNotice(
    dependenciesToInclude,
    pkg.name,
    pkg.version,
    noticeConfig,
    fetchPackageMetadata
  );

  // Write to file
  const outputPath = resolve(directory || process.cwd(), result.outputPath);

  // Ensure parent directory exists
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, result.content, 'utf-8');

  console.log('');
  console.log(`✓ NOTICE.txt generated successfully!`);
  console.log(`  Format: ${result.format}`);
  console.log(`  Dependencies: ${result.packageCount}`);
  console.log(`  Output: ${outputPath}`);
  console.log('');

  return result;
}
