/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
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

export interface GitHubConfig {
  enabled: boolean;
  token?: string;
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
  output: 'cli' | 'json' | 'csv' | 'txt' | 'md';
  cache: CacheConfig;
  github: GitHubConfig;
  monitor: MonitorConfig;
  upgradePath: UpgradePathConfig;
}

export type PartialConfig = Partial<Config>;
