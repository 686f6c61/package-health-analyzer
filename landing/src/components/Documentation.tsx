import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BookOpen,
  Terminal,
  Settings,
  Layers,
  GitBranch,
  FileText,
  Award,
  Shield,
  AlertCircle,
  CheckCircle,
  Zap,
  ChevronRight,
} from 'lucide-react';

interface Section {
  id: string;
  title: string;
  icon: any;
  subsections: {
    id: string;
    title: string;
    content: React.ReactNode;
  }[];
}

export const Documentation = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections: Section[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: BookOpen,
      subsections: [
        {
          id: 'installation',
          title: 'Installation',
          content: (
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Install package-health-analyzer globally using npm:
              </p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>npm install -g package-health-analyzer</code>
              </pre>
              <p className="text-gray-700 dark:text-gray-300">
                Or use it directly with npx without installation:
              </p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>npx package-health-analyzer scan</code>
              </pre>
            </div>
          ),
        },
        {
          id: 'quick-start',
          title: 'Quick Start',
          content: (
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Initialize configuration (interactive wizard):
              </p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>package-health-analyzer init</code>
              </pre>
              <p className="text-gray-700 dark:text-gray-300">
                Run your first analysis:
              </p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>package-health-analyzer scan</code>
              </pre>
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-200">
                  <strong>Tip:</strong> The scan command analyzes all dependencies in your package.json and generates a health report.
                </p>
              </div>
            </div>
          ),
        },
        {
          id: 'first-analysis',
          title: 'Understanding Your First Report',
          content: (
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                After running <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">scan</code>, you'll see a table with:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong>Package:</strong> Dependency name and version</li>
                <li><strong>Health Score:</strong> 0-100 rating (90+ excellent, 60-74 fair, &lt;60 poor)</li>
                <li><strong>Age:</strong> Last update time</li>
                <li><strong>License:</strong> License type and compatibility</li>
                <li><strong>Issues:</strong> Deprecation, vulnerabilities, warnings</li>
                <li><strong>Alternatives:</strong> Suggested replacements for problematic packages</li>
              </ul>
            </div>
          ),
        },
      ],
    },
    {
      id: 'commands',
      title: 'Commands Reference',
      icon: Terminal,
      subsections: [
        {
          id: 'init-command',
          title: 'init - Initialize Configuration',
          content: (
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Create a configuration file with interactive wizard or default values:
              </p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>package-health-analyzer init [directory]</code>
              </pre>
              <div className="mt-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Interactive Mode:</h4>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  The wizard will ask 12 questions to customize your configuration:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                  <li>Project type (commercial, saas, open-source, etc.)</li>
                  <li>Include devDependencies</li>
                  <li>Age thresholds for warnings</li>
                  <li>License policies (allow, deny, warn)</li>
                  <li>Minimum health score</li>
                  <li>Output format (CLI, JSON, CSV, MD, TXT)</li>
                  <li>Security checks</li>
                  <li>Ignore patterns</li>
                </ul>
              </div>
            </div>
          ),
        },
        {
          id: 'scan-command',
          title: 'scan - Analyze Dependencies',
          content: (
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Analyze all dependencies and generate a health report:
              </p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>package-health-analyzer scan [options]</code>
              </pre>
              <div className="mt-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Options:</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded">
                    <code className="text-primary-600 dark:text-primary-400">--output &lt;format&gt;</code>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Output format: cli, json, csv, md, txt (default: cli)
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded">
                    <code className="text-primary-600 dark:text-primary-400">--config &lt;path&gt;</code>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Custom configuration file path
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded">
                    <code className="text-primary-600 dark:text-primary-400">--include-dev</code>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Include devDependencies in analysis
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Examples:</h4>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto space-y-2">
                  <code className="block"># Scan with default config</code>
                  <code className="block">package-health-analyzer scan</code>
                  <code className="block mt-2"># Generate JSON output</code>
                  <code className="block">package-health-analyzer scan --output json &gt; report.json</code>
                  <code className="block mt-2"># Include dev dependencies</code>
                  <code className="block">package-health-analyzer scan --include-dev</code>
                  <code className="block mt-2"># Use custom config</code>
                  <code className="block">package-health-analyzer scan --config ./custom-config.json</code>
                </pre>
              </div>
            </div>
          ),
        },
        {
          id: 'check-command',
          title: 'check - Quick Health Check',
          content: (
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Perform a quick health check (lighter than scan):
              </p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>package-health-analyzer check</code>
              </pre>
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Difference from scan:</strong> The check command performs a faster analysis with less detailed information, ideal for CI/CD pipelines where speed matters.
                </p>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      id: 'configuration',
      title: 'Configuration Guide',
      icon: Settings,
      subsections: [
        {
          id: 'config-file',
          title: 'Configuration File',
          content: (
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Create <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">.packagehealthanalyzerrc.json</code> in your project root:
              </p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`{
  "$schema": "https://package-health-analyzer.onrender.com/schema.json",
  "projectType": "commercial",
  "age": {
    "warn": "2y",
    "critical": "5y",
    "checkDeprecated": true,
    "checkRepository": true
  },
  "license": {
    "allow": ["MIT", "Apache-2.0", "ISC"],
    "deny": ["GPL-*", "AGPL-*"],
    "warn": ["LGPL-*"]
  },
  "scoring": {
    "enabled": true,
    "minimumScore": 60
  },
  "output": "cli",
  "includeDevDependencies": false,
  "failOn": "critical"
}`}</code>
              </pre>
              <div className="mt-4">
                <a
                  href="/examples/config-example.json"
                  download
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Download Complete Example
                </a>
              </div>
            </div>
          ),
        },
        {
          id: 'project-types',
          title: 'Project Types',
          content: (
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Choose the project type that best fits your use case:
              </p>
              <div className="grid gap-3">
                {[
                  { type: 'commercial', desc: 'Proprietary software. Strict GPL/AGPL blocking.' },
                  { type: 'saas', desc: 'Software as a Service. AGPL warnings (network copyleft).' },
                  { type: 'open-source', desc: 'Public projects. Permissive with copyleft.' },
                  { type: 'personal', desc: 'Hobby projects. Very relaxed policies.' },
                  { type: 'internal', desc: 'Enterprise tools (internal use only).' },
                  { type: 'library', desc: 'npm packages. Distribution-compatible licenses.' },
                  { type: 'startup', desc: 'Early-stage. Balance speed vs. compliance.' },
                  { type: 'government', desc: 'Public sector. Regulatory requirements.' },
                  { type: 'educational', desc: 'Academic projects. Very permissive.' },
                  { type: 'custom', desc: 'Fully customized configuration.' },
                ].map((item) => (
                  <div key={item.type} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <code className="text-primary-600 dark:text-primary-400 font-semibold">
                      {item.type}
                    </code>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ),
        },
        {
          id: 'license-policies',
          title: 'License Policies',
          content: (
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Define which licenses are allowed, denied, or require review:
              </p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`{
  "license": {
    "allow": ["MIT", "ISC", "Apache-2.0"],
    "deny": ["GPL-*", "AGPL-*", "SSPL-*"],
    "warn": ["LGPL-*", "MPL-2.0"],
    "warnOnUnknown": true,
    "checkPatentClauses": true
  }
}`}</code>
              </pre>
              <div className="mt-4">
                <a
                  href="/LICENSES-REFERENCE.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  View License Reference (40+ licenses)
                </a>
              </div>
            </div>
          ),
        },
        {
          id: 'scoring-system',
          title: 'Health Scoring System',
          content: (
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Customize how health scores are calculated (0-100):
              </p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`{
  "scoring": {
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
  }
}`}</code>
              </pre>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Score ranges:</strong>
                </p>
                <ul className="list-disc pl-6 text-sm space-y-1">
                  <li>90-100: Excellent (well-maintained, safe)</li>
                  <li>75-89: Good (solid choice, minor concerns)</li>
                  <li>60-74: Fair (acceptable, needs monitoring)</li>
                  <li>0-59: Poor (high risk, consider alternatives)</li>
                </ul>
              </div>
              <div className="mt-4">
                <a
                  href="/SCORING-ALGORITHM.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  <Award className="w-4 h-4" />
                  View Complete Scoring Algorithm
                </a>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      id: 'use-cases',
      title: 'Use Cases',
      icon: Layers,
      subsections: [
        {
          id: 'ci-cd',
          title: 'CI/CD Integration',
          content: (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">GitHub Actions</h4>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`name: Dependency Health Check

on: [push, pull_request]

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install -g package-health-analyzer
      - run: package-health-analyzer scan --output json > report.json
      - run: package-health-analyzer check
      - uses: actions/upload-artifact@v3
        with:
          name: health-report
          path: report.json`}</code>
              </pre>

              <h4 className="font-semibold text-gray-900 dark:text-white mt-6">GitLab CI</h4>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`dependency-health:
  stage: test
  image: node:18
  script:
    - npm install -g package-health-analyzer
    - package-health-analyzer scan
  artifacts:
    reports:
      junit: report.json
  only:
    - merge_requests
    - main`}</code>
              </pre>

              <h4 className="font-semibold text-gray-900 dark:text-white mt-6">CircleCI</h4>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`version: 2.1
jobs:
  health-check:
    docker:
      - image: node:18
    steps:
      - checkout
      - run: npm install -g package-health-analyzer
      - run: package-health-analyzer scan
      - store_artifacts:
          path: report.json`}</code>
              </pre>
            </div>
          ),
        },
        {
          id: 'pre-commit',
          title: 'Pre-commit Hooks',
          content: (
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Run health checks before commits using Husky:
              </p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`# Install Husky
npm install --save-dev husky

# Initialize
npx husky init

# Add pre-commit hook
echo "npx package-health-analyzer check" > .husky/pre-commit
chmod +x .husky/pre-commit`}</code>
              </pre>
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Note:</strong> Use the check command in pre-commit hooks for faster execution.
                </p>
              </div>
            </div>
          ),
        },
        {
          id: 'monorepo',
          title: 'Monorepo Setup',
          content: (
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Analyze multiple packages in a monorepo:
              </p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`# Root package.json script
{
  "scripts": {
    "health:all": "lerna exec -- package-health-analyzer scan",
    "health:api": "cd packages/api && package-health-analyzer scan",
    "health:web": "cd packages/web && package-health-analyzer scan"
  }
}`}</code>
              </pre>
              <p className="text-gray-700 dark:text-gray-300 mt-4">
                Or create a script to analyze all workspaces:
              </p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`#!/bin/bash
# scripts/check-all.sh

for dir in packages/*; do
  if [ -f "$dir/package.json" ]; then
    echo "Analyzing $dir..."
    cd $dir && package-health-analyzer scan
    cd ../..
  fi
done`}</code>
              </pre>
            </div>
          ),
        },
        {
          id: 'security-audit',
          title: 'Security Audits',
          content: (
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Configure for strict security audits:
              </p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`{
  "projectType": "commercial",
  "scoring": {
    "enabled": true,
    "minimumScore": 70,
    "boosters": {
      "age": 1.0,
      "deprecation": 5.0,
      "license": 2.0,
      "vulnerability": 4.0,
      "popularity": 0.5,
      "repository": 1.5,
      "updateFrequency": 1.0
    }
  },
  "github": {
    "enabled": true
  },
  "failOn": "warning"
}`}</code>
              </pre>
              <p className="text-gray-700 dark:text-gray-300 mt-4">
                This configuration:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Heavily weights vulnerabilities and deprecation</li>
                <li>Requires minimum score of 70</li>
                <li>Enables GitHub integration for deep analysis</li>
                <li>Fails on warnings (strict mode)</li>
              </ul>
            </div>
          ),
        },
      ],
    },
    {
      id: 'integrations',
      title: 'Integrations',
      icon: GitBranch,
      subsections: [
        {
          id: 'github-integration',
          title: 'GitHub Integration',
          content: (
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Enable GitHub API integration for enhanced repository analysis:
              </p>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">1. Generate GitHub Token</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Go to GitHub Settings → Developer settings → Personal access tokens → Generate new token
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    Required scope: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">public_repo</code>
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2. Set Environment Variable</h4>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <code>export GITHUB_TOKEN=ghp_your_token_here</code>
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3. Enable in Config</h4>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`{
  "github": {
    "enabled": true
  }
}`}</code>
                  </pre>
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Enhanced data:</strong> Commit activity, issue metrics, contributor stats, repository health.
                </p>
              </div>
            </div>
          ),
        },
        {
          id: 'npm-scripts',
          title: 'NPM Scripts',
          content: (
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Add useful scripts to your package.json:
              </p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`{
  "scripts": {
    "health": "package-health-analyzer scan",
    "health:check": "package-health-analyzer check",
    "health:json": "package-health-analyzer scan --output json > health-report.json",
    "health:md": "package-health-analyzer scan --output md > HEALTH-REPORT.md",
    "health:dev": "package-health-analyzer scan --include-dev",
    "preinstall": "package-health-analyzer check",
    "postinstall": "package-health-analyzer scan"
  }
}`}</code>
              </pre>
            </div>
          ),
        },
      ],
    },
    {
      id: 'outputs',
      title: 'Output Formats',
      icon: FileText,
      subsections: [
        {
          id: 'cli-output',
          title: 'CLI Table (Default)',
          content: (
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Colorful table output in terminal:
              </p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>package-health-analyzer scan</code>
              </pre>
              <p className="text-gray-700 dark:text-gray-300 mt-4">
                Best for: Interactive terminal use, quick visual inspection
              </p>
            </div>
          ),
        },
        {
          id: 'json-output',
          title: 'JSON (Programmatic)',
          content: (
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Structured data for automation and integrations:
              </p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>package-health-analyzer scan --output json &gt; report.json</code>
              </pre>
              <p className="text-gray-700 dark:text-gray-300 mt-4">
                Best for: CI/CD pipelines, dashboards, custom processing
              </p>
              <div className="mt-4">
                <a
                  href="/examples/sample-output.json"
                  download
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Download example JSON output
                </a>
              </div>
            </div>
          ),
        },
        {
          id: 'csv-output',
          title: 'CSV (Spreadsheets)',
          content: (
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Comma-separated values for Excel/Google Sheets:
              </p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>package-health-analyzer scan --output csv &gt; report.csv</code>
              </pre>
              <p className="text-gray-700 dark:text-gray-300 mt-4">
                Best for: Data analysis, stakeholder reports, tracking over time
              </p>
              <div className="mt-4">
                <a
                  href="/examples/sample-output.csv"
                  download
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Download example CSV output
                </a>
              </div>
            </div>
          ),
        },
        {
          id: 'markdown-output',
          title: 'Markdown (Documentation)',
          content: (
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Formatted markdown for documentation:
              </p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>package-health-analyzer scan --output md &gt; HEALTH.md</code>
              </pre>
              <p className="text-gray-700 dark:text-gray-300 mt-4">
                Best for: README files, wiki pages, PR descriptions
              </p>
              <div className="mt-4">
                <a
                  href="/examples/sample-report.md"
                  download
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Download example Markdown report
                </a>
              </div>
            </div>
          ),
        },
        {
          id: 'txt-output',
          title: 'Plain Text',
          content: (
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Simple text format without formatting:
              </p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>package-health-analyzer scan --output txt &gt; report.txt</code>
              </pre>
              <p className="text-gray-700 dark:text-gray-300 mt-4">
                Best for: Logs, simple parsing, plain text emails
              </p>
              <div className="mt-4">
                <a
                  href="/examples/sample-output.txt"
                  download
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Download example TXT output
                </a>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: AlertCircle,
      subsections: [
        {
          id: 'common-issues',
          title: 'Common Issues',
          content: (
            <div className="space-y-4">
              <div className="border-l-4 border-yellow-500 pl-4 py-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">Command not found</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                  Install globally: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">npm install -g package-health-analyzer</code>
                </p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4 py-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">GitHub rate limit exceeded</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                  Set GITHUB_TOKEN environment variable to increase rate limit from 60 to 5000 requests/hour
                </p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4 py-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">Slow analysis</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                  Enable caching in config or use <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">check</code> instead of <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">scan</code>
                </p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4 py-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">Unknown license warnings</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                  Add custom licenses to allow/warn/deny lists or set <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">warnOnUnknown: false</code>
                </p>
              </div>
            </div>
          ),
        },
        {
          id: 'performance',
          title: 'Performance Tips',
          content: (
            <div className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Enable caching:</strong>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Results are cached for 1 hour by default</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Use check for CI:</strong>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Faster than scan, ideal for quick validation</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Ignore development scopes:</strong>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Skip @types/*, @babel/*, etc. if not needed</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Set GitHub token:</strong>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Avoids rate limiting and speeds up repo checks</p>
                  </div>
                </li>
              </ul>
            </div>
          ),
        },
      ],
    },
    {
      id: 'best-practices',
      title: 'Best Practices',
      icon: CheckCircle,
      subsections: [
        {
          id: 'recommended-settings',
          title: 'Recommended Settings',
          content: (
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                    Production Applications
                  </h4>
                  <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                    <li>• Minimum score: 60-70</li>
                    <li>• Fail on: critical</li>
                    <li>• Deny: GPL-*, AGPL-*, SSPL-*</li>
                    <li>• Check deprecated: true</li>
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Open Source Projects
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Minimum score: 0 (informational)</li>
                    <li>• Fail on: none</li>
                    <li>• Warn: AGPL-*</li>
                    <li>• More permissive</li>
                  </ul>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                    Enterprise/Security Focused
                  </h4>
                  <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                    <li>• Minimum score: 70-80</li>
                    <li>• Fail on: warning</li>
                    <li>• GitHub integration: enabled</li>
                    <li>• Heavy vulnerability weighting</li>
                  </ul>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: 'team-workflows',
          title: 'Team Workflows',
          content: (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Commit config to repo</strong>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Everyone uses the same rules
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Run in CI/CD</strong>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Automate checks on every PR
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Regular scans</strong>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Schedule weekly dependency reviews
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 dark:text-white">Track scores over time</strong>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Export to CSV and monitor trends
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: 'maintenance',
          title: 'Maintenance Strategy',
          content: (
            <div className="space-y-4">
              <ol className="space-y-3 list-decimal pl-6">
                <li className="text-gray-700 dark:text-gray-300">
                  <strong>Triage by score:</strong> Fix packages &lt;60 first, then &lt;75
                </li>
                <li className="text-gray-700 dark:text-gray-300">
                  <strong>Prioritize vulnerabilities:</strong> Critical vulns before outdated packages
                </li>
                <li className="text-gray-700 dark:text-gray-300">
                  <strong>Replace deprecated:</strong> Find alternatives immediately
                </li>
                <li className="text-gray-700 dark:text-gray-300">
                  <strong>Review licenses:</strong> Ensure compliance before issues arise
                </li>
                <li className="text-gray-700 dark:text-gray-300">
                  <strong>Update regularly:</strong> Don't let dependencies fall too far behind
                </li>
              </ol>
            </div>
          ),
        },
      ],
    },
  ];

  const activeTab = sections.find((s) => s.id === activeSection) || sections[0];

  return (
    <section id="documentation" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('documentation.title', 'Complete Documentation')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Everything you need to know about using package-health-analyzer in your projects
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 sticky top-4">
                <nav className="p-4 space-y-1">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          activeSection === section.id
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-medium text-left">{section.title}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-8">
                    {(() => {
                      const Icon = activeTab.icon;
                      return <Icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />;
                    })()}
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {activeTab.title}
                    </h3>
                  </div>

                  <div className="space-y-12">
                    {activeTab.subsections.map((subsection) => (
                      <div key={subsection.id} id={subsection.id}>
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          <ChevronRight className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                          {subsection.title}
                        </h4>
                        <div className="pl-7">{subsection.content}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
