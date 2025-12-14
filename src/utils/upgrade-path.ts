/**
 * package-health-analyzer - Upgrade Path Analysis Engine
 *
 * Generates intelligent, actionable upgrade strategies for outdated dependencies by analyzing semantic versioning,
 * estimating migration effort, and providing step-by-step guidance. This module transforms raw version comparisons
 * into practical migration plans with risk assessment, breaking change estimation, and curated resources. It recognizes
 * that major version upgrades often require incremental steps and provides graduated migration paths to minimize risk,
 * along with package alternatives for deprecated or problematic dependencies.
 *
 * Key responsibilities:
 * - Analyze version differences and determine update complexity (patch/minor/major)
 * - Estimate breaking changes and migration effort based on semver jumps
 * - Generate multi-step upgrade paths for complex major version migrations
 * - Provide migration resources including guides, changelogs, and available codemods
 * - Suggest modern alternatives for deprecated packages (moment→dayjs, request→axios)
 * - Calculate risk levels and time estimates for upgrade planning
 *
 * @module utils/upgrade-path
 * @author 686f6c61 <https://github.com/686f6c61>
 * @repository https://github.com/686f6c61/package-health-analyzer
 * @license MIT
 */

import semver from 'semver';
import type { UpgradePath } from '../types/index.js';
import type { UpgradePathConfig } from '../types/config.js';
import {
  getUpdateType,
  estimateBreakingChanges,
} from './semver.js';
import {
  extractGitHubInfo,
  fetchGitHubReleases,
  fetchChangelogFile,
} from '../services/github-api.js';
import { fetchPackageMetadata } from '../services/npm-registry.js';

/**
 * Known package alternatives
 */
const PACKAGE_ALTERNATIVES: Record<
  string,
  Array<{ name: string; description: string; license: string }>
> = {
  moment: [
    {
      name: 'dayjs',
      description: '2KB, API similar a Moment.js, árbol sacudible',
      license: 'MIT',
    },
    {
      name: 'date-fns',
      description: 'Modular, funcional, inmutable',
      license: 'MIT',
    },
    {
      name: 'luxon',
      description: 'Del creador de Moment.js, moderno',
      license: 'MIT',
    },
  ],
  request: [
    {
      name: 'axios',
      description: 'Cliente HTTP basado en promesas, ampliamente usado',
      license: 'MIT',
    },
    {
      name: 'got',
      description: 'Cliente HTTP ligero y moderno',
      license: 'MIT',
    },
    {
      name: 'node-fetch',
      description: 'Implementación de fetch para Node.js',
      license: 'MIT',
    },
  ],
  'node-sass': [
    {
      name: 'sass',
      description: 'Dart Sass puro, no requiere compilación nativa',
      license: 'MIT',
    },
  ],
  lodash: [
    {
      name: 'lodash-es',
      description: 'Versión ESM de Lodash, árbol sacudible',
      license: 'MIT',
    },
    {
      name: 'ramda',
      description: 'Librería funcional, datos inmutables',
      license: 'MIT',
    },
  ],
};

/**
 * Known migration guides
 */
const MIGRATION_GUIDES: Record<string, Record<string, string>> = {
  webpack: {
    '4-to-5': 'https://webpack.js.org/migrate/5/',
  },
  react: {
    '16-to-17': 'https://react.dev/blog/2020/10/20/react-v17',
    '17-to-18': 'https://react.dev/blog/2022/03/08/react-18-upgrade-guide',
  },
  vue: {
    '2-to-3': 'https://v3-migration.vuejs.org/',
  },
  angular: {
    'update-guide': 'https://update.angular.io/',
  },
};

/**
 * Analyze upgrade path for a package
 */
export async function analyzeUpgradePath(
  packageName: string,
  currentVersion: string,
  latestVersion: string,
  config: UpgradePathConfig
): Promise<UpgradePath> {
  const updateType = getUpdateType(currentVersion, latestVersion);

  if (!updateType) {
    return createNoUpdatePath(packageName, currentVersion, latestVersion);
  }

  // Determine risk level
  const risk =
    updateType === 'major'
      ? 'high'
      : updateType === 'minor'
        ? 'medium'
        : 'low';

  // Estimate breaking changes
  const breakingChanges = config.analyzeBreakingChanges
    ? estimateBreakingChanges(currentVersion, latestVersion)
    : 0;

  // Estimate effort
  const estimatedEffort = estimateEffort(updateType, breakingChanges);

  // Build upgrade steps
  const steps = buildUpgradeSteps(
    packageName,
    currentVersion,
    latestVersion,
    updateType
  );

  // Get migration resources
  const resources = config.fetchChangelogs
    ? await getMigrationResources(packageName, currentVersion, latestVersion)
    : undefined;

  // Get alternatives
  const alternatives = config.suggestAlternatives
    ? PACKAGE_ALTERNATIVES[packageName]
    : undefined;

  return {
    package: packageName,
    currentVersion,
    latestVersion,
    type: updateType,
    risk,
    breakingChanges,
    estimatedEffort,
    steps,
    requiredUpdates: [], // TODO: Analyze peer dependencies
    resources,
    alternatives,
  };
}

