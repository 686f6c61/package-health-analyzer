/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { Command } from 'commander';
import { loadConfig } from './config/loader.js';
import { scanDependencies } from './commands/scan.js';
import { checkPackage, formatCheckOutput } from './commands/check.js';
import { initConfig } from './commands/init.js';
import { formatCliOutput } from './reporters/cli.js';
import { formatCsvOutput } from './reporters/csv.js';

const program = new Command();

program
  .name('package-health-analyzer')
  .description(
    'Comprehensive dependency health analyzer combining age detection, license compliance, and security insights'
  )
  .version('1.0.0');

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
  .option('-c, --config <path>', 'Path to configuration file')
  .option('--ignore-scope <scopes...>', 'Ignore packages by scope (e.g., @types/*)')
  .option('--ignore-prefix <prefixes...>', 'Ignore packages by prefix (e.g., eslint-*)')
  .option('--ignore <packages...>', 'Ignore specific packages')
  .action(async (options) => {
    try {
      // Load configuration
      const config = await loadConfig(undefined, options.config);

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

      // Run scan
      const result = await scanDependencies(config);

      // Output results
      if (config.output === 'json') {
        console.log(JSON.stringify(result, null, 2));
      } else if (config.output === 'csv') {
        console.log(formatCsvOutput(result));
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

export { program };
