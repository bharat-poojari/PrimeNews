// PrimeNews/src/pages/TrendingPage.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { FaFire } from 'react-icons/fa';
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
  const observerRef = useRef(null);
  const loadingRef = useRef(null);

  const fetchTrending = useCallback(async (pageNum, isLoadMore = false) => {
    try {
      const articles = await newsService.fetchTrending(pageNum);
      
      if (isLoadMore) {
        setTrendingArticles(prev => {
          // Remove duplicates based on URL
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
      toast.error('Failed to load trending news');
      return [];
    }
  }, []);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (loadingMore || !hasMore || loading) return;
    
    const options = {
      root: null,
      rootMargin: '100px',
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
    fetchTrending(1, false).finally(() => setLoading(false));
  }, [fetchTrending]);

  if (loading && trendingArticles.length === 0) {
    return <LoaderSkeleton type="grid" />;
  }

  return (
    <div className="container mx-auto px-4 py-6 pt-20 lg:pt-24">
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
          <FaFire className="text-white text-base" />
          <h1 className="text-white font-bold text-base">Trending</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {trendingArticles.length} trending stories
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {trendingArticles.map((article, index) => (
          <NewsCard key={`${article.url}-${index}`} article={article} />
        ))}
      </div>

      {/* Infinite Scroll Loader */}
      <div ref={loadingRef} className="text-center py-8">
        {loadingMore && (
          <div className="inline-flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600 dark:text-gray-400 text-sm">Loading more trending stories...</span>
          </div>
        )}
        {!hasMore && trendingArticles.length > 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-4">
            <p className="text-sm">You've reached the end of trending stories</p>
          </div>
        )}
        {hasMore && !loadingMore && trendingArticles.length > 0 && (
          <div className="text-center text-gray-400 dark:text-gray-600 py-4">
            <p className="text-xs">Scroll down to load more...</p>
          </div>
        )}
      </div>
    </div>
  );
};