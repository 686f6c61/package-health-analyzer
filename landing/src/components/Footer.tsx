import { useTranslation } from 'react-i18next';
import { FiGithub, FiHeart } from 'react-icons/fi';
import { SiReact, SiTypescript, SiVite, SiTailwindcss } from 'react-icons/si';
import { useTheme } from '../contexts/ThemeContext';

export const Footer = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img
                  src={theme === 'dark' ? '/white.png' : '/dark.png'}
                  alt="package-health-analyzer logo"
                  className="w-8 h-8"
                />
              </div>
              <span className="font-bold text-lg text-gray-900 dark:text-white">
                package-health-analyzer
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {t('footer.description')}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              {t('footer.builtWith')}
            </h3>
            <div className="flex items-center space-x-4">
              <a
                href="https://react.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                title="React"
              >
                <SiReact className="w-6 h-6" />
              </a>
              <a
                href="https://www.typescriptlang.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                title="TypeScript"
              >
                <SiTypescript className="w-6 h-6" />
              </a>
              <a
                href="https://vitejs.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                title="Vite"
              >
                <SiVite className="w-6 h-6" />
              </a>
              <a
                href="https://tailwindcss.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                title="Tailwind CSS"
              >
                <SiTailwindcss className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Links
            </h3>
            <div className="space-y-2">
              <a
                href="https://github.com/686f6c61/package-health-analyzer"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <FiGithub className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <a
                href="https://www.npmjs.com/package/package-health-analyzer"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors block"
              >
                npm
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} package-health-analyzer - {t('footer.license')}
            </p>
            <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 text-sm">
              <span>Made with</span>
              <FiHeart className="w-4 h-4 text-red-500" />
              <span>by</span>
              <a
                href="https://github.com/686f6c61"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 dark:text-primary-400 hover:underline"
              >
                686f6c61
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
