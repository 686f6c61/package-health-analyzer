import { useTranslation } from 'react-i18next';
import { FiClock, FiFileText, FiShield, FiActivity, FiGithub, FiFile, FiAlertTriangle, FiLayers, FiPackage, FiLock, FiZap, FiCode, FiTrendingUp } from 'react-icons/fi';

export const Features = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: FiClock,
      title: t('features.ageDetection.title'),
      description: t('features.ageDetection.description'),
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      icon: FiFileText,
      title: t('features.licenseComplianceExtended.title'),
      description: t('features.licenseComplianceExtended.description'),
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      badge: 'v2.0',
    },
    {
      icon: FiShield,
      title: t('features.security.title'),
      description: t('features.security.description'),
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
    },
    {
      icon: FiActivity,
      title: t('features.healthScore.title'),
      description: t('features.healthScore.description'),
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      icon: FiGithub,
      title: t('features.githubIntegration.title'),
      description: t('features.githubIntegration.description'),
      color: 'text-gray-700 dark:text-gray-300',
      bgColor: 'bg-gray-100 dark:bg-gray-700/30',
    },
    {
      icon: FiFile,
      title: t('features.reporting.title'),
      description: t('features.reporting.description'),
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    },
    {
      icon: FiAlertTriangle,
      title: t('features.vulnerabilityScanning.title'),
      description: t('features.vulnerabilityScanning.description'),
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      badge: 'v2.0',
    },
    {
      icon: FiLayers,
      title: t('features.dependencyTreeAnalysis.title'),
      description: t('features.dependencyTreeAnalysis.description'),
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
      badge: 'v2.0',
    },
    {
      icon: FiFile,
      title: t('features.noticeGeneration.title'),
      description: t('features.noticeGeneration.description'),
      color: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
      badge: 'v2.0',
    },
    {
      icon: FiPackage,
      title: t('features.spdxExport.title'),
      description: t('features.spdxExport.description'),
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      badge: 'v2.0',
    },
    {
      icon: FiLock,
      title: t('features.tokenSecuritySystem.title'),
      description: t('features.tokenSecuritySystem.description'),
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-100 dark:bg-rose-900/30',
      badge: 'v2.0',
    },
    {
      icon: FiZap,
      title: t('features.performanceCaching.title'),
      description: t('features.performanceCaching.description'),
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      badge: 'v2.0',
    },
    {
      icon: FiCode,
      title: t('features.sarifOutput.title'),
      description: t('features.sarifOutput.description'),
      color: 'text-teal-600 dark:text-teal-400',
      bgColor: 'bg-teal-100 dark:bg-teal-900/30',
      badge: 'v2.0',
    },
    {
      icon: FiTrendingUp,
      title: t('features.upgradePathAnalysis.title'),
      description: t('features.upgradePathAnalysis.description'),
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
      badge: 'v2.0',
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('features.title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group p-6 bg-gray-50 dark:bg-gray-900 rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500"
              >
                <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  {feature.badge && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full">
                      {feature.badge}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
