// src/pages/TrendingPage.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { FaFire, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { newsService } from '../services/api';
import { NewsCard } from '../components/news/NewsCard';
import { LoaderSkeleton } from '../components/common/LoaderSkeleton';
import toast from 'react-hot-toast';

export const TrendingPage = () => {
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const observerRef = useRef(null);
  const loadingRef = useRef(null);
  const navigate = useNavigate();

  const fetchTrending = useCallback(async (pageNum, isLoadMore = false) => {
    try {
      setError(null);
      const articles = await newsService.fetchTrending(pageNum);
      
      if (isLoadMore) {
        setTrendingArticles(prev => {
          const existingUrls = new Set(prev.map(a => a.url));
          const newArticles = articles.filter(a => !existingUrls.has(a.url));
          return [...prev, ...newArticles];
        });
      } else {
        setTrendingArticles(articles);
      }
      
      setHasMore(articles.length === 30);
      return articles;
    } catch (error) {
      console.error('Failed to fetch trending:', error);
      setError('Failed to load trending news. Please try again.');
      toast.error('Failed to load trending news');
      return [];
    }
  }, []);

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
        fetchTrending(nextPage, true).finally(() => setLoadingMore(false));
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
  }, [loadingMore, hasMore, loading, page, fetchTrending]);

  // Initial load
  useEffect(() => {
    setPage(1);
    setTrendingArticles([]);
    setHasMore(true);
    setLoading(true);
    setError(null);
    fetchTrending(1, false).finally(() => setLoading(false));
  }, [fetchTrending]);

  if (loading && trendingArticles.length === 0) {
    return <LoaderSkeleton type="grid" />;
  }

  return (
    <div className="container mx-auto px-4 py-6 pt-20 lg:pt-24">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-4 transition-colors"
      >
        <FaArrowLeft className="mr-2" />
        Go Back
      </button>

      <div className="flex items-center justify-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
          <FaFire className="text-white text-sm lg:text-base" />
          <h1 className="text-white font-bold text-sm lg:text-base">Trending News</h1>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 text-center">
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              fetchTrending(1, false).finally(() => setLoading(false));
            }}
            className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {trendingArticles.length === 0 && !loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No trending articles available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {trendingArticles.map((article, index) => (
            <NewsCard key={`${article.url}-${index}`} article={article} variant="featured" />
          ))}
        </div>
      )}

      {/* Infinite Scroll Loader */}
      <div ref={loadingRef} className="text-center py-8">
        {loadingMore && (
          <div className="inline-flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600 dark:text-gray-400 text-sm">Loading more stories...</span>
          </div>
        )}
      </div>
    </div>
  );
};