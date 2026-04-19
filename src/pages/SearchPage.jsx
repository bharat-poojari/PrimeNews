// PrimeNews/src/pages/SearchPage.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { newsService } from '../services/api';
import { NewsCard } from '../components/news/NewsCard';
import { SearchBar } from '../components/common/SearchBar';
import { LoaderSkeleton } from '../components/common/LoaderSkeleton';
import { useDebounce } from '../hooks/useDebounce';

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const loadingRef = useRef(null);

  const debouncedQuery = useDebounce(query, 500);

  const performSearch = useCallback(async (searchQuery, pageNum, isLoadMore = false) => {
    if (!searchQuery || searchQuery.trim() === '') {
      setResults([]);
      setHasMore(false);
      return [];
    }

    try {
      const data = await newsService.searchNews(searchQuery, pageNum);
      const newArticles = data.articles || [];
      
      if (isLoadMore) {
        setResults(prev => {
          const existingUrls = new Set(prev.map(a => a.url));
          const uniqueNewArticles = newArticles.filter(a => !existingUrls.has(a.url));
          return [...prev, ...uniqueNewArticles];
        });
      } else {
        setResults(newArticles);
      }
      
      const hasMorePages = newArticles.length === 30;
      setHasMore(hasMorePages);
      
      return newArticles;
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  }, []);

  useEffect(() => {
    if (loadingMore || !hasMore || loading || !debouncedQuery) return;
    
    const options = {
      root: null,
      rootMargin: '200px',
      threshold: 0.1
    };
    
    observerRef.current = new IntersectionObserver((entries) => {
      const firstEntry = entries[0];
      if (firstEntry.isIntersecting && !loadingMore && hasMore && !loading && debouncedQuery) {
        setLoadingMore(true);
        const nextPage = page + 1;
        setPage(nextPage);
        performSearch(debouncedQuery, nextPage, true).finally(() => {
          setLoadingMore(false);
        });
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
  }, [loadingMore, hasMore, loading, page, performSearch, debouncedQuery]);

  useEffect(() => {
    if (debouncedQuery && debouncedQuery.trim()) {
      setPage(1);
      setResults([]);
      setHasMore(true);
      setLoading(true);
      performSearch(debouncedQuery, 1, false).finally(() => setLoading(false));
    } else {
      setResults([]);
      setHasMore(false);
    }
  }, [debouncedQuery, performSearch]);

  const handleSearch = (searchQuery) => {
    if (searchQuery && searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
      setPage(1);
      setResults([]);
      setHasMore(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 pt-20 lg:pt-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4 dark:text-white">Search News</h1>
        
        <div className="mb-6">
          <SearchBar 
            initialValue={query}
            onSearch={handleSearch}
            autoFocus={true}
            placeholder="Search for news..."
          />
        </div>
      </div>

      {loading && results.length === 0 ? (
        <LoaderSkeleton type="grid" />
      ) : results.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((article, index) => (
              <NewsCard key={`${article.url}-${index}`} article={article} />
            ))}
          </div>
          
          <div ref={loadingRef} className="text-center py-8">
            {loadingMore && (
              <div className="inline-flex items-center space-x-3">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-600 dark:text-gray-400 text-sm">Loading more results...</span>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};