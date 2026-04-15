import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  const { isDark } = useThemeStore();

  return (
    <div className={isDark ? 'dark' : ''}>
      <ErrorBoundary>
        <Router>
          <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors">
            <Navbar />
            <main className="flex-grow pt-16">
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
          </div>
        </Router>
        <Toaster position="top-right" />
      </ErrorBoundary>
    </div>
  );
}

export default App;