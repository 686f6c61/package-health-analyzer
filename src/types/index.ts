/**
 * package-health-analyzer - Core Type Definitions
 *
 * This file defines the complete type system for package analysis results, metadata, and scoring.
 * It establishes the data structures used throughout the application for representing package health,
 * license compliance, security vulnerabilities, and recommendations. These interfaces ensure type safety
 * across the entire analysis pipeline from data collection to reporting.
 *
 * Key responsibilities:
 * - Define result types for all analysis dimensions (age, license, repository, vulnerability, health scoring)
 * - Establish severity levels, project types, and categorical enumerations used across the tool
 * - Specify the complete structure of scan results including metadata, summaries, and recommendations
 * - Provide type definitions for package metadata, upgrade paths, and alternative suggestions
 * - Enable strong typing for reporter modules and ensure consistent data contracts
 *
 * @module types/index
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

export type Severity = 'ok' | 'info' | 'warning' | 'critical';

export type ProjectType =
  | 'commercial'
  | 'saas'
  | 'open-source'
  | 'personal'
  | 'internal'
  | 'library'
  | 'startup'
  | 'government'
  | 'educational'
  | 'custom';

export type LicenseCategory =
  | 'commercial-friendly'
  | 'commercial-warning'
  | 'commercial-incompatible'
  | 'unknown'
  | 'unlicensed';

export type BlueOakRating = 'gold' | 'silver' | 'bronze' | 'lead' | 'unrated';

export type HealthRating = 'excellent' | 'good' | 'fair' | 'poor';

export interface PackageMetadata {
  name: string;
  version: string;
  license?: string;
  repository?: {
    type?: string;
    url?: string;
  } | string;
  homepage?: string;
  author?: string | { name?: string; email?: string };
  maintainers?: Array<{ name?: string; email?: string } | string>;
  copyright?: string;
  time?: {
    modified?: string;
    created?: string;
    [version: string]: string | undefined;
  };
  deprecated?: string | boolean;
  'dist-tags'?: {
    latest?: string;
    [tag: string]: string | undefined;
  };
  versions?: {
    [version: string]: {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
      [key: string]: any;
    };
  };
}

export interface AgeAnalysis {
  package: string;
  version: string;
  lastPublish: string;
  ageDays: number;
  ageHuman: string;
  deprecated: boolean;
  deprecationMessage?: string;
  severity: Severity;
  hasRepository: boolean;
  repositoryUrl?: string;
}

export interface LicenseAnalysis {
  package: string;
  version: string;
  license: string;
  spdxId?: string;
  category: LicenseCategory;
  blueOakRating: BlueOakRating;
  severity: Severity;
  isDualLicense: boolean;
  hasPatentClause: boolean;
  commercialUse: boolean;
  reason?: string;
}

export interface RepositoryAnalysis {
  package: string;
  version: string;
  url?: string;
  openIssues?: number;
  lastCommit?: string;
  releaseFrequency?: number;
  stars?: number;
  forks?: number;
  isArchived?: boolean;
  severity: Severity;
}

export interface HealthScore {
  overall: number;
  rating: HealthRating;
  dimensions: {
    age: number;
    deprecation: number;
    license: number;
    vulnerability: number;
    popularity: number;
    repository: number;
    updateFrequency: number;
  };
}

export interface UpgradePath {
  package: string;
  currentVersion: string;
  latestVersion: string;
  type: 'patch' | 'minor' | 'major';
  risk: 'low' | 'medium' | 'high';
  breakingChanges: number;
  estimatedEffort: string;
  steps: Array<{
    from: string;
    to: string;
    description: string;
  }>;
  requiredUpdates: Array<{
    package: string;
    currentVersion: string;
    requiredVersion: string;
  }>;
  resources?: {
    migrationGuide?: string;
    changelog?: string;
    changelogContent?: string;
    releases?: Array<{
      version: string;
      notes: string;
      url: string;
    }>;
    codemods?: string[];
  };
  alternatives?: Array<{
    name: string;
    description: string;
    license: string;
    score?: number;
  }>;
}

export interface VulnerabilityAnalysis {
  package: string;
  version: string;
  vulnerabilities: Array<{
    ghsaId: string;
    cveId?: string;
    severity: 'critical' | 'high' | 'moderate' | 'low';
    summary: string;
  }>;
  totalCount: number;
  criticalCount: number;
  highCount: number;
  moderateCount: number;
  lowCount: number;
  severity: Severity;
}

export interface PackageAnalysis {
  package: string;
  version: string;
  age: AgeAnalysis;
  license: LicenseAnalysis;
  repository?: RepositoryAnalysis;
  vulnerability?: VulnerabilityAnalysis;
  score: HealthScore;
  upgradePath?: UpgradePath;
  overallSeverity: Severity;
}

export interface ScanSummary {
  total: number;
  excellent: number;
  good: number;
  fair: number;
  poor: number;
  averageScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  issues: {
    critical: number;
    warning: number;
    info: number;
  };
  severityCounts?: {
    critical: number;
    high: number;
    moderate: number;
    low: number;
  };
}

export interface DependencyTreeSummary {
  totalNodes: number;
  uniquePackages: number;
  maxDepth: number;
  circularDependencies: number;
  duplicatePackages: number;
}

export interface ScanResult {
  meta: {
    version: string;
    timestamp: string;
    projectType: ProjectType;
    scanDuration: number;
  };
  project: {
    name: string;
    version: string;
    path: string;
  };
  summary: ScanSummary;
  packages: PackageAnalysis[];
  recommendations: Array<{
    package: string;
    reason: string;
    alternatives?: string[];
    estimatedEffort?: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  exitCode: number;
  treeSummary?: DependencyTreeSummary;
}

export interface NoticeGenerationResult {
  outputPath: string;
  packageCount: number;
  format: 'apache' | 'simple';
  content: string;
}

export interface DependencyNoticeInfo {
  name: string;
  version: string;
  license: string;
  repository?: string;
  author?: string;
  licenseText?: string;
  copyright?: string;
  homepage?: string;
  maintainers?: string[];
}
