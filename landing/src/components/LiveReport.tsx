import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiPackage, FiTerminal, FiCode, FiFileText } from 'react-icons/fi';

interface DependencyReport {
  package: string;
  version: string;
  license: string;
  age: string;
  score: number;
  status: 'ok' | 'warning' | 'critical';
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
          package: 'package-health-analyzer',
          version: '0.1.0',
          license: 'MIT',
          age: 'today',
          score: 98,
          status: 'ok',
        },
        {
          package: 'react',
          version: '19.2.1',
          license: 'MIT',
          age: 'today',
          score: 95,
          status: 'ok',
        },
        {
          package: 'react-dom',
          version: '19.2.1',
          license: 'MIT',
          age: 'today',
          score: 95,
          status: 'ok',
        },
        {
          package: 'react-i18next',
          version: '16.4.0',
          license: 'MIT',
          age: '3 days',
          score: 95,
          status: 'ok',
        },
        {
          package: 'react-icons',
          version: '5.5.0',
          license: 'MIT',
          age: '9 months',
          score: 95,
          status: 'ok',
        },
        {
          package: 'react-markdown',
          version: '10.1.0',
          license: 'MIT',
          age: '9 months',
          score: 95,
          status: 'ok',
        },
        {
          package: 'i18next',
          version: '25.7.2',
          license: 'MIT',
          age: 'today',
          score: 95,
          status: 'ok',
        },
        {
          package: 'vite',
          version: '7.2.7',
          license: 'MIT',
          age: '< 1 week',
          score: 96,
          status: 'ok',
        },
        {
          package: 'tailwindcss',
          version: '3.4.18',
          license: 'MIT',
          age: '< 1 week',
          score: 97,
          status: 'ok',
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
              {t('liveReport.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              {t('liveReport.subtitle')}
            </p>
            <p className="text-base text-gray-700 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
              {t('liveReport.description')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-3 mb-2">
                  <FiTerminal className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h3 className="font-semibold text-green-900 dark:text-green-100">CLI</h3>
                </div>
                <p className="text-sm text-green-800 dark:text-green-200">
                  {t('liveReport.formats.cli')}
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-3 mb-2">
                  <FiCode className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">JSON</h3>
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {t('liveReport.formats.json')}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center space-x-3 mb-2">
                  <FiFileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <h3 className="font-semibold text-purple-900 dark:text-purple-100">CSV</h3>
                </div>
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  {t('liveReport.formats.csv')}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                            {dep.package}
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

              <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                <div className="flex items-start space-x-3">
                  <FiInfo className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      {t('liveReport.noteTitle')}
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      {t('liveReport.noteDescription')}
                    </p>
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
