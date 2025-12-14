import { useTranslation } from 'react-i18next';
import { FiShield, FiLayers, FiFile, FiLock, FiZap, FiCheckCircle, FiCode } from 'react-icons/fi';

export const WhatsNewV2 = () => {
  const { t } = useTranslation();

  const newFeatures = [
    {
      icon: FiShield,
      title: t('whatsNewV2.features.vulnerabilityScanning.title'),
      description: t('whatsNewV2.features.vulnerabilityScanning.description'),
    },
    {
      icon: FiLayers,
      title: t('whatsNewV2.features.transitiveAnalysis.title'),
      description: t('whatsNewV2.features.transitiveAnalysis.description'),
    },
    {
      icon: FiFile,
      title: t('whatsNewV2.features.noticeAndSbom.title'),
      description: t('whatsNewV2.features.noticeAndSbom.description'),
    },
    {
      icon: FiLock,
      title: t('whatsNewV2.features.tokenSecurity.title'),
      description: t('whatsNewV2.features.tokenSecurity.description'),
    },
    {
      icon: FiZap,
      title: t('whatsNewV2.features.performanceCache.title'),
      description: t('whatsNewV2.features.performanceCache.description'),
    },
    {
      icon: FiCheckCircle,
      title: t('whatsNewV2.features.spdxLicenses.title'),
      description: t('whatsNewV2.features.spdxLicenses.description'),
    },
    {
      icon: FiCode,
      title: t('whatsNewV2.features.sarifExport.title'),
      description: t('whatsNewV2.features.sarifExport.description'),
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-600 dark:bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-600 dark:bg-primary-400"></span>
              </span>
              {t('whatsNewV2.badge')}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('whatsNewV2.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('whatsNewV2.subtitle')}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {newFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {t('whatsNewV2.stats.licenses.value')}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t('whatsNewV2.stats.licenses.label')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {t('whatsNewV2.stats.layers.value')}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t('whatsNewV2.stats.layers.label')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {t('whatsNewV2.stats.cache.value')}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t('whatsNewV2.stats.cache.label')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {t('whatsNewV2.stats.compliance.value')}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t('whatsNewV2.stats.compliance.label')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {t('whatsNewV2.stats.projectTypes.value')}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t('whatsNewV2.stats.projectTypes.label')}
              </div>
            </div>
          </div>

          {/* Compliance badges */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
              {t('whatsNewV2.complianceSection.title')}
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-700 dark:text-primary-300 font-medium text-sm">
                SPDX 2.3
              </div>
              <div className="px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-700 dark:text-primary-300 font-medium text-sm">
                CISA SBOM 2025
              </div>
              <div className="px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-700 dark:text-primary-300 font-medium text-sm">
                NIST 800-161
              </div>
              <div className="px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-700 dark:text-primary-300 font-medium text-sm">
                Apache NOTICE
              </div>
              <div className="px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-700 dark:text-primary-300 font-medium text-sm">
                Blue Oak Council
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t('whatsNewV2.cta.description')}
            </p>
            <button
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
              onClick={() => {
                const element = document.getElementById('documentation');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t('whatsNewV2.cta.button')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
