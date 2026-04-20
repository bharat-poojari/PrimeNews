// src/hooks/useNews.js
import { useState, useEffect, useCallback, useRef } from "react";
import { newsService } from "../services/api";

export function useNews(category = "general", limit = 10) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const isMounted = useRef(true);

  const fetchNews = useCallback(async (pageNum, isLoadMore = false) => {
    if (!isMounted.current) return;
    
    try {
      if (!isLoadMore) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      setError(null);
      
      const data = await newsService.fetchTopHeadlines(category, "us", pageNum);
      const newArticles = data.articles || [];
      
      if (!isMounted.current) return;
      
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
      if (!isMounted.current) return;
      console.error("Failed to fetch news:", err);
      setError(err.message || "Failed to load news");
    } finally {
      if (!isMounted.current) return;
      if (!isLoadMore) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  }, [category]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNews(nextPage, true);
    }
  }, [loadingMore, hasMore, loading, page, fetchNews]);

  const refreshNews = useCallback(() => {
    setPage(1);
    setArticles([]);
    setHasMore(true);
    fetchNews(1, false);
  }, [fetchNews]);

  useEffect(() => {
    isMounted.current = true;
    refreshNews();
    
    return () => {
      isMounted.current = false;
    };
  }, [category, refreshNews]);

  return {
    articles,
    loading,
    error,
    hasMore,
    loadingMore,
    loadMore,
    refreshNews,
  };
}