import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, AlertTriangle, Shield, Award, Filter, FileOutput, Zap, Github, TrendingUp, BookOpen, Network, FileText } from 'lucide-react';
import { LicenseModal } from './LicenseModal';
import { ScoringModal } from './ScoringModal';

const configSections = [
  {
    id: 'projectType',
    title: 'Project Type',
    icon: Settings,
    description: 'Define your project type to apply appropriate license checks',
    options: [
      { value: 'commercial', label: 'Commercial', desc: 'Proprietary/closed-source projects. Strict GPL/AGPL blocking.' },
      { value: 'saas', label: 'SaaS', desc: 'Software as a Service. Extra warnings for AGPL (network copyleft).' },
      { value: 'open-source', label: 'Open Source', desc: 'Public projects. Permissive with copyleft licenses.' },
      { value: 'personal', label: 'Personal', desc: 'Personal/hobby projects. Very relaxed license policies.' },
      { value: 'internal', label: 'Internal', desc: 'Enterprise internal tools. More permissive (internal use only).' },
      { value: 'library', label: 'Library', desc: 'npm packages/libraries. Focus on distribution-compatible licenses.' },
      { value: 'startup', label: 'Startup', desc: 'Early-stage startups. Balance speed vs. strict compliance.' },
      { value: 'government', label: 'Government', desc: 'Public sector projects. Specific regulatory requirements.' },
      { value: 'educational', label: 'Educational', desc: 'Academic/educational projects. Very permissive policies.' },
      { value: 'custom', label: 'Custom', desc: 'Fully customized configuration for unique requirements.' },
    ],
    example: '"projectType": "commercial"',
  },
  {
    id: 'age',
    title: 'Age Thresholds',
    icon: AlertTriangle,
    description: 'Configure when packages are considered outdated',
    fields: [
      { name: 'warn', desc: 'Warning threshold (e.g., "2y" = 2 years)', default: '"2y"' },
      { name: 'critical', desc: 'Critical threshold (e.g., "5y" = 5 years)', default: '"5y"' },
      { name: 'checkDeprecated', desc: 'Alert on deprecated packages', default: 'true' },
      { name: 'checkRepository', desc: 'Check repository activity', default: 'true' },
    ],
    example: `"age": {
  "warn": "2y",
  "critical": "5y",
  "checkDeprecated": true,
  "checkRepository": true
}`,
  },
  {
    id: 'license',
    title: 'License Control',
    icon: Shield,
    description: 'Define which licenses are allowed, denied, or require review',
    fields: [
      { name: 'allow', desc: 'Explicitly allowed licenses (e.g., ["MIT", "Apache-2.0"])', default: '[]' },
      { name: 'deny', desc: 'Blocked licenses that fail the build (e.g., ["GPL-*", "AGPL-*"])', default: '[]' },
      { name: 'warn', desc: 'Licenses that trigger warnings (e.g., ["LGPL-*", "MPL-2.0"])', default: '[]' },
      { name: 'warnOnUnknown', desc: 'Alert when license is unrecognized', default: 'true' },
      { name: 'checkPatentClauses', desc: 'Verify patent protection clauses', default: 'true' },
    ],
    note: 'See complete list of supported licenses with exact SPDX identifiers',
    docLink: {
      modalType: 'license',
      label: 'Ver guía de referencia de licencias',
      description: 'Catálogo completo de 221 licencias con configuraciones listas para copiar',
    },
    example: `"license": {
  "allow": ["MIT", "ISC", "Apache-2.0"],
  "deny": ["GPL-*", "AGPL-*"],
  "warn": ["LGPL-*", "MPL-2.0"],
  "warnOnUnknown": true,
  "checkPatentClauses": true
}`,
  },
  {
    id: 'scoring',
    title: 'Health Scoring',
    icon: Award,
    description: 'Configure the 0-100 health score system',
    fields: [
      { name: 'enabled', desc: 'Enable/disable scoring system', default: 'true' },
      { name: 'minimumScore', desc: 'Minimum acceptable score (0-100). 0 = no minimum', default: '0' },
      { name: 'boosters', desc: 'Weight multipliers for each metric (age, deprecation, license, vulnerability, popularity, repository, updateFrequency)', default: 'varies' },
    ],
    note: 'Scores are calculated using 7 weighted dimensions with customizable booster values',
    docLink: {
      modalType: 'scoring',
      label: 'View Scoring Algorithm Documentation',
      description: 'Complete formula breakdown: how each dimension is scored and weighted',
    },
    example: `"scoring": {
  "enabled": true,
  "minimumScore": 60,
  "boosters": {
    "age": 1.5,
    "deprecation": 4.0,
    "license": 3.0,
    "vulnerability": 2.0,
    "popularity": 1.0,
    "repository": 2.0,
    "updateFrequency": 1.5
  }
}`,
  },
  {
    id: 'ignore',
    title: 'Ignore Patterns',
    icon: Filter,
    description: 'Exclude specific packages from analysis',
    fields: [
      { name: 'scopes', desc: 'Ignore by npm scope (e.g., ["@types/*", "@babel/*"])', default: '[]' },
      { name: 'prefixes', desc: 'Ignore by name prefix (e.g., ["eslint-*", "webpack-*"])', default: '[]' },
      { name: 'authors', desc: 'Ignore by package author', default: '[]' },
      { name: 'packages', desc: 'Ignore specific package names', default: '[]' },
    ],
    example: `"ignore": {
  "scopes": ["@types/*", "@mycompany/*"],
  "prefixes": ["eslint-*"],
  "authors": [],
  "packages": ["legacy-lib"]
}`,
  },
  {
    id: 'output',
    title: 'Output Format',
    icon: FileOutput,
    description: 'Choose how analysis results are displayed',
    options: [
      { value: 'cli', label: 'CLI Table', desc: 'Colorful table in terminal (default)' },
      { value: 'json', label: 'JSON', desc: 'Structured data for programmatic use' },
      { value: 'csv', label: 'CSV', desc: 'Spreadsheet-ready comma-separated values' },
      { value: 'txt', label: 'Plain Text', desc: 'Human-readable text format' },
      { value: 'md', label: 'Markdown', desc: 'Markdown with tables and formatting' },
    ],
    example: '"output": "cli"',
  },
  {
    id: 'cache',
    title: 'Caching',
    icon: Zap,
    description: 'Speed up repeated analysis with intelligent caching',
    fields: [
      { name: 'enabled', desc: 'Enable results caching', default: 'true' },
      { name: 'ttl', desc: 'Cache time-to-live in seconds', default: '3600' },
    ],
    example: `"cache": {
  "enabled": true,
  "ttl": 3600
}`,
  },
  {
    id: 'github',
    title: 'GitHub Integration',
    icon: Github,
    description: 'Enhanced repository analysis and vulnerability scanning with GitHub API',
    fields: [
      { name: 'enabled', desc: 'Enable GitHub API integration', default: 'false' },
      { name: 'token', desc: 'GitHub personal access token (encrypted with AES-256-GCM)', default: 'undefined' },
      { name: 'security.enabled', desc: 'Enable GitHub Advisory Database vulnerability scanning', default: 'false' },
      { name: 'security.cacheTtl', desc: 'Vulnerability cache duration in milliseconds (24h = 86400000)', default: '86400000' },
    ],
    note: 'Requires GITHUB_TOKEN environment variable. Token is encrypted using AES-256-GCM with secure memory cleanup and file permission validation (600).',
    example: `"github": {
  "enabled": true,
  "security": {
    "enabled": true,
    "cacheTtl": 86400000
  }
}`,
  },
  {
    id: 'dependencyTree',
    title: 'Dependency Tree Analysis',
    icon: Network,
    description: 'Deep transitive dependency analysis with circular and duplicate detection',
    fields: [
      { name: 'enabled', desc: 'Enable dependency tree analysis', default: 'true' },
      { name: 'maxDepth', desc: 'Maximum depth to traverse (0 = unlimited)', default: '0' },
      { name: 'analyzeTransitive', desc: 'Analyze all transitive dependencies', default: 'true' },
      { name: 'detectCircular', desc: 'Detect circular dependency chains', default: 'true' },
      { name: 'detectDuplicates', desc: 'Detect multiple versions of same package', default: 'true' },
      { name: 'stopOnCircular', desc: 'Stop analysis when circular dependency found', default: 'false' },
      { name: 'cacheTrees', desc: 'Cache dependency trees for performance', default: 'true' },
    ],
    example: `"dependencyTree": {
  "enabled": true,
  "maxDepth": 3,
  "analyzeTransitive": true,
  "detectCircular": true,
  "detectDuplicates": true
}`,
  },
  {
    id: 'notice',
    title: 'NOTICE.txt Generation',
    icon: FileText,
    description: 'Generate Apache-style NOTICE.txt files for legal compliance',
    fields: [
      { name: 'format', desc: 'Output format: "apache" or "simple"', default: '"apache"' },
      { name: 'includeDevDependencies', desc: 'Include devDependencies in NOTICE', default: 'true' },
      { name: 'includeTransitive', desc: 'Include transitive dependencies', default: 'true' },
      { name: 'includeCopyright', desc: 'Include copyright information', default: 'true' },
      { name: 'includeUrls', desc: 'Include repository URLs', default: 'true' },
      { name: 'groupByLicense', desc: 'Group packages by license type', default: 'false' },
      { name: 'outputPath', desc: 'Output file path', default: '"NOTICE.txt"' },
    ],
    example: `"notice": {
  "format": "apache",
  "includeTransitive": true,
  "includeCopyright": true,
  "outputPath": "NOTICE.txt"
}`,
  },
  {
    id: 'upgradePath',
    title: 'Upgrade Path Analysis',
    icon: TrendingUp,
    description: 'Intelligent upgrade recommendations',
    fields: [
      { name: 'enabled', desc: 'Enable upgrade path analysis', default: 'true' },
      { name: 'analyzeBreakingChanges', desc: 'Detect breaking changes in updates', default: 'true' },
      { name: 'suggestAlternatives', desc: 'Recommend alternative packages', default: 'true' },
      { name: 'fetchChangelogs', desc: 'Automatically fetch CHANGELOG files and GitHub releases for migration context', default: 'false' },
      { name: 'estimateEffort', desc: 'Estimate migration effort (5min to 2 days)', default: 'true' },
    ],
    example: `"upgradePath": {
  "enabled": true,
  "analyzeBreakingChanges": true,
  "suggestAlternatives": true,
  "fetchChangelogs": false,
  "estimateEffort": true
}`,
  },
];

