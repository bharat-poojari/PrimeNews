import { useState, useEffect } from 'react';
import { newsService } from '../services/api';

export function useNews(category = 'general', country = 'us', page = 1) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchNews();
  }, [category, country, page]);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await newsService.fetchTopHeadlines(category, country, page);
      
      if (page === 1) {
        setArticles(data.articles || []);
      } else {
        setArticles(prev => [...prev, ...(data.articles || [])]);
      }

      if (!data.articles || data.articles.length === 0) {
        setHasMore(false);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  const refreshNews = () => {
    fetchNews();
  };

  return {
    articles,
    loading,
    error,
    hasMore,
    refreshNews,
    fetchMore: () => fetchNews(),
  };
}