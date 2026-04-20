// src/pages/CategoryPage.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { newsService } from '../services/api';
import { NewsCard } from '../components/news/NewsCard';
import { LoaderSkeleton } from '../components/common/LoaderSkeleton';
import { FaArrowLeft } from 'react-icons/fa';

const CATEGORY_MAP = {
  general: { name: 'General', color: 'blue' },
  business: { name: 'Business', color: 'green' },
  technology: { name: 'Technology', color: 'purple' },
  entertainment: { name: 'Entertainment', color: 'pink' },
  sports: { name: 'Sports', color: 'orange' },
  science: { name: 'Science', color: 'teal' },
  health: { name: 'Health', color: 'red' }
};

export const CategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const loadingRef = useRef(null);

  const category = CATEGORY_MAP[categoryId?.toLowerCase()] || CATEGORY_MAP.general;

  const fetchNews = useCallback(async (pageNum, isLoadMore = false) => {
    try {
      setError(null);
      console.log(`Fetching ${categoryId} news, page ${pageNum}`);
      
      const data = await newsService.fetchTopHeadlines(categoryId, 'us', pageNum);
      const newArticles = data.articles || [];
      
      console.log(`Received ${newArticles.length} articles for ${categoryId}`);
      
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
      return newArticles;
    } catch (err) {
      console.error('Failed to fetch news:', err);
      setError('Failed to load news. Please try again.');
      return [];
    }
  }, [categoryId]);

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
        setLoadingMore(true);
        const nextPage = page + 1;
        setPage(nextPage);
        fetchNews(nextPage, true).finally(() => setLoadingMore(false));
      }
    }, options);
    
    const currentLoadingRef = loadingRef.current;
    if (currentLoadingRef) {
      observerRef.current.observe(currentLoadingRef);
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadingMore, hasMore, loading, page, fetchNews]);

  // Initial load - refetch when categoryId changes
  useEffect(() => {
    setPage(1);
    setArticles([]);
    setHasMore(true);
    setLoading(true);
    setError(null);
    fetchNews(1, false).finally(() => setLoading(false));
  }, [categoryId, fetchNews]);

  if (loading && articles.length === 0) {
    return <LoaderSkeleton type="grid" />;
  }

  if (error && articles.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 w-full">
        <main className="w-full" style={{ paddingTop: '1.4rem' }}>
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <button 
                onClick={() => {
                  setLoading(true);
                  fetchNews(1, false).finally(() => setLoading(false));
                }} 
                className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 w-full">
      <main className="w-full" style={{ paddingTop: '1.4rem' }}>
        {/* Back Button */}
        <div className="w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-14 lg:top-16 z-30">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <button 
              onClick={() => navigate('/')}
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium"
            >
              <FaArrowLeft className="mr-2 text-xs" />
              Back to Home
            </button>
          </div>
        </div>

        {/* Header Section */}
        <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <h1 className="text-3xl lg:text-4xl font-bold dark:text-white capitalize">
              {category.name} News
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
              Latest {category.name.toLowerCase()} news and updates from around the world
            </p>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="w-full">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            {articles.length === 0 && !loading ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📰</div>
                <p className="text-gray-500 dark:text-gray-400">No articles found in this category.</p>
                <button
                  onClick={() => {
                    setLoading(true);
                    fetchNews(1, false).finally(() => setLoading(false));
                  }}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
                {articles.map((article, index) => (
                  <NewsCard key={`${article.url}-${index}`} article={article} />
                ))}
              </div>
            )}

            {/* Infinite Scroll Loader */}
            <div ref={loadingRef} className="text-center py-8">
              {loadingMore && (
                <div className="inline-flex items-center space-x-3">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Loading more articles...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CategoryPage;