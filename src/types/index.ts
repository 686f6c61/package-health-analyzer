/**
 * package-health-analyzer - Comprehensive dependency health analyzer
 *
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
  };
  homepage?: string;
  author?: string | { name?: string; email?: string };
  maintainers?: Array<{ name?: string; email?: string }>;
  time?: {
    modified?: string;
    created?: string;
    [version: string]: string | undefined;
  };
  deprecated?: string | boolean;
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
    codemods?: string[];
  };
  alternatives?: Array<{
    name: string;
    description: string;
    license: string;
    score?: number;
  }>;
}

export interface PackageAnalysis {
  package: string;
  version: string;
  age: AgeAnalysis;
  license: LicenseAnalysis;
  repository?: RepositoryAnalysis;
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
}
