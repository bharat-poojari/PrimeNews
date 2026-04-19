// src/pages/CategoryPage.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { newsService } from '../services/api';
import { NewsCard } from '../components/news/NewsCard';
import { LoaderSkeleton } from '../components/common/LoaderSkeleton';
import { FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';

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
  const observerRef = useRef(null);
  const loadingRef = useRef(null);

  const category = CATEGORY_MAP[categoryId?.toLowerCase()] || CATEGORY_MAP.general;

  const fetchNews = useCallback(async (pageNum, isLoadMore = false) => {
    try {
      const data = await newsService.fetchTopHeadlines(categoryId, 'us', pageNum);
      const newArticles = data.articles || [];
      
      if (isLoadMore) {
        setArticles(prev => {
          const existingUrls = new Set(prev.map(a => a.url));
          const uniqueNewArticles = newArticles.filter(a => !existingUrls.has(a.url));
          return [...prev, ...uniqueNewArticles];
        });
      } else {
        setArticles(newArticles);
      }
      
      setHasMore(newArticles.length === 30);
      return newArticles;
    } catch (err) {
      console.error('Failed to fetch news:', err);
      setError('Failed to load news. Please try again.');
      toast.error('Failed to load news');
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

  // Initial load
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
      <div className="container mx-auto px-4 py-8 pt-20 lg:pt-24">
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-20 lg:pt-24">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-4 transition-colors">
          <FaArrowLeft className="mr-2" />
          Back to Home
        </Link>
        <h1 className="text-3xl lg:text-4xl font-bold dark:text-white capitalize">{category.name} News</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Latest {category.name.toLowerCase()} news and updates</p>
      </div>

      {articles.length === 0 && !loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No articles found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
};