/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { cosmiconfig } from 'cosmiconfig';
import type { Config } from '../types/config.js';
import { defaultConfig } from './defaults.js';
import { configSchema } from './schema.js';

/**
 * Load configuration from file or defaults
 */
export async function loadConfig(
  searchFrom?: string,
  configPath?: string
): Promise<Config> {
  const explorer = cosmiconfig('packagehealthanalyzer', {
    searchPlaces: [
      'package.json',
      '.packagehealthanalyzerrc',
      '.packagehealthanalyzerrc.json',
      '.packagehealthanalyzerrc.yaml',
      '.packagehealthanalyzerrc.yml',
      '.packagehealthanalyzerrc.js',
      '.packagehealthanalyzerrc.cjs',
      'packagehealthanalyzer.config.js',
      'packagehealthanalyzer.config.cjs',
    ],
  });

  try {
    let result;

    if (configPath) {
      // Load from specific path
      result = await explorer.load(configPath);
    } else {
      // Search for config file
      result = await explorer.search(searchFrom);
    }

    if (result && result.config) {
      // Validate and merge with defaults
      const validated = configSchema.parse(result.config);
      return mergeWithDefaults(validated);
    }

    // No config found, use defaults
    return defaultConfig;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load configuration: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Merge loaded config with defaults
 */
function mergeWithDefaults(loaded: Partial<Config>): Config {
  return {
    projectType: loaded.projectType ?? defaultConfig.projectType,
    age: {
      ...defaultConfig.age,
      ...loaded.age,
    },
    license: {
      ...defaultConfig.license,
      ...loaded.license,
    },
    scoring: {
      ...defaultConfig.scoring,
      ...loaded.scoring,
      boosters: {
        ...defaultConfig.scoring.boosters,
        ...loaded.scoring?.boosters,
      },
    },
    ignore: {
      ...defaultConfig.ignore,
      ...loaded.ignore,
    },
    includeDevDependencies:
      loaded.includeDevDependencies ?? defaultConfig.includeDevDependencies,
    failOn: loaded.failOn ?? defaultConfig.failOn,
    output: loaded.output ?? defaultConfig.output,
    cache: {
      ...defaultConfig.cache,
      ...loaded.cache,
    },
    github: {
      ...defaultConfig.github,
      ...loaded.github,
    },
    monitor: {
      ...defaultConfig.monitor,
      ...loaded.monitor,
    },
    upgradePath: {
      ...defaultConfig.upgradePath,
      ...loaded.upgradePath,
    },
  };
}
