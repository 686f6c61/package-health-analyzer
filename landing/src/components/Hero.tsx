import { useTranslation } from 'react-i18next';
import { FiDownload, FiBook, FiShield } from 'react-icons/fi';

export const Hero = () => {
  const { t } = useTranslation();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="py-20 bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium mb-6">
              <FiShield className="w-4 h-4 mr-2" />
              Open Source Security Tool
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4">
              {t('hero.subtitle')}
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              {t('hero.description')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
            <button
              onClick={() => scrollToSection('documentation')}
              className="w-full sm:w-auto px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <FiDownload className="w-5 h-5" />
              <span>{t('hero.getStarted')}</span>
            </button>
            <button
              onClick={() => scrollToSection('live-report')}
              className="w-full sm:w-auto px-8 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <FiBook className="w-5 h-5" />
              <span>{t('hero.viewDocs')}</span>
            </button>
          </div>

          <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-6 text-left">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-2 text-gray-400 text-sm">terminal</span>
            </div>
            <div className="font-mono text-sm">
              <div className="text-gray-400 mb-2"># Install globally</div>
              <div className="text-green-400">$ npm install -g package-health-analyzer</div>
              <div className="text-gray-400 mt-4 mb-2"># Or use with npx</div>
              <div className="text-green-400">$ npx package-health-analyzer scan</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
