import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const loaderRef = useRef(null);

  const category = CATEGORY_MAP[categoryId?.toLowerCase()] || CATEGORY_MAP.general;

  const fetchNews = useCallback(async (pageNum, isLoadMore = false) => {
    try {
      const data = await newsService.fetchTopHeadlines(categoryId, 'in', pageNum);
      const newArticles = data.articles || [];
      
      if (isLoadMore) {
        setArticles(prev => [...prev, ...newArticles]);
      } else {
        setArticles(newArticles);
      }
      
      setTotalResults(data.totalResults || 0);
      setHasMore(newArticles.length === 30 && (pageNum * 30) < (data.totalResults || 1000));
      
      return newArticles;
    } catch (err) {
      console.error('Failed to fetch news:', err);
      setError('Failed to load news. Please try again.');
      return [];
    }
  }, [categoryId]);

  useEffect(() => {
    setPage(1);
    setArticles([]);
    setHasMore(true);
    setLoading(true);
    fetchNews(1, false).finally(() => setLoading(false));
  }, [categoryId, fetchNews]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          setLoadingMore(true);
          const nextPage = page + 1;
          setPage(nextPage);
          fetchNews(nextPage, true).finally(() => setLoadingMore(false));
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, page, fetchNews]);

  if (loading && articles.length === 0) {
    return <LoaderSkeleton type="grid" />;
  }

  if (error && articles.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-4">
          <FaArrowLeft className="mr-2" />
          Back to Home
        </Link>
        <h1 className="text-4xl font-bold dark:text-white capitalize">{category.name} News</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Showing {articles.length} of {totalResults || 'many'} articles
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <NewsCard key={`${article.url}-${index}`} article={article} />
        ))}
      </div>

      {/* Loading more indicator */}
      {(loadingMore || hasMore) && (
        <div ref={loaderRef} className="text-center py-8">
          {loadingMore && (
            <div className="inline-flex items-center space-x-2">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600 dark:text-gray-400">Loading more articles...</span>
            </div>
          )}
        </div>
      )}

      {!hasMore && articles.length > 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-8 py-8">
          You've reached the end. Check back later for more news!
        </p>
      )}
    </div>
  );
};