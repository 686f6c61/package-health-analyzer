import { useTranslation } from 'react-i18next';
import { Download, FileJson, FileText, Table } from 'lucide-react';

const examples = [
  {
    name: 'Configuration Example',
    description: 'Complete configuration file with all available options and inline comments',
    file: 'config-example.json',
    icon: FileJson,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    name: 'JSON Scan Output',
    description: 'Structured JSON output with detailed package analysis and recommendations',
    file: 'express-project-outputs/scan-output.json',
    icon: FileJson,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
  {
    name: 'CSV Export',
    description: 'Spreadsheet-ready CSV format with all package details and scores',
    file: 'express-project-outputs/scan-output.csv',
    icon: Table,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
  {
    name: 'CLI Text Output',
    description: 'Human-readable text format perfect for logs and CI/CD pipelines',
    file: 'express-project-outputs/scan-output-cli.txt',
    icon: FileText,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
  },
  {
    name: 'Markdown Report',
    description: 'Comprehensive markdown report with tables and migration guides',
    file: 'express-project-outputs/scan-output.md',
    icon: FileText,
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-100 dark:bg-pink-900/30',
  },
  {
    name: 'SPDX SBOM (v2.0)',
    description: 'SPDX 2.3 Software Bill of Materials for CISA SBOM 2025 compliance',
    file: 'express-project-outputs/scan-output-sbom.json',
    icon: FileJson,
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
    badge: 'v2.0',
  },
  {
    name: 'NOTICE.txt (v2.0)',
    description: 'Apache-style NOTICE file with complete license texts for legal compliance',
    file: 'express-project-outputs/NOTICE.txt',
    icon: FileText,
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
    badge: 'v2.0',
  },
  {
    name: 'With Vulnerabilities (v2.0)',
    description: 'JSON output example showing CVE detection and security analysis',
    file: 'express-project-outputs/scan-output-with-vulnerabilities.json',
    icon: FileJson,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    badge: 'v2.0',
  },
  {
    name: 'SARIF 2.1.0 Output (v2.0)',
    description: 'Static Analysis Results Interchange Format for GitHub Code Scanning integration',
    file: 'express-project-outputs/scan-output.sarif',
    icon: FileJson,
    color: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-100 dark:bg-violet-900/30',
    badge: 'v2.0',
  },
];

export const Examples = () => {
  const { t } = useTranslation();

  return (
    <section id="examples" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('examples.title', 'Example Files')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('examples.subtitle', 'Download sample outputs and configuration files to see what the tool generates')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examples.map((example) => {
              const Icon = example.icon;
              return (
                <a
                  key={example.file}
                  href={`/examples/${example.file}`}
                  download
                  className="group relative bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-400 transition-all hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 ${example.bgColor} rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${example.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {example.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {example.description}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                        <code className="bg-gray-200 dark:bg-gray-900 px-2 py-1 rounded font-mono">
                          {example.file}
                        </code>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Download className="w-5 h-5 text-gray-400 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors" />
                  </div>
                </a>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {t('examples.note', 'Click any file to download. You can also find these files in the')}{' '}
              <a
                href="https://github.com/686f6c61/package-health-analyzer/tree/main/examples"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
              >
                GitHub repository
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
