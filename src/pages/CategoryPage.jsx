// src/pages/CategoryPage.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaNewspaper, FaFire } from 'react-icons/fa';
import { NewsCard } from '../components/news/NewsCard';
import { LoaderSkeleton } from '../components/common/LoaderSkeleton';
import { newsService } from '../services/api';

const CATEGORY_INFO = {
  general: { name: 'General', color: 'blue', icon: FaNewspaper },
  business: { name: 'Business', color: 'green', icon: FaNewspaper },
  technology: { name: 'Technology', color: 'purple', icon: FaNewspaper },
  entertainment: { name: 'Entertainment', color: 'pink', icon: FaNewspaper },
  sports: { name: 'Sports', color: 'orange', icon: FaFire },
  science: { name: 'Science', color: 'teal', icon: FaNewspaper },
  health: { name: 'Health', color: 'red', icon: FaNewspaper }
};

export const CategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  const category = CATEGORY_INFO[categoryId?.toLowerCase()] || CATEGORY_INFO.general;
  const categoryName = categoryId?.toLowerCase() || 'general';

  const fetchNews = useCallback(async (pageNum, isLoadMore = false) => {
    try {
      if (!isLoadMore) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);
      
      console.log(`Fetching ${categoryName} news, page ${pageNum}`);
      const data = await newsService.fetchTopHeadlines(categoryName, 'us', pageNum);
      const newArticles = data.articles || [];
      
      console.log(`Received ${newArticles.length} articles for ${categoryName}`);
      
      if (isLoadMore) {
        setArticles(prev => {
          const existingUrls = new Set(prev.map(a => a.url));
          const uniqueNewArticles = newArticles.filter(a => !existingUrls.has(a.url));
          return [...prev, ...uniqueNewArticles];
        });
      } else {
        setArticles(newArticles);
      }
      
      setHasMore(newArticles.length === 30 && pageNum < 5);
      
    } catch (err) {
      console.error('Failed to fetch news:', err);
      setError(err.message || 'Failed to load news. Please try again.');
    } finally {
      if (!isLoadMore) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  }, [categoryName]);

  // Load more function for infinite scroll
  const loadMoreNews = useCallback(() => {
    if (!loadingMore && hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNews(nextPage, true);
    }
  }, [loadingMore, hasMore, loading, page, fetchNews]);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (loadingMore || !hasMore || loading) return;
    
    const options = {
      root: null,
      rootMargin: '200px',
      threshold: 0.1
    };
    
    observerRef.current = new IntersectionObserver((entries) => {
      const firstEntry = entries[0];
      if (firstEntry.isIntersecting && !loadingMore && hasMore && !loading) {
        loadMoreNews();
      }
    }, options);
    
    const currentLoadMoreRef = loadMoreRef.current;
    if (currentLoadMoreRef) {
      observerRef.current.observe(currentLoadMoreRef);
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadingMore, hasMore, loading, loadMoreNews]);

  // Initial load - refetch when category changes
  useEffect(() => {
    setPage(1);
    setArticles([]);
    setHasMore(true);
    setError(null);
    fetchNews(1, false);
  }, [categoryName, fetchNews]);

  const handleRetry = () => {
    setPage(1);
    setArticles([]);
    setHasMore(true);
    setError(null);
    fetchNews(1, false);
  };

  if (loading && articles.length === 0) {
    return <LoaderSkeleton type="grid" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        {/* Back Button */}
        <div className="mb-5">
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform text-xs" />
            Back to Home
          </button>
        </div>

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 bg-${category.color}-100 dark:bg-${category.color}-900/30 rounded-lg`}>
              <category.icon className={`text-${category.color}-600 dark:text-${category.color}-400 text-xl`} />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white capitalize">
              {category.name} News
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Latest {category.name.toLowerCase()} news and updates from around the world
          </p>
          <div className="w-16 h-0.5 bg-blue-600 mt-2 rounded-full" />
        </div>

        {/* Error State */}
        {error && articles.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Unable to load news
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
              {error}
            </p>
            <button
              onClick={handleRetry}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Articles Grid */}
        {!error && articles.length === 0 && !loading ? (
          <div className="text-center py-12">
            <FaNewspaper className="text-5xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No articles found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              No news articles available in this category at the moment.
            </p>
            <button
              onClick={handleRetry}
              className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
              {articles.map((article, index) => (
                <NewsCard key={`${article.url}-${index}`} article={article} />
              ))}
            </div>

            {/* Infinite Scroll Loader */}
            <div ref={loadMoreRef} className="text-center py-8">
              {loadingMore && (
                <div className="inline-flex items-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Loading more articles...</span>
                </div>
              )}
            </div>

            {!hasMore && articles.length > 0 && (
              <div className="text-center py-6">
                <p className="text-gray-500 dark:text-gray-400 text-sm">You've reached the end of the list</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default CategoryPage;
//error