/**
 * Create upgrade path for packages that are up to date
 */
function createNoUpdatePath(
  packageName: string,
  currentVersion: string,
  latestVersion: string
): UpgradePath {
  return {
    package: packageName,
    currentVersion,
    latestVersion,
    type: 'patch',
    risk: 'low',
    breakingChanges: 0,
    estimatedEffort: 'Up to date',
    steps: [],
    requiredUpdates: [],
  };
}

/**
 * Estimate effort required for upgrade
 */
function estimateEffort(
  updateType: 'patch' | 'minor' | 'major',
  breakingChanges: number
): string {
  if (updateType === 'patch') {
    return '5-15 minutos';
  }

  if (updateType === 'minor') {
    return '15-30 minutos';
  }

  // Major version
  if (breakingChanges === 0) {
    return '30 minutos - 1 hora';
  }

  if (breakingChanges < 10) {
    return '1-4 horas';
  }

  if (breakingChanges < 30) {
    return '4-8 horas';
  }

  return '1-2 días';
}

/**
 * Build upgrade steps
 */
function buildUpgradeSteps(
  _packageName: string,
  currentVersion: string,
  latestVersion: string,
  updateType: 'patch' | 'minor' | 'major'
): Array<{ from: string; to: string; description: string }> {
  const currentMajor = semver.major(currentVersion);
  const latestMajor = semver.major(latestVersion);

  if (updateType === 'patch' || updateType === 'minor') {
    return [
      {
        from: currentVersion,
        to: latestVersion,
        description: `Actualización directa ${updateType === 'patch' ? 'de parche' : 'menor'}`,
      },
    ];
  }

  // Major version upgrade - suggest incremental path if jumping multiple versions
  if (latestMajor - currentMajor > 1) {
    const steps: Array<{ from: string; to: string; description: string }> = [];

    // Step 1: Update to last version of current major
    steps.push({
      from: currentVersion,
      to: `${currentMajor}.x.x`,
      description: `Actualizar a última versión de v${currentMajor} (correcciones de seguridad)`,
    });

    // Step 2: Prepare for migration
    steps.push({
      from: `${currentMajor}.x.x`,
      to: `${currentMajor}.x.x`,
      description: 'Revisar guía de migración y actualizar código deprecated',
    });

    // Step 3: Update to next major
    steps.push({
      from: `${currentMajor}.x.x`,
      to: `${currentMajor + 1}.0.0`,
      description: `Migrar a v${currentMajor + 1}.0.0`,
    });

    // Step 4: Update incrementally to latest
    if (latestMajor - currentMajor > 2) {
      steps.push({
        from: `${currentMajor + 1}.0.0`,
        to: latestVersion,
        description: 'Continuar actualizaciones incrementales hasta la última versión',
      });
    } else {
      steps.push({
        from: `${currentMajor + 1}.0.0`,
        to: latestVersion,
        description: `Actualizar a v${latestMajor} (última versión)`,
      });
    }

    return steps;
  }

  // Single major version jump
  return [
    {
      from: currentVersion,
      to: latestVersion,
      description: `Actualización mayor de v${currentMajor} a v${latestMajor}`,
    },
  ];
}

/**
 * Get migration resources for a package
 */
