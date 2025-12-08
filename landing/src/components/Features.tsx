import { useTranslation } from 'react-i18next';
import { FiClock, FiFileText, FiShield, FiActivity, FiGithub, FiFile } from 'react-icons/fi';

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
      title: t('features.licenseCompliance.title'),
      description: t('features.licenseCompliance.description'),
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
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
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
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
