import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaFire, FaChartLine, FaClock } from 'react-icons/fa';
import { newsService } from '../services/api';
import { NewsCard } from '../components/news/NewsCard';
import { LoaderSkeleton } from '../components/common/LoaderSkeleton';

export const TrendingPage = () => {
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  const fetchTrending = useCallback(async (pageNum, isLoadMore = false) => {
    try {
      const articles = await newsService.fetchTrending(pageNum);
      
      if (isLoadMore) {
        setTrendingArticles(prev => [...prev, ...articles]);
      } else {
        setTrendingArticles(articles);
      }
      
      setHasMore(articles.length === 30);
      return articles;
    } catch (error) {
      console.error('Failed to fetch trending:', error);
      return [];
    }
  }, []);

  useEffect(() => {
    setPage(1);
    setTrendingArticles([]);
    setHasMore(true);
    setLoading(true);
    fetchTrending(1, false).finally(() => setLoading(false));
  }, [fetchTrending]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          setLoadingMore(true);
          const nextPage = page + 1;
          setPage(nextPage);
          fetchTrending(nextPage, true).finally(() => setLoadingMore(false));
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, page, fetchTrending]);

  if (loading && trendingArticles.length === 0) {
    return <LoaderSkeleton type="grid" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <div className="inline-block p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4">
          <FaFire className="text-4xl text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-2 dark:text-white">Trending</h1>
        <p className="text-gray-600 dark:text-gray-400">{trendingArticles.length} trending stories</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trendingArticles.map((article, index) => (
          <NewsCard key={`${article.url}-${index}`} article={article} />
        ))}
      </div>

      {(loadingMore || hasMore) && (
        <div ref={loaderRef} className="text-center py-8">
          {loadingMore && (
            <div className="inline-flex items-center space-x-2">
              <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600 dark:text-gray-400">Loading more trending stories...</span>
            </div>
          )}
        </div>
      )}

      {!hasMore && trendingArticles.length > 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-8 py-8">
          You've reached the end of trending stories
        </p>
      )}
    </div>
  );
};