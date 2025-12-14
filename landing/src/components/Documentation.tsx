import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BookOpen,
  Terminal,
  Settings,
  Layers,
  GitBranch,
  FileText,
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
      title: t('documentation.sections.gettingStarted.title'),
      icon: BookOpen,
      subsections: [
        {
          id: 'installation',
          title: t('documentation.sections.gettingStarted.installation.title'),
          content: (
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                {t('documentation.sections.gettingStarted.installation.content')}
              </p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>npm install -g package-health-analyzer</code>
              </pre>
              <p className="text-gray-700 dark:text-gray-300">
                {t('documentation.sections.gettingStarted.installation.content')}
              </p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>npx package-health-analyzer scan</code>
              </pre>
            </div>
          ),
        },
        {
          id: 'quick-start',
          title: t('documentation.sections.gettingStarted.quickStart.title'),
          content: (
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                {t('documentation.sections.gettingStarted.quickStart.content')}
              </p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>package-health-analyzer init</code>
              </pre>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>package-health-analyzer scan</code>
              </pre>
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
      title: t('documentation.sections.commands.title'),
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
        {
          id: 'generate-notice-command',
          title: 'generate-notice - Create NOTICE.txt',
          content: (
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Generate Apache-style NOTICE.txt files with complete dependency licenses:
              </p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>package-health-analyzer generate-notice [options]</code>
              </pre>
              <div className="mt-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Options:</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded">
                    <code className="text-primary-600 dark:text-primary-400">--format &lt;type&gt;</code>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Formato: apache (con textos completos de licencia) o simple (solo atribución). Por defecto: apache
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded">
                    <code className="text-primary-600 dark:text-primary-400">--include-transitive</code>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Incluir dependencias transitivas en el archivo NOTICE
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded">
                    <code className="text-primary-600 dark:text-primary-400">--group-by-license</code>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Agrupar paquetes por tipo de licencia
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Ejemplos:</h4>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto space-y-2">
                  <code className="block"># Generar NOTICE.txt en formato Apache</code>
                  <code className="block">package-health-analyzer generate-notice</code>
                  <code className="block mt-2"># Formato simple (solo atribución)</code>
                  <code className="block">package-health-analyzer generate-notice --format simple</code>
                  <code className="block mt-2"># Incluir dependencias transitivas</code>
                  <code className="block">package-health-analyzer generate-notice --include-transitive</code>
                  <code className="block mt-2"># Agrupar por licencia</code>
                  <code className="block">package-health-analyzer generate-notice --group-by-license</code>
                </pre>
              </div>
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Uso:</strong> El formato Apache es obligatorio para proyectos de Apache Software Foundation y recomendado para cualquier proyecto open source que distribuya software. Los textos completos de licencia se obtienen automáticamente de npm CDN y GitHub.
                </p>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      id: 'configuration',
      title: t('documentation.sections.configuration.title'),
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
          title: 'License Reference (221 Licenses)',
          content: (
            <div className="space-y-6">
              <div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Configure license policies for your project using our database of 221 SPDX licenses with Blue Oak Council ratings and patent clause detection:
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
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Blue Oak Council Ratings</h5>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  The Blue Oak Council provides independent ratings that help you quickly identify which licenses are safe for commercial use and which present legal challenges:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <h6 className="font-semibold text-green-900 dark:text-green-100 mb-2">Gold Tier (47 licenses)</h6>
                    <p className="text-sm text-green-800 dark:text-green-200 mb-2">
                      Most permissive licenses with maximum freedom. Ideal for all projects including commercial and proprietary software.
                    </p>
                    <div className="text-xs text-green-700 dark:text-green-300">
                      <strong>Examples:</strong> MIT, Apache-2.0, BSD-3-Clause, ISC, Unlicense
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <h6 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Silver Tier (23 licenses)</h6>
                    <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                      Permissive licenses with slightly more complex legal language. Safe for most uses but may need legal review.
                    </p>
                    <div className="text-xs text-blue-700 dark:text-blue-300">
                      <strong>Examples:</strong> AFL-3.0, BSL-1.0, MS-PL, OFL-1.1
                    </div>
                  </div>
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <h6 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Bronze Tier (12 licenses)</h6>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
                      Weak copyleft at file/library level. Modifications to licensed code must be shared, but your application code stays private.
                    </p>
                    <div className="text-xs text-yellow-700 dark:text-yellow-300">
                      <strong>Examples:</strong> LGPL-3.0, MPL-2.0, EPL-2.0, EUPL-1.2
                    </div>
                  </div>
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <h6 className="font-semibold text-red-900 dark:text-red-100 mb-2">Lead Tier (18 licenses)</h6>
                    <p className="text-sm text-red-800 dark:text-red-200 mb-2">
                      Strong copyleft requiring entire application source disclosure. Incompatible with proprietary software.
                    </p>
                    <div className="text-xs text-red-700 dark:text-red-300">
                      <strong>Examples:</strong> GPL-3.0, AGPL-3.0, SSPL-1.0
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Reference Tables</h5>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Copy-paste ready license lists for common project configurations:
                </p>

                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <h6 className="font-semibold text-green-900 dark:text-green-100 mb-2">Commercial-Friendly Licenses (47 total - Blue Oak Gold)</h6>
                    <p className="text-sm text-green-800 dark:text-green-200 mb-3">
                      Safe for commercial/proprietary projects - most permissive:
                    </p>
                    <div className="overflow-x-auto mb-3">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-green-300 dark:border-green-700">
                            <th className="text-left py-2 text-green-900 dark:text-green-100">License ID</th>
                            <th className="text-left py-2 text-green-900 dark:text-green-100">Full Name</th>
                            <th className="text-left py-2 text-green-900 dark:text-green-100">Notes</th>
                          </tr>
                        </thead>
                        <tbody className="text-green-800 dark:text-green-200">
                          <tr><td className="py-1 font-mono font-bold">MIT</td><td>MIT License</td><td>Most popular, very permissive</td></tr>
                          <tr><td className="py-1 font-mono font-bold">Apache-2.0</td><td>Apache License 2.0</td><td>With patent grant</td></tr>
                          <tr><td className="py-1 font-mono font-bold">BSD-3-Clause</td><td>BSD 3-Clause "New"</td><td>Non-endorsement clause</td></tr>
                          <tr><td className="py-1 font-mono">BSD-2-Clause</td><td>BSD 2-Clause "Simplified"</td><td>Permissive with attribution</td></tr>
                          <tr><td className="py-1 font-mono">0BSD</td><td>BSD Zero Clause</td><td>Public domain equivalent</td></tr>
                          <tr><td className="py-1 font-mono">Unlicense</td><td>The Unlicense</td><td>Public domain dedication</td></tr>
                          <tr><td className="py-1 font-mono">ISC</td><td>ISC License</td><td>Similar to MIT</td></tr>
                          <tr><td className="py-1 font-mono">Zlib</td><td>zlib License</td><td>Permissive for software</td></tr>
                          <tr><td className="py-1 font-mono">Python-2.0</td><td>Python License 2.0</td><td>Python-specific</td></tr>
                          <tr><td className="py-1 font-mono">PostgreSQL</td><td>PostgreSQL License</td><td>Database license</td></tr>
                          <tr><td className="py-1 font-mono">NCSA</td><td>UIUC/NCSA Open Source</td><td>University license</td></tr>
                          <tr><td className="py-1 font-mono">X11</td><td>X11 License</td><td>X Window System</td></tr>
                          <tr><td className="py-1 font-mono">CC0-1.0</td><td>Creative Commons Zero v1.0</td><td>Public domain waiver</td></tr>
                          <tr><td className="py-1 font-mono">BSL-1.0</td><td>Boost Software License 1.0</td><td>C++ libraries</td></tr>
                          <tr><td className="py-1 font-mono">Ruby</td><td>Ruby License</td><td>Ruby-specific</td></tr>
                          <tr><td className="py-1 font-mono">PHP-3.01</td><td>PHP License v3.01</td><td>PHP-specific</td></tr>
                        </tbody>
                      </table>
                    </div>
                    <details className="mb-3">
                      <summary className="cursor-pointer text-xs font-semibold text-green-900 dark:text-green-100 hover:underline">
                        + Ver todas las 47 licencias Gold (click para expandir)
                      </summary>
                      <div className="mt-2 text-xs text-green-800 dark:text-green-200 grid grid-cols-2 md:grid-cols-3 gap-1 p-2 bg-green-100 dark:bg-green-900/40 rounded">
                        <code>MIT</code>
                        <code>Apache-2.0</code>
                        <code>BSD-3-Clause</code>
                        <code>BSD-2-Clause</code>
                        <code>0BSD</code>
                        <code>Unlicense</code>
                        <code>ISC</code>
                        <code>Zlib</code>
                        <code>Python-2.0</code>
                        <code>PostgreSQL</code>
                        <code>NCSA</code>
                        <code>X11</code>
                        <code>CC0-1.0</code>
                        <code>BSL-1.0</code>
                        <code>WTFPL</code>
                        <code>AFL-3.0</code>
                        <code>Artistic-2.0</code>
                        <code>CDDL-1.0</code>
                        <code>ECL-2.0</code>
                        <code>EFL-2.0</code>
                        <code>MirOS</code>
                        <code>MS-PL</code>
                        <code>NTP</code>
                        <code>OFL-1.1</code>
                        <code>OSL-3.0</code>
                        <code>UPL-1.0</code>
                        <code>Apache-1.0</code>
                        <code>Apache-1.1</code>
                        <code>Artistic-1.0</code>
                        <code>BSD-1-Clause</code>
                        <code>BSD-4-Clause</code>
                        <code>BUSL-1.1</code>
                        <code>CC-BY-4.0</code>
                        <code>CDDL-1.1</code>
                        <code>CPL-1.0</code>
                        <code>Elastic-2.0</code>
                        <code>FTL</code>
                        <code>Intel</code>
                        <code>Libpng</code>
                        <code>MIT-0</code>
                        <code>MPL-1.1</code>
                        <code>MPL-2.0</code>
                        <code>OpenSSL</code>
                        <code>W3C</code>
                        <code>ZPL-2.1</code>
                        <code>Vim</code>
                      </div>
                    </details>
                    <div className="mt-2 p-3 bg-green-100 dark:bg-green-900/40 rounded">
                      <p className="text-xs text-green-900 dark:text-green-100 font-semibold mb-1">Copy-paste ready (top 16 most used):</p>
                      <pre className="bg-green-900 dark:bg-green-950 text-green-100 p-2 rounded text-xs overflow-x-auto">
                        <code>{`"allow": [
  "MIT", "ISC", "BSD-2-Clause", "BSD-3-Clause", "0BSD",
  "Apache-2.0", "Apache-1.1", "Unlicense", "CC0-1.0",
  "Zlib", "BSL-1.0", "Python-2.0", "Ruby", "PHP-3.01",
  "PostgreSQL", "X11"
]`}</code>
                      </pre>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <h6 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Commercial-Warning Licenses (12 total - Blue Oak Bronze)</h6>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
                      Weak copyleft at file/library level - share modifications to licensed code, but your app code stays private:
                    </p>
                    <div className="overflow-x-auto mb-3">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-yellow-300 dark:border-yellow-700">
                            <th className="text-left py-2 text-yellow-900 dark:text-yellow-100">License ID</th>
                            <th className="text-left py-2 text-yellow-900 dark:text-yellow-100">Full Name</th>
                            <th className="text-left py-2 text-yellow-900 dark:text-yellow-100">Notes</th>
                          </tr>
                        </thead>
                        <tbody className="text-yellow-800 dark:text-yellow-200">
                          <tr><td className="py-1 font-mono font-bold">LGPL-2.1</td><td>GNU LGPL v2.1</td><td>Dynamic linking allowed</td></tr>
                          <tr><td className="py-1 font-mono font-bold">LGPL-3.0</td><td>GNU LGPL v3.0</td><td>GPLv3 compatible</td></tr>
                          <tr><td className="py-1 font-mono font-bold">MPL-2.0</td><td>Mozilla Public License 2.0</td><td>File-level copyleft</td></tr>
                          <tr><td className="py-1 font-mono">LGPL-2.1-only</td><td>GNU LGPL v2.1 only</td><td>Version locked</td></tr>
                          <tr><td className="py-1 font-mono">LGPL-2.1-or-later</td><td>GNU LGPL v2.1 or later</td><td>Upgrade path</td></tr>
                          <tr><td className="py-1 font-mono">LGPL-3.0-only</td><td>GNU LGPL v3.0 only</td><td>Version locked</td></tr>
                          <tr><td className="py-1 font-mono">LGPL-3.0-or-later</td><td>GNU LGPL v3.0 or later</td><td>Upgrade path</td></tr>
                          <tr><td className="py-1 font-mono">MPL-1.1</td><td>Mozilla Public License 1.1</td><td>Older version</td></tr>
                          <tr><td className="py-1 font-mono">EPL-1.0</td><td>Eclipse Public License 1.0</td><td>IBM/Eclipse license</td></tr>
                          <tr><td className="py-1 font-mono">EPL-2.0</td><td>Eclipse Public License 2.0</td><td>Updated version</td></tr>
                          <tr><td className="py-1 font-mono">EUPL-1.2</td><td>European Union Public License 1.2</td><td>EU official license</td></tr>
                          <tr><td className="py-1 font-mono">CDDL-1.1</td><td>CDDL 1.1</td><td>Oracle's weak copyleft</td></tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-2 p-3 bg-yellow-100 dark:bg-yellow-900/40 rounded">
                      <p className="text-xs text-yellow-900 dark:text-yellow-100 font-semibold mb-1">Copy-paste ready (use wildcards for simplicity):</p>
                      <pre className="bg-yellow-900 dark:bg-yellow-950 text-yellow-100 p-2 rounded text-xs overflow-x-auto">
                        <code>{`"warn": [
  "LGPL-*", "MPL-*", "EPL-*", "EUPL-1.2", "CDDL-*"
]

// Or specific versions:
"warn": [
  "LGPL-2.1", "LGPL-2.1-only", "LGPL-2.1-or-later",
  "LGPL-3.0", "LGPL-3.0-only", "LGPL-3.0-or-later",
  "MPL-1.1", "MPL-2.0", "EPL-1.0", "EPL-2.0"
]`}</code>
                      </pre>
                    </div>
                  </div>

                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <h6 className="font-semibold text-red-900 dark:text-red-100 mb-2">Commercial-Incompatible Licenses (18 total - Blue Oak Lead)</h6>
                    <p className="text-sm text-red-800 dark:text-red-200 mb-3">
                      Strong copyleft - entire application source code must be released under same license. Incompatible with proprietary software:
                    </p>
                    <div className="overflow-x-auto mb-3">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-red-300 dark:border-red-700">
                            <th className="text-left py-2 text-red-900 dark:text-red-100">License ID</th>
                            <th className="text-left py-2 text-red-900 dark:text-red-100">Full Name</th>
                            <th className="text-left py-2 text-red-900 dark:text-red-100">Notes</th>
                          </tr>
                        </thead>
                        <tbody className="text-red-800 dark:text-red-200">
                          <tr><td className="py-1 font-mono font-bold">GPL-2.0</td><td>GNU GPL v2.0</td><td>Strong copyleft</td></tr>
                          <tr><td className="py-1 font-mono">GPL-2.0-only</td><td>GNU GPL v2.0 only</td><td>Version locked</td></tr>
                          <tr><td className="py-1 font-mono">GPL-2.0-or-later</td><td>GNU GPL v2.0 or later</td><td>Can upgrade to v3</td></tr>
                          <tr><td className="py-1 font-mono font-bold">GPL-3.0</td><td>GNU GPL v3.0</td><td>Updated strong copyleft</td></tr>
                          <tr><td className="py-1 font-mono">GPL-3.0-only</td><td>GNU GPL v3.0 only</td><td>Version locked</td></tr>
                          <tr><td className="py-1 font-mono">GPL-3.0-or-later</td><td>GNU GPL v3.0 or later</td><td>Future-proof</td></tr>
                          <tr><td className="py-1 font-mono font-bold">AGPL-3.0</td><td>GNU AGPL v3.0</td><td>Network copyleft (SaaS triggers)</td></tr>
                          <tr><td className="py-1 font-mono">AGPL-3.0-only</td><td>GNU AGPL v3.0 only</td><td>Version locked</td></tr>
                          <tr><td className="py-1 font-mono">AGPL-3.0-or-later</td><td>GNU AGPL v3.0 or later</td><td>Future-proof</td></tr>
                          <tr><td className="py-1 font-mono font-bold">SSPL-1.0</td><td>Server Side Public License v1</td><td>MongoDB, similar to AGPL</td></tr>
                          <tr><td className="py-1 font-mono">OSL-1.0</td><td>Open Software License 1.0</td><td>Academic strong copyleft</td></tr>
                          <tr><td className="py-1 font-mono">OSL-2.0</td><td>Open Software License 2.0</td><td>Updated version</td></tr>
                          <tr><td className="py-1 font-mono">RPSL-1.0</td><td>RealNetworks Public Source v1.0</td><td>Media software</td></tr>
                          <tr><td className="py-1 font-mono">SISSL</td><td>Sun Industry Standards v1.1</td><td>Sun Microsystems</td></tr>
                          <tr><td className="py-1 font-mono">Sleepycat</td><td>Sleepycat License</td><td>Berkeley DB</td></tr>
                          <tr><td className="py-1 font-mono">QPL-1.0</td><td>Q Public License 1.0</td><td>Qt older version</td></tr>
                          <tr><td className="py-1 font-mono">Watcom-1.0</td><td>Sybase Open Watcom v1.0</td><td>Compiler license</td></tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-2 p-3 bg-red-100 dark:bg-red-900/40 rounded">
                      <p className="text-xs text-red-900 dark:text-red-100 font-semibold mb-1">Copy-paste ready (wildcard shortcut recommended):</p>
                      <pre className="bg-red-900 dark:bg-red-950 text-red-100 p-2 rounded text-xs overflow-x-auto">
                        <code>{`// Simplest - wildcards cover all versions:
"deny": ["GPL-*", "AGPL-*", "SSPL-*"]

// Complete - all GPL/AGPL versions:
"deny": [
  "GPL-2.0", "GPL-2.0-only", "GPL-2.0-or-later",
  "GPL-3.0", "GPL-3.0-only", "GPL-3.0-or-later",
  "AGPL-3.0", "AGPL-3.0-only", "AGPL-3.0-or-later",
  "SSPL-1.0", "OSL-1.0", "OSL-2.0", "Sleepycat"
]`}</code>
                      </pre>
                    </div>
                    <div className="mt-2 p-3 bg-red-200 dark:bg-red-900/60 border border-red-400 dark:border-red-700 rounded">
                      <p className="text-xs text-red-900 dark:text-red-100">
                        <strong>⚠️ AGPL Warning for SaaS:</strong> If you offer software as a service (web app, API), AGPL treats network use as distribution - you MUST publish your entire application source code. Use <code className="bg-red-300 dark:bg-red-950 px-1 rounded">CC-BY-NC-*</code> in deny list to catch non-commercial variants too.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h6 className="font-semibold text-gray-900 dark:text-white mb-2">Quick Tips</h6>
                    <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Use wildcards for version matching: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">GPL-*</code> instead of listing every version</li>
                      <li>• Check patent clauses - Apache-2.0 includes explicit patent grant</li>
                      <li>• AGPL applies to SaaS - Network use = distribution</li>
                      <li>• LGPL dynamic linking - Usually safe if you don't modify the library</li>
                      <li>• Unknown licenses - Always review before allowing</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Configuration Presets</h5>
                <div className="space-y-4">
                  <div>
                    <h6 className="font-medium text-gray-900 dark:text-white mb-2">Strict Commercial Project</h6>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      Block all copyleft licenses for maximum commercial safety:
                    </p>
                    <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto text-xs">
                      <code>{`{
  "license": {
    "allow": ["MIT", "ISC", "BSD-2-Clause", "BSD-3-Clause", "Apache-2.0"],
    "deny": ["GPL-*", "AGPL-*", "LGPL-*", "SSPL-*"],
    "warnOnUnknown": true,
    "checkPatentClauses": true
  }
}`}</code>
                    </pre>
                  </div>
                  <div>
                    <h6 className="font-medium text-gray-900 dark:text-white mb-2">SaaS Project</h6>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      Extra protection against AGPL (network copyleft):
                    </p>
                    <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto text-xs">
                      <code>{`{
  "license": {
    "allow": ["MIT", "ISC", "Apache-2.0", "BSD-*"],
    "deny": ["GPL-*", "AGPL-*", "SSPL-*", "CC-BY-NC-*"],
    "warn": ["LGPL-*", "MPL-2.0"]
  }
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Patent Clauses</h5>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  30 licenses in our database include explicit patent grants that protect users from patent litigation. These licenses provide legal protection against the "submarine patent" problem:
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                    <h6 className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-1">Strong Protection</h6>
                    <p className="text-xs text-purple-800 dark:text-purple-200">
                      Apache-2.0, GPL-3.0, AGPL-3.0, MPL-2.0, EPL-2.0, OSL-3.0
                    </p>
                  </div>
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
                    <h6 className="text-sm font-semibold text-indigo-900 dark:text-indigo-100 mb-1">Moderate Protection</h6>
                    <p className="text-xs text-indigo-800 dark:text-indigo-200">
                      CPL-1.0, IPL-1.0, MS-PL, AFL-3.0, APL-1.0, CATOSL-1.1
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Modern Licenses (2020+)</h5>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  New licenses addressing modern business models like SaaS and cloud hosting:
                </p>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h6 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">BUSL-1.1 (Business Source License)</h6>
                    <p className="text-xs text-gray-700 dark:text-gray-300">
                      "Delayed open source" - Automatically converts to permissive license (typically Apache-2.0) after 3-4 years. Used by CockroachDB, MariaDB MaxScale.
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h6 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Elastic-2.0 (Elastic License)</h6>
                    <p className="text-xs text-gray-700 dark:text-gray-300">
                      Prohibits offering software as a managed service to third parties. Created to prevent AWS from offering Elasticsearch-as-a-Service.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Wildcard Support</h5>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  Use wildcards to match multiple license versions easily:
                </p>
                <ul className="list-disc pl-6 text-sm space-y-1 text-gray-700 dark:text-gray-300">
                  <li><code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">GPL-*</code> matches GPL-2.0, GPL-2.0-only, GPL-3.0, GPL-3.0-or-later</li>
                  <li><code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">LGPL-*</code> matches all LGPL variants</li>
                  <li><code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">CC-BY-NC-*</code> matches all Creative Commons NonCommercial licenses</li>
                  <li><code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">BSD-*</code> matches BSD-2-Clause, BSD-3-Clause, BSD-4-Clause</li>
                </ul>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Complete Reference:</strong> All 221 licenses follow the SPDX URL pattern:
                  <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded ml-1">https://spdx.org/licenses/[LICENSE-ID].html</code>
                  <br />
                  <span className="text-xs mt-2 inline-block">
                    Example: <a href="https://spdx.org/licenses/MIT.html" target="_blank" rel="noopener noreferrer" className="underline">MIT</a>,
                    <a href="https://spdx.org/licenses/Apache-2.0.html" target="_blank" rel="noopener noreferrer" className="underline ml-1">Apache-2.0</a>
                  </span>
                </p>
              </div>
            </div>
          ),
        },
        {
          id: 'scoring-system',
          title: 'Health Scoring Algorithm',
          content: (
            <div className="space-y-6">
              <div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Each package receives a health score from 0-100 based on 7 weighted dimensions. Customize the importance of each dimension using booster weights:
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
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Formula</h5>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <code className="text-sm text-purple-900 dark:text-purple-100">
                    Overall Score = Σ (Dimension Score × Booster Weight) / Σ (Booster Weights)
                  </code>
                  <p className="text-xs text-purple-800 dark:text-purple-200 mt-2">
                    Each dimension is scored 0-100, then multiplied by its booster weight. Default total weight sum: 15.0
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dimension Details</h5>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h6 className="font-semibold text-gray-900 dark:text-white mb-2">1. Age Score (Booster: 1.5x)</h6>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      How recently the package was updated:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded">
                        <div className="font-medium text-green-900 dark:text-green-100">&lt; 6 months</div>
                        <div className="text-green-700 dark:text-green-300">100 (Perfect)</div>
                      </div>
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded">
                        <div className="font-medium text-green-900 dark:text-green-100">&lt; 1 year</div>
                        <div className="text-green-700 dark:text-green-300">90 (Excellent)</div>
                      </div>
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded">
                        <div className="font-medium text-yellow-900 dark:text-yellow-100">&lt; 2 years</div>
                        <div className="text-yellow-700 dark:text-yellow-300">80 (Good)</div>
                      </div>
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded">
                        <div className="font-medium text-orange-900 dark:text-orange-100">&lt; 3 years</div>
                        <div className="text-orange-700 dark:text-orange-300">60 (Fair)</div>
                      </div>
                      <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded">
                        <div className="font-medium text-red-900 dark:text-red-100">&lt; 5 years</div>
                        <div className="text-red-700 dark:text-red-300">40 (Poor)</div>
                      </div>
                      <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded">
                        <div className="font-medium text-red-900 dark:text-red-100">≥ 5 years</div>
                        <div className="text-red-700 dark:text-red-300">20 (Critical)</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h6 className="font-semibold text-gray-900 dark:text-white mb-2">2. Deprecation Score (Booster: 4.0x - Highest)</h6>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      Binary: either perfect or fail. Highest booster weight because deprecated packages are critical risk:
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded">
                        <div className="font-medium text-red-900 dark:text-red-100">Deprecated</div>
                        <div className="text-red-700 dark:text-red-300">0 (Instant fail)</div>
                      </div>
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded">
                        <div className="font-medium text-green-900 dark:text-green-100">Not deprecated</div>
                        <div className="text-green-700 dark:text-green-300">100 (Perfect)</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h6 className="font-semibold text-gray-900 dark:text-white mb-2">3. License Score (Booster: 3.0x - High)</h6>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      License compatibility and quality (Blue Oak Council rating impact):
                    </p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between p-2 bg-green-100 dark:bg-green-900/30 rounded">
                        <span className="font-medium text-green-900 dark:text-green-100">Commercial-friendly (MIT, Apache-2.0)</span>
                        <span className="text-green-700 dark:text-green-300">100</span>
                      </div>
                      <div className="flex justify-between p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded">
                        <span className="font-medium text-yellow-900 dark:text-yellow-100">Commercial-warning (LGPL, MPL)</span>
                        <span className="text-yellow-700 dark:text-yellow-300">70</span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded">
                        <span className="font-medium text-gray-900 dark:text-gray-100">Unknown</span>
                        <span className="text-gray-700 dark:text-gray-300">50</span>
                      </div>
                      <div className="flex justify-between p-2 bg-red-100 dark:bg-red-900/30 rounded">
                        <span className="font-medium text-red-900 dark:text-red-100">Commercial-incompatible (GPL, AGPL)</span>
                        <span className="text-red-700 dark:text-red-300">30</span>
                      </div>
                      <div className="flex justify-between p-2 bg-red-100 dark:bg-red-900/30 rounded">
                        <span className="font-medium text-red-900 dark:text-red-100">Unlicensed</span>
                        <span className="text-red-700 dark:text-red-300">0</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      Blue Oak impact: Gold (0), Silver (-5), Bronze (-10), Lead (-20) | Patent clause: +5 points
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h6 className="font-semibold text-gray-900 dark:text-white mb-2">4. Vulnerability Score (Booster: 2.0x)</h6>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      Known security issues from GitHub Advisory Database:
                    </p>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between p-2 bg-red-100 dark:bg-red-900/30 rounded">
                        <span className="font-medium text-red-900 dark:text-red-100">Critical vulnerability</span>
                        <span className="text-red-700 dark:text-red-300">-30 points</span>
                      </div>
                      <div className="flex justify-between p-2 bg-orange-100 dark:bg-orange-900/30 rounded">
                        <span className="font-medium text-orange-900 dark:text-orange-100">High vulnerability</span>
                        <span className="text-orange-700 dark:text-orange-300">-15 points</span>
                      </div>
                      <div className="flex justify-between p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded">
                        <span className="font-medium text-yellow-900 dark:text-yellow-100">Medium vulnerability</span>
                        <span className="text-yellow-700 dark:text-yellow-300">-5 points</span>
                      </div>
                      <div className="flex justify-between p-2 bg-blue-100 dark:bg-blue-900/30 rounded">
                        <span className="font-medium text-blue-900 dark:text-blue-100">Low vulnerability</span>
                        <span className="text-blue-700 dark:text-blue-300">-1 point</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      Formula: 100 - (critical×30) - (high×15) - (medium×5) - (low×1)
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h6 className="font-semibold text-gray-900 dark:text-white mb-2">5. Popularity Score (Booster: 1.0x - Informational)</h6>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      Based on weekly npm downloads with trend adjustment:
                    </p>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded">
                        <span className="font-medium">≥ 10M/week</span>
                        <span>100</span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded">
                        <span className="font-medium">≥ 1M/week</span>
                        <span>95</span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded">
                        <span className="font-medium">≥ 100K/week</span>
                        <span>85</span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded">
                        <span className="font-medium">≥ 10K/week</span>
                        <span>70</span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded">
                        <span className="font-medium">≥ 1K/week</span>
                        <span>50</span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded">
                        <span className="font-medium">&lt; 1K/week</span>
                        <span>30</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      Trend: Growing (+5), Declining (-10)
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h6 className="font-semibold text-gray-900 dark:text-white mb-2">6. Repository Score (Booster: 2.0x)</h6>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      GitHub activity and health indicators (starts at 100, penalties/bonuses applied):
                    </p>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between p-2 bg-red-100 dark:bg-red-900/30 rounded">
                        <span className="font-medium text-red-900 dark:text-red-100">Archived</span>
                        <span className="text-red-700 dark:text-red-300">0 (instant fail)</span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded">
                        <span>Last commit &gt; 1 year</span>
                        <span>-30</span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded">
                        <span>Last commit &gt; 6 months</span>
                        <span>-15</span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded">
                        <span>&gt; 500 open issues</span>
                        <span>-20</span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded">
                        <span>&lt; 10 stars</span>
                        <span>-20</span>
                      </div>
                      <div className="flex justify-between p-2 bg-green-100 dark:bg-green-900/30 rounded">
                        <span className="font-medium text-green-900 dark:text-green-100">Last commit &lt; 30 days</span>
                        <span className="text-green-700 dark:text-green-300">+5 (bonus)</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h6 className="font-semibold text-gray-900 dark:text-white mb-2">7. Update Frequency Score (Booster: 1.5x)</h6>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      Average days between releases (last 12 months):
                    </p>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between p-2 bg-green-100 dark:bg-green-900/30 rounded">
                        <span className="font-medium text-green-900 dark:text-green-100">≤ 30 days (monthly+)</span>
                        <span className="text-green-700 dark:text-green-300">100</span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded">
                        <span>≤ 90 days (quarterly)</span>
                        <span>90</span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded">
                        <span>≤ 180 days (semi-annual)</span>
                        <span>70</span>
                      </div>
                      <div className="flex justify-between p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded">
                        <span>≤ 365 days (annual)</span>
                        <span>50</span>
                      </div>
                      <div className="flex justify-between p-2 bg-red-100 dark:bg-red-900/30 rounded">
                        <span>&gt; 365 days (rare)</span>
                        <span>30</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      Bonus: &gt; 20 releases/year → +10 points
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Rating Categories</h5>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="font-semibold text-green-900 dark:text-green-100">90-100: Excellent</div>
                    <p className="text-xs text-green-800 dark:text-green-200">Well-maintained, safe, recommended</p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="font-semibold text-blue-900 dark:text-blue-100">75-89: Good</div>
                    <p className="text-xs text-blue-800 dark:text-blue-200">Solid choice, minor concerns</p>
                  </div>
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="font-semibold text-yellow-900 dark:text-yellow-100">60-74: Fair</div>
                    <p className="text-xs text-yellow-800 dark:text-yellow-200">Acceptable but needs monitoring</p>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="font-semibold text-red-900 dark:text-red-100">0-59: Poor</div>
                    <p className="text-xs text-red-800 dark:text-red-200">High risk, consider alternatives</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Custom Booster Presets</h5>
                <div className="space-y-4">
                  <div>
                    <h6 className="font-medium text-gray-900 dark:text-white mb-2">Security-Focused</h6>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      Emphasize vulnerabilities and deprecation:
                    </p>
                    <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto text-xs">
                      <code>{`{
  "scoring": {
    "boosters": {
      "age": 1.0,
      "deprecation": 5.0,
      "license": 2.0,
      "vulnerability": 4.0,
      "popularity": 0.5,
      "repository": 1.5,
      "updateFrequency": 1.0
    }
  }
}`}</code>
                    </pre>
                  </div>
                  <div>
                    <h6 className="font-medium text-gray-900 dark:text-white mb-2">License-Focused</h6>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      Emphasize legal compliance for commercial projects:
                    </p>
                    <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto text-xs">
                      <code>{`{
  "scoring": {
    "boosters": {
      "age": 1.0,
      "deprecation": 3.0,
      "license": 5.0,
      "vulnerability": 2.0,
      "popularity": 0.5,
      "repository": 1.5,
      "updateFrequency": 1.0
    }
  }
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      id: 'use-cases',
      title: t('documentation.sections.useCases.title'),
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
      title: t('documentation.sections.integrations.title'),
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
                    <code>export GITHUB_TOKEN=YOUR_GITHUB_TOKEN_HERE</code>
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
      title: t('documentation.sections.outputs.title'),
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
                  href="/examples/express-project-outputs/scan-output-json.json"
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
                  href="/examples/express-project-outputs/scan-output-csv.csv"
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
                  href="/examples/express-project-outputs/scan-output-markdown.md"
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
                  href="/examples/express-project-outputs/scan-output-cli.txt"
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
      title: t('documentation.sections.troubleshooting.title'),
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
      title: t('documentation.sections.bestPractices.title'),
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
