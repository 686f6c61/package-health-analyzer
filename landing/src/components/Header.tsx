import { useTranslation } from 'react-i18next';
import { FiSun, FiMoon, FiGithub } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

export const Header = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <img
                src={theme === 'dark' ? '/white.png' : '/dark.png'}
                alt="package-health-analyzer logo"
                className="w-8 h-8"
              />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">
              package-health-analyzer
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => scrollToSection('home')}
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {t('nav.home')}
            </button>
            <button
              onClick={() => scrollToSection('documentation')}
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {t('nav.documentation')}
            </button>
            <button
              onClick={() => scrollToSection('live-report')}
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {t('nav.liveReport')}
            </button>
            <a
              href="https://www.npmjs.com/package/package-health-analyzer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              npmjs
            </a>
            <a
              href="https://github.com/686f6c61/package-health-analyzer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center space-x-1"
            >
              <FiGithub className="w-5 h-5" />
              <span>{t('nav.github')}</span>
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => changeLanguage('en')}
                className={`px-3 py-1 rounded transition-colors ${
                  i18n.language === 'en'
                    ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => changeLanguage('es')}
                className={`px-3 py-1 rounded transition-colors ${
                  i18n.language === 'es'
                    ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                ES
              </button>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <FiMoon className="w-5 h-5" />
              ) : (
                <FiSun className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
