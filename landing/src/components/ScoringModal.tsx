import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ScoringModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScoringModal = ({ isOpen, onClose }: ScoringModalProps) => {
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
            Health Scoring Algorithm
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
          {/* Overview */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Overview</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Each package receives a <strong>health score from 0-100</strong> based on 7 weighted dimensions:
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { name: 'Age', desc: 'How recently the package was updated' },
                { name: 'Deprecation', desc: 'Official deprecation status' },
                { name: 'License', desc: 'License compatibility and quality' },
                { name: 'Vulnerability', desc: 'Known security issues' },
                { name: 'Popularity', desc: 'Download statistics and trends' },
                { name: 'Repository', desc: 'GitHub activity and health' },
                { name: 'Update Frequency', desc: 'Maintenance consistency' },
              ].map((dim) => (
                <div key={dim.name} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <strong className="text-primary-600 dark:text-primary-400">{dim.name}</strong>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{dim.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Formula */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Formula</h3>
            <div className="bg-gray-900 text-gray-100 p-6 rounded-lg">
              <code className="text-lg">Overall Score = Σ (Dimension Score × Booster Weight) / Σ (Booster Weights)</code>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
              Each dimension is scored 0-100, then multiplied by its booster weight.
            </p>

            <h4 className="font-semibold text-gray-900 dark:text-white mt-6 mb-3">Default Booster Weights</h4>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Dimension</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Weight</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Importance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {[
                    ['age', '1.5', 'Moderate'],
                    ['deprecation', '4.0', 'Highest - critical risk'],
                    ['license', '3.0', 'High - commercial safety'],
                    ['vulnerability', '2.0', 'Important - security'],
                    ['popularity', '1.0', 'Informational - least important'],
                    ['repository', '2.0', 'Important - maintenance indicator'],
                    ['updateFrequency', '1.5', 'Moderate'],
                  ].map(([dim, weight, imp]) => (
                    <tr key={dim}>
                      <td className="px-4 py-3">
                        <code className="text-sm text-primary-600 dark:text-primary-400 font-mono">{dim}</code>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 font-semibold">{weight}x</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{imp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              <strong>Total weight sum:</strong> 15.0 (default)
            </p>
          </section>

          {/* Dimension Calculations */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Dimension Calculations</h3>

            {/* Age Score */}
            <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">1. Age Score</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <span>&lt; 6 months</span>
                  <strong className="text-green-600 dark:text-green-400">100 (Perfect)</strong>
                </div>
                <div className="flex justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <span>&lt; 1 year</span>
                  <strong className="text-green-600 dark:text-green-400">90 (Excellent)</strong>
                </div>
                <div className="flex justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <span>&lt; 2 years</span>
                  <strong className="text-blue-600 dark:text-blue-400">80 (Good)</strong>
                </div>
                <div className="flex justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                  <span>&lt; 3 years</span>
                  <strong className="text-yellow-600 dark:text-yellow-400">60 (Fair)</strong>
                </div>
                <div className="flex justify-between p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                  <span>&lt; 5 years</span>
                  <strong className="text-orange-600 dark:text-orange-400">40 (Poor)</strong>
                </div>
                <div className="flex justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded">
                  <span>≥ 5 years</span>
                  <strong className="text-red-600 dark:text-red-400">20 (Critical)</strong>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Booster: 1.5x | If deprecated: score = 0
              </p>
            </div>

            {/* Deprecation Score */}
            <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">2. Deprecation Score</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Binary: either perfect or fail.</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded">
                  <span>Deprecated</span>
                  <strong className="text-red-600 dark:text-red-400">0</strong>
                </div>
                <div className="flex justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <span>Not deprecated</span>
                  <strong className="text-green-600 dark:text-green-400">100</strong>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Booster: 4.0x (highest importance - deprecated packages are critical risk)
              </p>
            </div>

            {/* License Score */}
            <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">3. License Score</h4>
              <div className="space-y-2 text-sm mb-3">
                <div className="flex justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <span>Commercial-friendly (MIT, Apache-2.0, etc.)</span>
                  <strong className="text-green-600 dark:text-green-400">100</strong>
                </div>
                <div className="flex justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                  <span>Commercial-warning (LGPL, MPL, etc.)</span>
                  <strong className="text-yellow-600 dark:text-yellow-400">70</strong>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded">
                  <span>Unknown</span>
                  <strong className="text-gray-600 dark:text-gray-400">50</strong>
                </div>
                <div className="flex justify-between p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                  <span>Commercial-incompatible (GPL, AGPL)</span>
                  <strong className="text-orange-600 dark:text-orange-400">30</strong>
                </div>
                <div className="flex justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded">
                  <span>Unlicensed</span>
                  <strong className="text-red-600 dark:text-red-400">0</strong>
                </div>
              </div>
              <p className="text-xs text-gray-700 dark:text-gray-300 mb-1">
                <strong>Blue Oak Rating impact:</strong> Gold (0), Silver (-5), Bronze (-10), Lead (-20)
              </p>
              <p className="text-xs text-gray-700 dark:text-gray-300">
                <strong>Patent clause:</strong> +5 points (Apache-2.0, EPL)
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Booster: 3.0x (high importance for commercial projects)
              </p>
            </div>

            {/* Vulnerability Score */}
            <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">4. Vulnerability Score</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                Formula: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">100 - (critical×30) - (high×15) - (medium×5) - (low×1)</code>
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded">
                  <span>Critical vulnerability</span>
                  <strong className="text-red-600 dark:text-red-400">-30 points</strong>
                </div>
                <div className="flex justify-between p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                  <span>High vulnerability</span>
                  <strong className="text-orange-600 dark:text-orange-400">-15 points</strong>
                </div>
                <div className="flex justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                  <span>Medium vulnerability</span>
                  <strong className="text-yellow-600 dark:text-yellow-400">-5 points</strong>
                </div>
                <div className="flex justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <span>Low vulnerability</span>
                  <strong className="text-blue-600 dark:text-blue-400">-1 point</strong>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Booster: 2.0x | Example: 1 critical + 2 high = 40 score
              </p>
            </div>

            {/* Popularity Score */}
            <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">5. Popularity Score</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Based on weekly downloads:</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <span>≥ 10M/week</span>
                  <strong className="text-green-600 dark:text-green-400">100</strong>
                </div>
                <div className="flex justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <span>≥ 1M/week</span>
                  <strong className="text-green-600 dark:text-green-400">95</strong>
                </div>
                <div className="flex justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <span>≥ 100K/week</span>
                  <strong className="text-blue-600 dark:text-blue-400">85</strong>
                </div>
                <div className="flex justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                  <span>≥ 10K/week</span>
                  <strong className="text-yellow-600 dark:text-yellow-400">70</strong>
                </div>
                <div className="flex justify-between p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                  <span>≥ 1K/week</span>
                  <strong className="text-orange-600 dark:text-orange-400">50</strong>
                </div>
                <div className="flex justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded">
                  <span>&lt; 1K/week</span>
                  <strong className="text-red-600 dark:text-red-400">30</strong>
                </div>
              </div>
              <p className="text-xs text-gray-700 dark:text-gray-300 mt-2">
                <strong>Trend adjustment:</strong> Growing (+5), Declining (-10)
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Booster: 1.0x (informational, least important)
              </p>
            </div>

            {/* Repository Score */}
            <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">6. Repository Score</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                Starts at 100, then penalties/bonuses applied:
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded">
                  <span>Archived</span>
                  <strong className="text-red-600 dark:text-red-400">0 (instant fail)</strong>
                </div>
                <div className="flex justify-between p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                  <span>&lt; 10 stars</span>
                  <strong className="text-orange-600 dark:text-orange-400">-20</strong>
                </div>
                <div className="flex justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                  <span>&lt; 100 stars</span>
                  <strong className="text-yellow-600 dark:text-yellow-400">-10</strong>
                </div>
                <div className="flex justify-between p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                  <span>&gt; 500 open issues</span>
                  <strong className="text-orange-600 dark:text-orange-400">-20</strong>
                </div>
                <div className="flex justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                  <span>&gt; 100 open issues</span>
                  <strong className="text-yellow-600 dark:text-yellow-400">-10</strong>
                </div>
                <div className="flex justify-between p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                  <span>Last commit &gt; 1 year</span>
                  <strong className="text-orange-600 dark:text-orange-400">-30</strong>
                </div>
                <div className="flex justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                  <span>Last commit &gt; 6 months</span>
                  <strong className="text-yellow-600 dark:text-yellow-400">-15</strong>
                </div>
                <div className="flex justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <span>Last commit &lt; 30 days</span>
                  <strong className="text-green-600 dark:text-green-400">+5 (bonus)</strong>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Booster: 2.0x (important indicator of maintenance)
              </p>
            </div>

            {/* Update Frequency Score */}
            <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">7. Update Frequency Score</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Average days between releases (last 12 months):</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <span>≤ 30 days (monthly+)</span>
                  <strong className="text-green-600 dark:text-green-400">100</strong>
                </div>
                <div className="flex justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <span>≤ 90 days (quarterly)</span>
                  <strong className="text-green-600 dark:text-green-400">90</strong>
                </div>
                <div className="flex justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                  <span>≤ 180 days (semi-annual)</span>
                  <strong className="text-yellow-600 dark:text-yellow-400">70</strong>
                </div>
                <div className="flex justify-between p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                  <span>≤ 365 days (annual)</span>
                  <strong className="text-orange-600 dark:text-orange-400">50</strong>
                </div>
                <div className="flex justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded">
                  <span>&gt; 365 days (rare)</span>
                  <strong className="text-red-600 dark:text-red-400">30</strong>
                </div>
                <div className="flex justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded">
                  <span>0 releases</span>
                  <strong className="text-red-600 dark:text-red-400">20</strong>
                </div>
              </div>
              <p className="text-xs text-gray-700 dark:text-gray-300 mt-2">
                <strong>Bonus:</strong> &gt; 20 releases/year → +10 points
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Booster: 1.5x (moderate importance)
              </p>
            </div>
          </section>

          {/* Rating Categories */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Rating Categories</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">Final score is mapped to a rating:</p>
            <div className="space-y-2">
              <div className="flex items-center gap-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400 min-w-[80px]">90-100</span>
                <div>
                  <strong className="text-green-900 dark:text-green-100">Excellent</strong>
                  <p className="text-sm text-green-700 dark:text-green-300">Well-maintained, safe, recommended</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 min-w-[80px]">75-89</span>
                <div>
                  <strong className="text-blue-900 dark:text-blue-100">Good</strong>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Solid choice, minor concerns</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 min-w-[80px]">60-74</span>
                <div>
                  <strong className="text-yellow-900 dark:text-yellow-100">Fair</strong>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">Acceptable but needs monitoring</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <span className="text-2xl font-bold text-red-600 dark:text-red-400 min-w-[80px]">0-59</span>
                <div>
                  <strong className="text-red-900 dark:text-red-100">Poor</strong>
                  <p className="text-sm text-red-700 dark:text-red-300">High risk, consider alternatives</p>
                </div>
              </div>
            </div>
          </section>

          {/* Example Calculation */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Example Calculation</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Let's calculate the score for <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">moment@2.29.4</code>:
            </p>

            <div className="overflow-x-auto mb-4">
              <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Dimension</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Score</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Weight</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Weighted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {[
                    ['Age', '60', '1.5', '90'],
                    ['Deprecation', '100', '4.0', '400'],
                    ['License', '100', '3.0', '300'],
                    ['Vulnerability', '85', '2.0', '170'],
                    ['Popularity', '95', '1.0', '95'],
                    ['Repository', '85', '2.0', '170'],
                    ['Update Frequency', '40', '1.5', '60'],
                  ].map(([dim, score, weight, weighted]) => (
                    <tr key={dim}>
                      <td className="px-4 py-3 text-sm font-medium">{dim}</td>
                      <td className="px-4 py-3 text-sm">{score}/100</td>
                      <td className="px-4 py-3 text-sm">{weight}x</td>
                      <td className="px-4 py-3 text-sm font-semibold">{weighted}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 dark:bg-gray-900 font-bold">
                    <td className="px-4 py-3 text-sm">Total</td>
                    <td className="px-4 py-3 text-sm"></td>
                    <td className="px-4 py-3 text-sm">15.0</td>
                    <td className="px-4 py-3 text-sm">1285</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
              <p className="mb-2">Overall Score = 1285 / 15.0 = <strong className="text-green-400">85.67 → 86/100</strong></p>
              <p><strong className="text-blue-400">Rating: Good</strong> (75-89)</p>
            </div>
          </section>

          {/* Customizing Boosters */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Customizing Boosters</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Adjust booster weights to match your priorities:
            </p>

            <div className="space-y-4">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Security-Focused</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Emphasize vulnerabilities and deprecation:</p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
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

              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">License-Focused</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Emphasize legal compliance:</p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
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
          </section>

          {/* Tips */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Tips for Optimization</h3>
            <ul className="space-y-2">
              {[
                'Start with defaults - They work for most projects',
                'Boost critical dimensions - Increase weights for your priorities',
                'Set minimumScore gradually - Start at 50, increase over time',
                'Monitor score distribution - Aim for 80+ average',
                'Use scores for prioritization - Fix lowest scores first',
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary-600 dark:text-primary-400 font-bold mt-1">{i + 1}.</span>
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
