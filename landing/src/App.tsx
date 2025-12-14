import { ThemeProvider } from './contexts/ThemeContext';
import { Header, Footer, Hero, WhatsNewV2, Features, Examples, ConfigurationGuide, Documentation, LiveReport } from './components';
import './i18n';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <Header />
        <main>
          <Hero />
          <WhatsNewV2 />
          <Features />
          <Examples />
          <ConfigurationGuide />
          <LiveReport />
          <Documentation />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
