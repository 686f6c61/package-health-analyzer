/**
 * package-health-analyzer - CLI Command Interface
 *
 * This file defines the complete command-line interface for the package-health-analyzer tool
 * using Commander.js. It orchestrates all available commands (scan, check, init, generate-notice),
 * handles command-line flag parsing, configuration merging, and output format routing to various
 * reporters (CLI, JSON, CSV, TXT, Markdown, SPDX SBOM).
 *
 * Key responsibilities:
 * - Define all CLI commands and their options using Commander.js framework
 * - Parse and validate command-line flags, merging them with file-based configuration
 * - Route execution to appropriate command handlers (scan, check, init, generate-notice)
 * - Manage output format selection and delegate to specialized reporters
 * - Handle error scenarios and determine appropriate exit codes
 * - Configure GitHub token integration from environment variables
 *
 * @module cli
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { Command } from 'commander';
import { loadConfig } from './config/loader.js';
import { scanDependencies } from './commands/scan.js';
import { checkPackage, formatCheckOutput } from './commands/check.js';
import { initConfig } from './commands/init.js';
import { generateNoticeFile } from './commands/generate-notice.js';
import { formatCliOutput } from './reporters/cli.js';
import { formatCsvOutput } from './reporters/csv.js';
import { formatTxtOutput } from './reporters/txt.js';
import { formatMarkdownOutput } from './reporters/markdown.js';
import { formatSarif } from './formatters/sarif.js';

const program = new Command();

program
  .name('package-health-analyzer')
  .description(
    'Comprehensive dependency health analyzer combining age detection, license compliance, and security insights'
  )
  .version('2.0.0');

// Main scan command
program
  .command('scan', { isDefault: true })
  .description('Scan dependencies in the current project')
  .option('-d, --include-dev', 'Include devDependencies', false)
  .option(
    '--project-type <type>',
    'Project type (commercial, saas, open-source)',
    'commercial'
  )
  .option('--age-warn <threshold>', 'Age warning threshold (e.g., 2y)')
  .option('--age-critical <threshold>', 'Age critical threshold (e.g., 5y)')
  .option(
    '--fail-on <level>',
    'Fail on severity level (none, info, warning, critical)'
  )
  .option('--json', 'Output in JSON format', false)
  .option('--csv', 'Output in CSV format', false)
  .option('--txt', 'Output in plain text format', false)
  .option('--markdown', 'Output in Markdown format', false)
  .option('--json-sbom', 'Output SPDX SBOM in JSON format', false)
  .option('--sarif', 'Output in SARIF v2.1.0 format', false)
  .option('--no-transitive', 'Skip transitive dependency analysis', false)
  .option('-c, --config <path>', 'Path to configuration file')
  .option('--ignore-scope <scopes...>', 'Ignore packages by scope (e.g., @types/*)')
  .option('--ignore-prefix <prefixes...>', 'Ignore packages by prefix (e.g., eslint-*)')
  .option('--ignore <packages...>', 'Ignore specific packages')
  .action(async (options) => {
    try {
      // Load configuration
      const config = await loadConfig(undefined, options.config);

      // Check for GitHub token in environment
      const githubToken = process.env.GITHUB_TOKEN;
      if (githubToken) {
        config.github.enabled = true;
        config.github.token = githubToken;
        // Ensure security settings are initialized
        if (!config.github.security) {
          config.github.security = {
            enabled: true,
            cacheTtl: 86400,
          };
        }
      }

      // Override with CLI options
      if (options.projectType) {
        config.projectType = options.projectType as any;
      }
      if (options.includeDev !== undefined) {
        config.includeDevDependencies = options.includeDev;
      }
      if (options.failOn) {
        config.failOn = options.failOn as any;
      }
      if (options.ageWarn) {
        config.age.warn = options.ageWarn;
      }
      if (options.ageCritical) {
        config.age.critical = options.ageCritical;
      }
      if (options.ignoreScope) {
        config.ignore.scopes = options.ignoreScope;
      }
      if (options.ignorePrefix) {
        config.ignore.prefixes = options.ignorePrefix;
      }
      if (options.ignore) {
        config.ignore.packages = options.ignore;
      }
      if (options.json) {
        config.output = 'json';
      }
      if (options.csv) {
        config.output = 'csv';
      }
      if (options.txt) {
        config.output = 'txt';
      }
      if (options.markdown) {
        config.output = 'markdown';
      }
      if (options.jsonSbom) {
        config.output = 'json-sbom';
      }
      if (options.sarif) {
        config.output = 'sarif';
      }
      if (options.noTransitive !== undefined) {
        if (!config.dependencyTree) {
          config.dependencyTree = { enabled: true };
        }
        config.dependencyTree.enabled = !options.noTransitive;
      }

      // Run scan
      const result = await scanDependencies(config);

      // Output results
      if (config.output === 'json-sbom') {
        const { formatSPDX } = await import('./formatters/spdx-formatter.js');
        console.log(JSON.stringify(formatSPDX(result), null, 2));
      } else if (config.output === 'sarif') {
        console.log(formatSarif(result));
      } else if (config.output === 'json') {
        console.log(JSON.stringify(result, null, 2));
      } else if (config.output === 'csv') {
        console.log(formatCsvOutput(result));
      } else if (config.output === 'txt') {
        console.log(formatTxtOutput(result));
      } else if (config.output === 'markdown') {
        console.log(formatMarkdownOutput(result));
      } else {
        console.log(formatCliOutput(result));
      }

      // Exit with appropriate code
      process.exit(result.exitCode);
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : String(error));
      process.exit(3);
    }
  });

// Check command for single package
program
  .command('check <package>')
  .description('Check health of a specific package')
  .option('--project-type <type>', 'Project type (commercial, saas, open-source)')
  .option('-c, --config <path>', 'Path to configuration file')
  .option('--json', 'Output in JSON format', false)
  .action(async (packageName, options) => {
    try {
      // Load configuration
      const config = await loadConfig(undefined, options.config);

      // Override with CLI options
      if (options.projectType) {
        config.projectType = options.projectType as any;
      }

      // Check package
      const analysis = await checkPackage(packageName, config);

      // Output results
      if (options.json) {
        console.log(JSON.stringify(analysis, null, 2));
      } else {
        console.log(formatCheckOutput(analysis));
      }

      // Exit with appropriate code
      process.exit(analysis.overallSeverity === 'critical' ? 2 : 0);
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : String(error));
      process.exit(3);
    }
  });

// Init command for configuration
program
  .command('init')
  .description('Create a .packagehealthanalyzerrc.json configuration file')
  .action(async () => {
    try {
      await initConfig();
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : String(error));
      process.exit(3);
    }
  });

// Generate NOTICE.txt command
program
  .command('generate-notice')
  .description('Generate NOTICE.txt file for legal compliance')
  .option('--format <format>', 'Output format: apache, simple', 'apache')
  .option('--output <path>', 'Output file path', 'NOTICE.txt')
  .option('--group-by-license', 'Group packages by license', false)
  .option('--include-dev', 'Include devDependencies', false)
  .option('--include-transitive', 'Include transitive dependencies', true)
  .option('-c, --config <path>', 'Path to configuration file')
  .action(async (options) => {
    try {
      const config = await loadConfig(undefined, options.config);

      const result = await generateNoticeFile(config, {
        format: options.format,
        output: options.output,
        groupByLicense: options.groupByLicense,
        includeDev: options.includeDev,
        includeTransitive: options.includeTransitive,
      });

      console.log(`✓ NOTICE.txt generated successfully!`);
      console.log(`  File: ${result.outputPath}`);
      console.log(`  Packages: ${result.packageCount}`);
      console.log(`  Format: ${options.format}`);

      process.exit(0);
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : String(error));
      process.exit(3);
    }
  });

export { program };
