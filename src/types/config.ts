/**
 * package-health-analyzer - Configuration Type Definitions
 *
 * This file defines the complete configuration schema for customizing the behavior of the
 * package-health-analyzer tool. It establishes granular configuration interfaces for each analysis
 * dimension (age, license, scoring, etc.) and a main Config interface that aggregates all settings.
 * These types enable users to fine-tune thresholds, enable/disable features, and customize output behavior.
 *
 * Key responsibilities:
 * - Define configuration interfaces for age analysis (thresholds, deprecation checks, repository validation)
 * - Specify license compliance settings (allow/deny/warn lists, patent clause detection)
 * - Establish health scoring configuration (boosters for different dimensions, minimum score thresholds)
 * - Configure ignore patterns (scopes, prefixes, authors, specific packages)
 * - Define external integrations (GitHub API, caching, notifications, monitoring)
 * - Support advanced features (dependency trees, upgrade paths, NOTICE file generation)
 *
 * @module types/config
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import type { ProjectType } from './index.js';

export interface AgeConfig {
  warn: string;
  critical: string;
  checkDeprecated: boolean;
  checkRepository: boolean;
}

export interface LicenseConfig {
  allow: string[];
  deny: string[];
  warn: string[];
  warnOnUnknown: boolean;
  checkPatentClauses: boolean;
}

export interface ScoringConfig {
  enabled: boolean;
  minimumScore: number;
  boosters: {
    age: number;
    deprecation: number;
    license: number;
    vulnerability: number;
    popularity: number;
    repository: number;
    updateFrequency: number;
  };
}

export interface IgnoreConfig {
  scopes: string[];
  prefixes: string[];
  authors: string[];
  packages: string[];
  reasons?: Record<string, string>;
}

export interface CacheConfig {
  enabled: boolean;
  ttl: number;
}

export interface GitHubSecurityConfig {
  enabled: boolean;
  cacheTtl?: number;
}

export interface GitHubConfig {
  enabled: boolean;
  token?: string;
  security?: GitHubSecurityConfig;
}

export interface NotificationConfig {
  slack?: {
    webhook: string;
  };
  email?: {
    smtp: string;
    to: string;
  };
}

export interface MonitorConfig {
  enabled: boolean;
  notifications?: NotificationConfig;
}

export interface DependencyTreeConfig {
  enabled: boolean;
  maxDepth?: number;
  analyzeTransitive?: boolean;
  detectCircular?: boolean;
  detectDuplicates?: boolean;
  stopOnCircular?: boolean;
  cacheTrees?: boolean;
}

export interface NoticeConfig {
  format?: 'apache' | 'simple';
  includeDevDependencies?: boolean;
  includeTransitive?: boolean;
  includeCopyright?: boolean;
  includeUrls?: boolean;
  groupByLicense?: boolean;
  outputPath?: string;
  customHeader?: string;
}

export interface UpgradePathConfig {
  enabled: boolean;
  analyzeBreakingChanges: boolean;
  suggestAlternatives: boolean;
  fetchChangelogs: boolean;
  estimateEffort: boolean;
}

export interface Config {
  projectType: ProjectType;
  age: AgeConfig;
  license: LicenseConfig;
  scoring: ScoringConfig;
  ignore: IgnoreConfig;
  includeDevDependencies: boolean;
  failOn: 'none' | 'info' | 'warning' | 'critical';
  output: 'cli' | 'json' | 'csv' | 'txt' | 'markdown' | 'json-sbom' | 'sarif';
  cache: CacheConfig;
  github: GitHubConfig;
  monitor: MonitorConfig;
  upgradePath: UpgradePathConfig;
  dependencyTree?: DependencyTreeConfig;
  notice?: NoticeConfig;
}

export type PartialConfig = Partial<Config>;