export const ConfigurationGuide = () => {
  const { t } = useTranslation();
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [isScoringModalOpen, setIsScoringModalOpen] = useState(false);

  const openModal = (modalType: string) => {
    if (modalType === 'license') {
      setIsLicenseModalOpen(true);
    } else if (modalType === 'scoring') {
      setIsScoringModalOpen(true);
    }
  };

  return (
    <section id="configuration" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('configuration.title', 'Configuration Reference')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('configuration.subtitle', 'Complete guide to all configuration options available in .packagehealthanalyzerrc.json')}
            </p>
          </div>

          <div className="space-y-8">
            {configSections.map((section) => {
              const Icon = section.icon;
              return (
                <div
                  key={section.id}
                  id={`config-${section.id}`}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {section.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {section.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {section.options && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Available Options:
                        </h4>
                        <div className="grid gap-3">
                          {section.options.map((option) => (
                            <div
                              key={option.value}
                              className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                            >
                              <code className="text-sm font-mono text-primary-600 dark:text-primary-400 font-semibold">
                                {option.value}
                              </code>
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {option.label}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {option.desc}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {section.fields && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Configuration Fields:
                        </h4>
                        <div className="space-y-3">
                          {section.fields.map((field) => (
                            <div
                              key={field.name}
                              className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                            >
                              <div className="flex items-baseline gap-2 mb-1">
                                <code className="text-sm font-mono text-primary-600 dark:text-primary-400 font-semibold">
                                  {field.name}
                                </code>
                                <span className="text-xs text-gray-500 dark:text-gray-500">
                                  default: {field.default}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {field.desc}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {section.note && (
                      <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          <strong>Note:</strong> {section.note}
                        </p>
                      </div>
                    )}

                    {section.docLink && (
                      <div className="mb-6">
                        <button
                          onClick={() => openModal(section.docLink.modalType)}
                          className="inline-flex items-center gap-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-medium rounded-lg transition-colors shadow-sm"
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>{section.docLink.label}</span>
                        </button>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          {section.docLink.description}
                        </p>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Example:
                      </h4>
                      <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm border border-gray-700">
                        <code>{section.example}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 p-6 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              Additional Configuration Options
            </h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p>
                <code className="bg-primary-100 dark:bg-primary-900/50 px-2 py-1 rounded font-mono text-primary-700 dark:text-primary-300">
                  includeDevDependencies
                </code>
                {' '}- Set to <code>true</code> to analyze devDependencies, <code>false</code> for production dependencies only (default)
              </p>
              <p>
                <code className="bg-primary-100 dark:bg-primary-900/50 px-2 py-1 rounded font-mono text-primary-700 dark:text-primary-300">
                  failOn
                </code>
                {' '}- Severity level to trigger non-zero exit code: <code>"none"</code>, <code>"info"</code>, <code>"warning"</code>, or <code>"critical"</code> (default)
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="/examples/config-example.json"
              download
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
            >
              <FileOutput className="w-5 h-5" />
              Download Complete Example Config
            </a>
          </div>
        </div>
      </div>

      <LicenseModal
        isOpen={isLicenseModalOpen}
        onClose={() => setIsLicenseModalOpen(false)}
      />
      <ScoringModal
        isOpen={isScoringModalOpen}
        onClose={() => setIsScoringModalOpen(false)}
      />
    </section>
  );
};
