import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface LicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LicenseModal = ({ isOpen, onClose }: LicenseModalProps) => {
  const { t } = useTranslation();
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('licenseModal.title')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-8">
          {/* How to Use */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('licenseModal.howToUse')}</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              {t('licenseModal.howToUseDescription')}
            </p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`{
  "license": {
    "allow": ["MIT", "Apache-2.0"],
    "deny": ["GPL-2.0", "AGPL-3.0"],
    "warn": ["LGPL-3.0"]
  }
}`}</code>
            </pre>
          </section>

          {/* Commercial-Friendly */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t('licenseModal.commercialFriendly')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {t('licenseModal.commercialFriendlyDescription')}
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">{t('licenseModal.tableHeaders.licenseId')}</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">{t('licenseModal.tableHeaders.fullName')}</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">{t('licenseModal.tableHeaders.notes')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {[
                    'MIT', 'Apache-2.0', 'BSD-3-Clause', 'BSD-2-Clause', '0BSD', 'Unlicense', 'ISC', 'Zlib',
                    'Python-2.0', 'PostgreSQL', 'NCSA', 'X11', 'CC0-1.0', 'BSL-1.0', 'Ruby', 'PHP-3.01',
                    'Apache-1.0', 'Apache-1.1', 'BSD-1-Clause', 'MIT-0',
                  ].map((id) => (
                    <tr key={id}>
                      <td className="px-4 py-3">
                        <code className="text-sm text-primary-600 dark:text-primary-400 font-mono">{id}</code>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{t(`licenseModal.licenseDescriptions.${id}.name`)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{t(`licenseModal.licenseDescriptions.${id}.note`)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <details className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400">
                {t('licenseModal.goldLicensesExpand')}
              </summary>
              <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {['MIT', 'Apache-2.0', 'BSD-3-Clause', 'BSD-2-Clause', '0BSD', 'Unlicense', 'ISC', 'Zlib',
                  'Python-2.0', 'PostgreSQL', 'NCSA', 'X11', 'CC0-1.0', 'BSL-1.0', 'WTFPL', 'AFL-3.0',
                  'Artistic-2.0', 'CDDL-1.0', 'ECL-2.0', 'EFL-2.0', 'MirOS', 'MS-PL', 'NTP', 'OFL-1.1',
                  'OSL-3.0', 'UPL-1.0', 'Apache-1.0', 'Apache-1.1', 'Artistic-1.0', 'BSD-1-Clause',
                  'BSD-4-Clause', 'BUSL-1.1', 'CC-BY-4.0', 'CDDL-1.1', 'CPL-1.0', 'Elastic-2.0', 'FTL',
                  'Intel', 'Libpng', 'MIT-0', 'MPL-1.1', 'MPL-2.0', 'OpenSSL', 'W3C', 'ZPL-2.1', 'Vim', 'Ruby', 'PHP-3.01'].map(id => (
                  <code key={id} className="text-xs font-mono text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-800 p-1 rounded">
                    {id}
                  </code>
                ))}
              </div>
            </details>

            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t('licenseModal.copyPasteTop16')}</h4>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`"allow": [
  "MIT", "ISC", "BSD-2-Clause", "BSD-3-Clause", "0BSD",
  "Apache-2.0", "Apache-1.1", "Unlicense", "CC0-1.0",
  "Zlib", "BSL-1.0", "Python-2.0", "Ruby", "PHP-3.01",
  "PostgreSQL", "X11"
]`}</code>
              </pre>
            </div>
          </section>

          {/* Commercial-Warning */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t('licenseModal.commercialWarning')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {t('licenseModal.commercialWarningDescription')}
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">{t('licenseModal.tableHeaders.licenseId')}</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">{t('licenseModal.tableHeaders.fullName')}</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">{t('licenseModal.tableHeaders.notes')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {[
                    'LGPL-2.1', 'LGPL-2.1-only', 'LGPL-2.1-or-later',
                    'LGPL-3.0', 'LGPL-3.0-only', 'LGPL-3.0-or-later',
                    'MPL-1.1', 'MPL-2.0',
                    'EPL-1.0', 'EPL-2.0',
                    'EUPL-1.2', 'CDDL-1.1',
                  ].map((id) => (
                    <tr key={id}>
                      <td className="px-4 py-3">
                        <code className="text-sm text-yellow-600 dark:text-yellow-400 font-mono">{id}</code>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{t(`licenseModal.licenseDescriptions.${id}.name`)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{t(`licenseModal.licenseDescriptions.${id}.note`)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t('licenseModal.copyPasteBronze')}</h4>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`"warn": [
  "LGPL-2.1", "LGPL-2.1-only", "LGPL-2.1-or-later",
  "LGPL-3.0", "LGPL-3.0-only", "LGPL-3.0-or-later",
  "MPL-1.1", "MPL-2.0",
  "EPL-1.0", "EPL-2.0",
  "EUPL-1.2", "CDDL-1.1"
]`}</code>
              </pre>
            </div>
          </section>

          {/* Commercial-Incompatible */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t('licenseModal.commercialIncompatible')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {t('licenseModal.commercialIncompatibleDescription')}
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">{t('licenseModal.tableHeaders.licenseId')}</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">{t('licenseModal.tableHeaders.fullName')}</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">{t('licenseModal.tableHeaders.notes')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {[
                    'GPL-2.0', 'GPL-2.0-only', 'GPL-2.0-or-later',
                    'GPL-3.0', 'GPL-3.0-only', 'GPL-3.0-or-later',
                    'AGPL-3.0', 'AGPL-3.0-only', 'AGPL-3.0-or-later',
                    'SSPL-1.0', 'OSL-1.0', 'OSL-2.0',
                    'RPSL-1.0', 'SISSL', 'Sleepycat',
                    'QPL-1.0', 'Watcom-1.0', 'EUPL-1.1',
                  ].map((id) => (
                    <tr key={id}>
                      <td className="px-4 py-3">
                        <code className="text-sm text-red-600 dark:text-red-400 font-mono">{id}</code>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{t(`licenseModal.licenseDescriptions.${id}.name`)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{t(`licenseModal.licenseDescriptions.${id}.note`)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t('licenseModal.copyPasteLead')}</h4>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`"deny": [
  "GPL-2.0", "GPL-2.0-only", "GPL-2.0-or-later",
  "GPL-3.0", "GPL-3.0-only", "GPL-3.0-or-later",
  "AGPL-3.0", "AGPL-3.0-only", "AGPL-3.0-or-later",
  "SSPL-1.0", "OSL-1.0", "OSL-2.0",
  "RPSL-1.0", "SISSL", "Sleepycat",
  "QPL-1.0", "Watcom-1.0", "EUPL-1.1"
]`}</code>
              </pre>
            </div>
          </section>

          {/* Configuration Examples */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t('licenseModal.configurationExamples')}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {t('licenseModal.configurationExamplesDescription')}
            </p>

            <div className="space-y-4">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t('licenseModal.configExample1Title')}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{t('licenseModal.configExample1Description')}</p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`{
  "license": {
    "allow": ["MIT", "ISC", "BSD-2-Clause", "BSD-3-Clause", "Apache-2.0"],
    "deny": ["GPL-*", "AGPL-*", "LGPL-*", "SSPL-*"],
    "warn": [],
    "warnOnUnknown": true,
    "checkPatentClauses": true
  }
}`}</code>
                </pre>
              </div>

              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t('licenseModal.configExample2Title')}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{t('licenseModal.configExample2Description')}</p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`{
  "license": {
    "allow": ["MIT", "ISC", "Apache-2.0", "BSD-*"],
    "deny": ["GPL-*", "AGPL-*", "SSPL-*"],
    "warn": ["LGPL-*", "MPL-2.0", "EPL-*"],
    "warnOnUnknown": true
  }
}`}</code>
                </pre>
              </div>

              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t('licenseModal.configExample3Title')}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{t('licenseModal.configExample3Description')}</p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`{
  "license": {
    "allow": ["MIT", "ISC", "Apache-2.0", "BSD-*"],
    "deny": ["GPL-*", "AGPL-*", "SSPL-*", "CC-BY-NC-*"],
    "warn": ["LGPL-*", "MPL-2.0"],
    "warnOnUnknown": true
  }
}`}</code>
                </pre>
              </div>
            </div>
          </section>

          {/* Quick Tips */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('licenseModal.quickTips')}</h3>
            <ul className="space-y-2">
              {[
                t('licenseModal.quickTip1'),
                t('licenseModal.quickTip2'),
                t('licenseModal.quickTip3'),
                t('licenseModal.quickTip4'),
                t('licenseModal.quickTip5'),
                t('licenseModal.quickTip6'),
                t('licenseModal.quickTip7'),
                t('licenseModal.quickTip8'),
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary-600 dark:text-primary-400 font-bold mt-1">•</span>
                  <span className="text-gray-700 dark:text-gray-300">{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            {t('licenseModal.closeButton')}
          </button>
        </div>
      </div>
    </div>
  );
};
