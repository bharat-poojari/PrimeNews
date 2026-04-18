// PrimeNews/src/App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ArticlePage } from './pages/ArticlePage';
import { SearchPage } from './pages/SearchPage';
import { TrendingPage } from './pages/TrendingPage';
import { VideoPage } from './pages/VideoPage';
import { BookmarksPage } from './pages/BookmarksPage';
import { ContactPage } from './pages/ContactPage';
import { useThemeStore } from './store/themeStore';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Toaster } from 'react-hot-toast';

// Scroll to top component
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  
  return null;
}

function App() {
  const { isDark } = useThemeStore();

  useEffect(() => {
    // Apply dark class to html element
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <ErrorBoundary>
        <Router>
          <ScrollToTop />
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/article/:articleId" element={<ArticlePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/trending" element={<TrendingPage />} />
              <Route path="/videos" element={<VideoPage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </main>
          <Footer />
        </Router>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: isDark ? '#1f2937' : '#fff',
              color: isDark ? '#fff' : '#1f2937',
            },
          }}
        />
      </ErrorBoundary>
    </div>
  );
}

export default App;