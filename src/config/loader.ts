/**
 * package-health-analyzer - Configuration Loader
 *
 * Discovers, loads, and validates user configuration from multiple file formats and locations using the cosmiconfig
 * library. This module implements a cascading configuration strategy that searches for config files in standard locations
 * (package.json, .packagehealthanalyzerrc, etc.), validates the loaded configuration against a Zod schema for type safety,
 * and intelligently merges user settings with defaults. It provides a robust configuration system that handles missing
 * files gracefully, supports multiple config formats (JSON, YAML, JS), and ensures all configuration is validated before
 * use to prevent runtime errors.
 *
 * Key responsibilities:
 * - Search for configuration files in standard locations using cosmiconfig
 * - Support multiple config formats: package.json, JSON, YAML, JavaScript (CJS)
 * - Load configuration from explicit paths or auto-discover in project directory
 * - Validate loaded configuration against schema for type safety and error prevention
 * - Merge user configuration with defaults using deep merge strategy
 * - Provide detailed error messages when configuration is invalid or malformed
 * - Fallback to defaults when no configuration file is found
 *
 * @module config/loader
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import { cosmiconfig } from 'cosmiconfig';
import type { Config } from '../types/config.js';
import { defaultConfig, getProjectTypeDefaults } from './defaults.js';
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
 * Uses project-type-specific defaults when available
 */
function mergeWithDefaults(loaded: Partial<Config>): Config {
  // Determine project type
  const projectType = loaded.projectType ?? defaultConfig.projectType;

  // Get project-type-specific defaults
  const projectTypeDefaults = getProjectTypeDefaults(projectType);

  // Merge: defaultConfig <- projectTypeDefaults <- loaded
  return {
    projectType,
    age: {
      ...defaultConfig.age,
      ...projectTypeDefaults.age,
      ...loaded.age,
    },
    license: {
      ...defaultConfig.license,
      ...projectTypeDefaults.license,
      ...loaded.license,
    },
    scoring: {
      ...defaultConfig.scoring,
      ...projectTypeDefaults.scoring,
      ...loaded.scoring,
      boosters: {
        ...defaultConfig.scoring.boosters,
        ...projectTypeDefaults.scoring?.boosters,
        ...loaded.scoring?.boosters,
      },
    },
    ignore: {
      ...defaultConfig.ignore,
      ...projectTypeDefaults.ignore,
      ...loaded.ignore,
    },
    includeDevDependencies:
      loaded.includeDevDependencies ??
      projectTypeDefaults.includeDevDependencies ??
      defaultConfig.includeDevDependencies,
    failOn:
      loaded.failOn ??
      projectTypeDefaults.failOn ??
      defaultConfig.failOn,
    output:
      loaded.output ??
      projectTypeDefaults.output ??
      defaultConfig.output,
    cache: {
      ...defaultConfig.cache,
      ...projectTypeDefaults.cache,
      ...loaded.cache,
    },
    github: {
      enabled: loaded.github?.enabled ?? projectTypeDefaults.github?.enabled ?? defaultConfig.github.enabled,
      token: loaded.github?.token ?? projectTypeDefaults.github?.token ?? defaultConfig.github.token,
      security: {
        enabled: loaded.github?.security?.enabled ?? projectTypeDefaults.github?.security?.enabled ?? defaultConfig.github.security?.enabled ?? false,
        cacheTtl: loaded.github?.security?.cacheTtl ?? projectTypeDefaults.github?.security?.cacheTtl ?? defaultConfig.github.security?.cacheTtl,
      },
    },
    monitor: {
      ...defaultConfig.monitor,
      ...projectTypeDefaults.monitor,
      ...loaded.monitor,
    },
    upgradePath: {
      ...defaultConfig.upgradePath,
      ...projectTypeDefaults.upgradePath,
      ...loaded.upgradePath,
    },
    dependencyTree: {
      enabled: loaded.dependencyTree?.enabled ?? projectTypeDefaults.dependencyTree?.enabled ?? defaultConfig.dependencyTree?.enabled ?? true,
      maxDepth: loaded.dependencyTree?.maxDepth ?? projectTypeDefaults.dependencyTree?.maxDepth ?? defaultConfig.dependencyTree?.maxDepth ?? 10,
      analyzeTransitive: loaded.dependencyTree?.analyzeTransitive ?? projectTypeDefaults.dependencyTree?.analyzeTransitive ?? defaultConfig.dependencyTree?.analyzeTransitive ?? true,
      detectCircular: loaded.dependencyTree?.detectCircular ?? projectTypeDefaults.dependencyTree?.detectCircular ?? defaultConfig.dependencyTree?.detectCircular ?? true,
      detectDuplicates: loaded.dependencyTree?.detectDuplicates ?? projectTypeDefaults.dependencyTree?.detectDuplicates ?? defaultConfig.dependencyTree?.detectDuplicates ?? true,
      stopOnCircular: loaded.dependencyTree?.stopOnCircular ?? projectTypeDefaults.dependencyTree?.stopOnCircular ?? defaultConfig.dependencyTree?.stopOnCircular ?? false,
      cacheTrees: loaded.dependencyTree?.cacheTrees ?? projectTypeDefaults.dependencyTree?.cacheTrees ?? defaultConfig.dependencyTree?.cacheTrees ?? true,
    },
    notice: {
      ...defaultConfig.notice,
      ...projectTypeDefaults.notice,
      ...loaded.notice,
    },
  };
}
