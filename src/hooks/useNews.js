// src/hooks/useNews.js
import { useState, useEffect, useCallback } from 'react';
import { newsService } from '../services/api';

export const useNews = (category = 'general', pageSize = 20) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  const fetchNews = useCallback(async (pageNum = 1, append = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await newsService.fetchTopHeadlines(category, 'us', pageNum);
      
      if (data.articles && data.articles.length > 0) {
        const newArticles = data.articles;
        
        if (append) {
          setArticles(prev => [...prev, ...newArticles]);
        } else {
          setArticles(newArticles);
        }
        
        setTotalResults(data.totalResults || 0);
        setHasMore(newArticles.length === 30 && pageNum < 5);
      } else {
        setArticles([]);
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(err.message || 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  }, [category]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNews(nextPage, true);
    }
  }, [loading, hasMore, page, fetchNews]);

  const refresh = useCallback(() => {
    setPage(1);
    setArticles([]);
    fetchNews(1, false);
  }, [fetchNews]);

  useEffect(() => {
    fetchNews(1, false);
  }, [category, fetchNews]);

  return {
    articles,
    loading,
    error,
    hasMore,
    totalResults,
    loadMore,
    refresh,
    page,
  };
};

export const useSearchNews = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const search = useCallback(async (query, page = 1) => {
    if (!query || query.trim() === '') {
      setResults([]);
      setHasSearched(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);
      
      const data = await newsService.searchNews(query, page);
      setResults(data.articles || []);
      return data;
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setHasSearched(false);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    hasSearched,
    search,
    clearResults,
  };
};

export const useTrendingNews = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrending = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await newsService.fetchTrending(1);
      setArticles(data);
    } catch (err) {
      console.error('Error fetching trending:', err);
      setError(err.message || 'Failed to fetch trending news');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  return {
    articles,
    loading,
    error,
    refresh: fetchTrending,
  };
};