async function getMigrationResources(
  packageName: string,
  currentVersion: string,
  latestVersion: string
): Promise<{
  migrationGuide?: string;
  changelog?: string;
  changelogContent?: string;
  releases?: Array<{ version: string; notes: string; url: string }>;
  codemods?: string[];
}> {
  const resources: {
    migrationGuide?: string;
    changelog?: string;
    changelogContent?: string;
    releases?: Array<{ version: string; notes: string; url: string }>;
    codemods?: string[];
  } = {};

  // Check for known migration guides
  const guides = MIGRATION_GUIDES[packageName];
  if (guides) {
    const currentMajor = semver.major(currentVersion);
    const latestMajor = semver.major(latestVersion);
    const key = `${currentMajor}-to-${latestMajor}`;

    if (guides[key]) {
      resources.migrationGuide = guides[key];
    } else if (guides['update-guide']) {
      resources.migrationGuide = guides['update-guide'];
    }
  }

  // Try to fetch actual changelog content from GitHub
  try {
    const metadata = await fetchPackageMetadata(packageName);
    const repoUrl = typeof metadata.repository === 'string'
      ? metadata.repository
      : metadata.repository?.url;

    if (repoUrl && typeof repoUrl === 'string') {
      const githubInfo = extractGitHubInfo(repoUrl);

      if (githubInfo) {
        // Set changelog URL
        resources.changelog = `https://github.com/${githubInfo.owner}/${githubInfo.repo}/releases`;

        // Try to fetch releases from GitHub API
        try {
          const releases = await fetchGitHubReleases(
            githubInfo.owner,
            githubInfo.repo,
            process.env.GITHUB_TOKEN,
            10 // Fetch last 10 releases
          );

          if (releases.length > 0) {
            // Filter releases between current and latest version
            const relevantReleases = releases
              .filter((release) => {
                const version = release.tag_name.replace(/^v/, '');
                return (
                  semver.valid(version) &&
                  semver.gt(version, currentVersion) &&
                  semver.lte(version, latestVersion)
                );
              })
              .map((release) => ({
                version: release.tag_name,
                notes: release.body || release.name || 'No release notes',
                url: release.html_url,
              }));

            if (relevantReleases.length > 0) {
              resources.releases = relevantReleases;
            }
          }
        } catch {
          // If releases fail, try to fetch CHANGELOG file
          try {
            const changelogContent = await fetchChangelogFile(
              githubInfo.owner,
              githubInfo.repo
            );

            if (changelogContent) {
              // Extract relevant section between versions
              const relevantChangelog = extractChangelogSection(
                changelogContent,
                currentVersion,
                latestVersion
              );

              if (relevantChangelog) {
                resources.changelogContent = relevantChangelog;
              }
            }
          } catch {
            // Silently fail - changelog is optional
          }
        }
      }
    }
  } catch {
    // If fetching fails, just use generic URL
    resources.changelog = `https://github.com/${getGithubRepo(packageName)}/releases`;
  }

  // Known codemods
  const codemods = getCodemods(packageName);
  if (codemods.length > 0) {
    resources.codemods = codemods;
  }

  return resources;
}

/**
 * Get GitHub repo for package (simplified)
 */
function getGithubRepo(packageName: string): string {
  // Common patterns
  const patterns: Record<string, string> = {
    webpack: 'webpack/webpack',
    react: 'facebook/react',
    vue: 'vuejs/vue',
    angular: 'angular/angular',
    typescript: 'microsoft/TypeScript',
    eslint: 'eslint/eslint',
    prettier: 'prettier/prettier',
  };

  return patterns[packageName] || `${packageName}/${packageName}`;
}

/**
 * Get known codemods for package
 */
function getCodemods(packageName: string): string[] {
  const codemods: Record<string, string[]> = {
    webpack: ['webpack-cli migrate'],
    react: ['react-codemod'],
    vue: ['@vue/compat'],
  };

  return codemods[packageName] || [];
}

/**
 * Extract relevant changelog section between two versions
 */
function extractChangelogSection(
  changelogContent: string,
  currentVersion: string,
  latestVersion: string
): string | null {
  try {
    // Split changelog into sections by version headers
    // Common formats: ## [1.2.3], # 1.2.3, ## v1.2.3, etc.
    const versionRegex = /^#{1,3}\s*\[?v?(\d+\.\d+\.\d+[^\]]*)\]?/gm;

    const sections: Array<{ version: string; content: string; index: number }> = [];
    let lastIndex = 0;
    let match;

    while ((match = versionRegex.exec(changelogContent)) !== null) {
      if (sections.length > 0) {
        // Save the previous section's content
        sections[sections.length - 1]!.content = changelogContent.substring(
          lastIndex,
          match.index
        );
      }

      sections.push({
        version: match[1]!,
        content: '',
        index: match.index,
      });

      lastIndex = match.index;
    }

    // Save the last section
    if (sections.length > 0) {
      sections[sections.length - 1]!.content = changelogContent.substring(lastIndex);
    }

    // Find sections between current and latest version
    const relevantSections = sections.filter((section) => {
      const version = section.version.replace(/^v/, '');
      return (
        semver.valid(version) &&
        semver.gt(version, currentVersion) &&
        semver.lte(version, latestVersion)
      );
    });

    if (relevantSections.length === 0) {
      return null;
    }

    // Combine relevant sections (limit to first 5000 characters)
    const combined = relevantSections
      .map((section) => section.content)
      .join('\n\n')
      .trim();

    return combined.length > 5000 ? combined.substring(0, 5000) + '...' : combined;
  } catch {
    return null;
  }
}
