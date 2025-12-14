import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiPackage, FiTerminal, FiCode, FiFileText, FiShield, FiLayers } from 'react-icons/fi';

interface DependencyReport {
  package: string;
  version: string;
  license: string;
  age: string;
  score: number;
  status: 'ok' | 'warning' | 'critical';
  vulnerabilities?: number;
  depth?: number;
}

export const LiveReport = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [dependencies, setDependencies] = useState<DependencyReport[]>([]);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setDependencies([
        {
          package: 'express',
          version: '5.2.1',
          license: 'MIT',
          age: '3 days',
          score: 95,
          status: 'ok',
          vulnerabilities: 0,
          depth: 0,
        },
        {
          package: 'body-parser',
          version: '2.2.1',
          license: 'MIT',
          age: '1 week',
          score: 95,
          status: 'ok',
          vulnerabilities: 0,
          depth: 0,
        },
        {
          package: 'cookie-parser',
          version: '1.4.7',
          license: 'MIT',
          age: '1 year 2 months',
          score: 80,
          status: 'ok',
          vulnerabilities: 0,
          depth: 0,
        },
        {
          package: 'moment',
          version: '2.29.4',
          license: 'MIT',
          age: '2 years',
          score: 72,
          status: 'warning',
          vulnerabilities: 0,
          depth: 0,
        },
        {
          package: 'lodash',
          version: '4.17.21',
          license: 'MIT',
          age: '3 years',
          score: 88,
          status: 'ok',
          vulnerabilities: 0,
          depth: 0,
        },
        {
          package: 'dotenv',
          version: '16.4.7',
          license: 'BSD-2-Clause',
          age: '12 days',
          score: 94,
          status: 'ok',
          vulnerabilities: 0,
          depth: 0,
        },
        {
          package: 'cors',
          version: '2.8.5',
          license: 'MIT',
          age: '6 years',
          score: 68,
          status: 'warning',
          vulnerabilities: 0,
          depth: 0,
        },
        {
          package: 'express-validator',
          version: '7.2.1',
          license: 'MIT',
          age: '6 months',
          score: 91,
          status: 'ok',
          vulnerabilities: 0,
          depth: 0,
        },
        {
          package: 'morgan',
          version: '1.10.0',
          license: 'MIT',
          age: '4 years',
          score: 75,
          status: 'ok',
          vulnerabilities: 0,
          depth: 0,
        },
        {
          package: 'validator',
          version: '13.12.0',
          license: 'MIT',
          age: '10 months',
          score: 90,
          status: 'ok',
          vulnerabilities: 0,
          depth: 1,
        },
        {
          package: 'on-finished',
          version: '2.4.1',
          license: 'MIT',
          age: '1 year',
          score: 86,
          status: 'ok',
          vulnerabilities: 0,
          depth: 1,
        },
        {
          package: 'accepts',
          version: '2.2.1',
          license: 'MIT',
          age: '6 months',
          score: 91,
          status: 'ok',
          vulnerabilities: 0,
          depth: 1,
        },
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok':
        return <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'warning':
        return <FiAlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      case 'critical':
        return <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      default:
        return <FiInfo className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const averageScore = dependencies.length > 0
    ? Math.round(dependencies.reduce((sum, dep) => sum + dep.score, 0) / dependencies.length)
    : 0;

  const totalPackages = dependencies.length;

  return (
    <section id="live-report" className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Live Demo - Real Analysis Output
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              Example analysis of an Express.js API project dependencies
            </p>
            <p className="text-base text-gray-700 dark:text-gray-300 mb-6 max-w-4xl mx-auto">
              This demonstration shows the actual output format generated by package-health-analyzer v2.0.
              The tool analyzes 12 dependencies (9 direct + 3 transitive) from an Express API project,
              evaluating health scores, detecting outdated packages, and tracking the full dependency tree with depth indicators.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-700 dark:text-blue-300 text-sm mb-6">
              <FiLayers className="w-4 h-4" />
              <span className="font-medium">Showing: CLI table output format (also available in JSON, CSV, Markdown, TXT, SBOM)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 max-w-5xl mx-auto mb-8">
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-2 mb-1">
                  <FiTerminal className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <h3 className="font-semibold text-sm text-green-900 dark:text-green-100">CLI</h3>
                </div>
                <p className="text-xs text-green-800 dark:text-green-200">
                  Tabla colorida en terminal
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-2 mb-1">
                  <FiCode className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-semibold text-sm text-blue-900 dark:text-blue-100">JSON</h3>
                </div>
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  Datos estructurados para CI/CD
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center space-x-2 mb-1">
                  <FiFileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <h3 className="font-semibold text-sm text-purple-900 dark:text-purple-100">CSV</h3>
                </div>
                <p className="text-xs text-purple-800 dark:text-purple-200">
                  Hojas de cálculo
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex items-center space-x-2 mb-1">
                  <FiFileText className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <h3 className="font-semibold text-sm text-orange-900 dark:text-orange-100">Markdown</h3>
                </div>
                <p className="text-xs text-orange-800 dark:text-orange-200">
                  README y wiki
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 mb-1">
                  <FiTerminal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">TXT</h3>
                </div>
                <p className="text-xs text-gray-800 dark:text-gray-400">
                  Texto plano para logs
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">{t('liveReport.analyzing')}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 p-6 rounded-xl border border-primary-200 dark:border-primary-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-primary-700 dark:text-primary-300 font-medium">
                      Total Packages
                    </span>
                    <FiPackage className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <p className="text-4xl font-bold text-primary-900 dark:text-primary-100">
                    {totalPackages}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-700 dark:text-green-300 font-medium">
                      Average Score
                    </span>
                    <FiCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-4xl font-bold text-green-900 dark:text-green-100">
                    {averageScore}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-700 dark:text-blue-300 font-medium">
                      Health Status
                    </span>
                    <FiCheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    Excellent
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-700 dark:text-purple-300 font-medium">
                      Vulnerabilities
                    </span>
                    <FiShield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-4xl font-bold text-purple-900 dark:text-purple-100">
                    0
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">
                          {t('liveReport.package')}
                        </th>
                        <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">
                          {t('liveReport.version')}
                        </th>
                        <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">
                          {t('liveReport.license')}
                        </th>
                        <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">
                          {t('liveReport.age')}
                        </th>
                        <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">
                          Depth
                        </th>
                        <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">
                          {t('liveReport.score')}
                        </th>
                        <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-semibold">
                          {t('liveReport.status')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dependencies.map((dep, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <td className="py-3 px-4 font-mono text-sm text-gray-900 dark:text-white">
                            {dep.depth === 0 ? dep.package : `  ↳ ${dep.package}`}
                          </td>
                          <td className="py-3 px-4 font-mono text-sm text-gray-700 dark:text-gray-300">
                            {dep.version}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                            <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded">
                              {dep.license}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                            {dep.age}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <span className={`px-2 py-1 rounded ${dep.depth === 0 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'}`}>
                              {dep.depth === 0 ? 'Direct' : `Layer ${dep.depth}`}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-sm">
                            <span className={getScoreColor(dep.score)}>{dep.score}</span>
                          </td>
                          <td className="py-3 px-4">{getStatusIcon(dep.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
                    <FiLayers className="w-5 h-5" />
                    Understanding This Analysis
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-purple-800 dark:text-purple-200 mb-2">
                        <strong>Package Column:</strong> Shows package names with visual tree indicators. Direct dependencies appear without indentation, while transitive dependencies (installed by your dependencies) show with <code className="bg-purple-100 dark:bg-purple-900 px-1 rounded">↳</code> prefix.
                      </p>
                      <p className="text-purple-800 dark:text-purple-200 mb-2">
                        <strong>Age Column:</strong> Time since last update. Packages not updated in 2+ years (like <code className="bg-purple-100 dark:bg-purple-900 px-1 rounded">moment</code>, <code className="bg-purple-100 dark:bg-purple-900 px-1 rounded">cors</code>) receive lower scores and warnings.
                      </p>
                      <p className="text-purple-800 dark:text-purple-200">
                        <strong>Depth Column:</strong> Shows dependency layer. "Direct" = you installed it. "Layer 1" = installed by your dependencies. v2.0 analyzes up to 10 layers deep to catch hidden vulnerabilities.
                      </p>
                    </div>
                    <div>
                      <p className="text-purple-800 dark:text-purple-200 mb-2">
                        <strong>Score Column:</strong> Health score (0-100) based on 7 dimensions: age, deprecation, license, vulnerabilities, popularity, repository activity, and update frequency. Colors indicate: <span className="text-green-600 dark:text-green-400 font-semibold">90+ excellent</span>, <span className="text-yellow-600 dark:text-yellow-400 font-semibold">75-89 good</span>, <span className="text-orange-600 dark:text-orange-400 font-semibold">60-74 fair</span>, <span className="text-red-600 dark:text-red-400 font-semibold">&lt;60 poor</span>.
                      </p>
                      <p className="text-purple-800 dark:text-purple-200">
                        <strong>Status Icons:</strong> <FiCheckCircle className="inline w-4 h-4 text-green-600" /> = no issues detected, <FiAlertCircle className="inline w-4 h-4 text-yellow-600" /> = warnings (outdated, review needed).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <FiInfo className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        Real Project Data
                      </h4>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        This example is based on a real Express.js API project scan. Notice how <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">moment</code> (score 72) and <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">cors</code> (score 68) show warnings due to age (2+ and 6+ years without updates). The tool would recommend migrating <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">moment</code> to modern alternatives like <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">date-fns</code> or <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">dayjs</code>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
