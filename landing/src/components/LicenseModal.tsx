import { X } from 'lucide-react';
import { useEffect } from 'react';

interface LicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LicenseModal = ({ isOpen, onClose }: LicenseModalProps) => {
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
            License Reference Guide
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
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Copy the license identifier exactly as shown below to your <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">.packagehealthanalyzerrc.json</code>:
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
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              <strong>Wildcards supported:</strong> Use <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">*</code> to match multiple versions (e.g., <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">GPL-*</code> matches GPL-2.0, GPL-3.0, etc.)
            </p>
          </section>

          {/* Commercial-Friendly */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Commercial-Friendly Licenses
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              These licenses are safe for commercial/proprietary projects.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">License ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Full Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {[
                    ['MIT', 'MIT License', 'Most popular, very permissive'],
                    ['ISC', 'ISC License', 'Similar to MIT, slightly simpler'],
                    ['BSD-2-Clause', 'BSD 2-Clause "Simplified"', 'Permissive with attribution'],
                    ['BSD-3-Clause', 'BSD 3-Clause "New"', 'Adds non-endorsement clause'],
                    ['0BSD', 'BSD Zero Clause', 'Public domain equivalent'],
                    ['Apache-2.0', 'Apache License 2.0', 'Permissive with patent grant'],
                    ['Unlicense', 'The Unlicense', 'Public domain dedication'],
                    ['CC0-1.0', 'Creative Commons Zero v1.0', 'Public domain waiver'],
                    ['Zlib', 'zlib License', 'Permissive for software'],
                    ['BSL-1.0', 'Boost Software License 1.0', 'Permissive for C++ libraries'],
                    ['Python-2.0', 'Python Software Foundation License', 'Python-specific'],
                    ['Ruby', 'Ruby License', 'Ruby-specific'],
                    ['PHP-3.01', 'PHP License v3.01', 'PHP-specific'],
                  ].map(([id, name, note]) => (
                    <tr key={id}>
                      <td className="px-4 py-3">
                        <code className="text-sm text-primary-600 dark:text-primary-400 font-mono">{id}</code>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Copy-paste ready list:</h4>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`"allow": [
  "MIT", "ISC", "BSD-2-Clause", "BSD-3-Clause", "0BSD",
  "Apache-2.0", "Unlicense", "CC0-1.0", "Zlib", "BSL-1.0",
  "Python-2.0", "Ruby", "PHP-3.01"
]`}</code>
              </pre>
            </div>
          </section>

          {/* Commercial-Warning */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Commercial-Warning Licenses
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              These licenses require legal review for commercial use (weak copyleft).
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">License ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Full Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {[
                    ['LGPL-2.1', 'GNU Lesser General Public License v2.1', 'Dynamic linking allowed'],
                    ['LGPL-3.0', 'GNU Lesser General Public License v3.0', 'Updated version, GPLv3 compatible'],
                    ['MPL-2.0', 'Mozilla Public License 2.0', 'File-level copyleft'],
                    ['EPL-1.0', 'Eclipse Public License 1.0', 'Weak copyleft, commercial-friendly'],
                    ['EPL-2.0', 'Eclipse Public License 2.0', 'Updated version'],
                    ['CDDL-1.0', 'Common Development and Distribution License 1.0', "Oracle's weak copyleft"],
                    ['CPL-1.0', 'Common Public License 1.0', "IBM's weak copyleft"],
                    ['APSL-2.0', 'Apple Public Source License 2.0', "Apple's weak copyleft"],
                  ].map(([id, name, note]) => (
                    <tr key={id}>
                      <td className="px-4 py-3">
                        <code className="text-sm text-yellow-600 dark:text-yellow-400 font-mono">{id}</code>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Copy-paste ready list:</h4>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`"warn": [
  "LGPL-2.1", "LGPL-3.0", "MPL-2.0",
  "EPL-1.0", "EPL-2.0", "CDDL-1.0",
  "CPL-1.0", "APSL-2.0"
]`}</code>
              </pre>
            </div>
          </section>

          {/* Commercial-Incompatible */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Commercial-Incompatible Licenses
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              These licenses require derivative works to be open-sourced (strong copyleft).
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">License ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Full Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {[
                    ['GPL-2.0', 'GNU General Public License v2.0', 'Strong copyleft'],
                    ['GPL-2.0-only', 'GNU General Public License v2.0 only', 'Explicit version lock'],
                    ['GPL-2.0-or-later', 'GNU General Public License v2.0 or later', 'Can upgrade to v3'],
                    ['GPL-3.0', 'GNU General Public License v3.0', 'Updated strong copyleft'],
                    ['GPL-3.0-only', 'GNU General Public License v3.0 only', 'Explicit version lock'],
                    ['GPL-3.0-or-later', 'GNU General Public License v3.0 or later', 'Future-proof'],
                    ['AGPL-3.0', 'GNU Affero General Public License v3.0', 'Network copyleft (SaaS must open source)'],
                    ['AGPL-3.0-only', 'GNU Affero General Public License v3.0 only', 'Explicit version lock'],
                    ['AGPL-3.0-or-later', 'GNU Affero General Public License v3.0 or later', 'Future-proof'],
                    ['SSPL-1.0', 'Server Side Public License v1', "MongoDB's license, similar to AGPL"],
                  ].map(([id, name, note]) => (
                    <tr key={id}>
                      <td className="px-4 py-3">
                        <code className="text-sm text-red-600 dark:text-red-400 font-mono">{id}</code>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Copy-paste ready list:</h4>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`"deny": [
  "GPL-2.0", "GPL-2.0-only", "GPL-2.0-or-later",
  "GPL-3.0", "GPL-3.0-only", "GPL-3.0-or-later",
  "AGPL-3.0", "AGPL-3.0-only", "AGPL-3.0-or-later",
  "SSPL-1.0"
]`}</code>
              </pre>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                <strong>Wildcard shortcuts:</strong>
              </p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm mt-2">
                <code>{`"deny": ["GPL-*", "AGPL-*", "SSPL-*"]`}</code>
              </pre>
            </div>
          </section>

          {/* Configuration Examples */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Configuration Examples
            </h3>

            <div className="space-y-4">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Strict Commercial Project</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Block all copyleft licenses:</p>
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
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Balanced Commercial Project</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Allow weak copyleft, block strong:</p>
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
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">SaaS Project</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Extra AGPL protection:</p>
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
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Tips</h3>
            <ul className="space-y-2">
              {[
                'Use wildcards for version matching: GPL-* instead of listing every version',
                'Check patent clauses - Apache-2.0 includes explicit patent grant',
                'AGPL applies to SaaS - Network use = distribution',
                'LGPL dynamic linking - Usually safe if you don\'t modify the library',
                'Unknown licenses - Always review before allowing',
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
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
