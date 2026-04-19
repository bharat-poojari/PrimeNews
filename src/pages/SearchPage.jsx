// PrimeNews/src/pages/SearchPage.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { newsService } from '../services/api';
import { NewsCard } from '../components/news/NewsCard';
import { LoaderSkeleton } from '../components/common/LoaderSkeleton';
import { FaSearch, FaTimes } from 'react-icons/fa';

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  const [searchInput, setSearchInput] = useState(query);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const loadingRef = useRef(null);

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
      
      setHasMore(newArticles.length === 30);
      return newArticles;
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  }, []);

  useEffect(() => {
    if (loadingMore || !hasMore || loading || !query) return;
    
    const options = {
      root: null,
      rootMargin: '200px',
      threshold: 0.1
    };
    
    observerRef.current = new IntersectionObserver((entries) => {
      const firstEntry = entries[0];
      if (firstEntry.isIntersecting && !loadingMore && hasMore && !loading && query) {
        setLoadingMore(true);
        const nextPage = page + 1;
        setPage(nextPage);
        performSearch(query, nextPage, true).finally(() => {
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
  }, [loadingMore, hasMore, loading, page, performSearch, query]);

  useEffect(() => {
    if (query && query.trim()) {
      setPage(1);
      setResults([]);
      setHasMore(true);
      setLoading(true);
      performSearch(query, 1, false).finally(() => setLoading(false));
    } else {
      setResults([]);
      setHasMore(false);
    }
  }, [query, performSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  const handleClear = () => {
    setSearchInput('');
    setSearchParams({});
    setResults([]);
  };

  return (
    <div className="container mx-auto px-4 py-6 pt-20 lg:pt-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4 dark:text-white">Search News</h1>
        
        <form onSubmit={handleSearch} className="relative w-full max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <FaSearch className="text-gray-400 dark:text-gray-500 text-sm lg:text-base" />
          </div>
          
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for news..."
            className="w-full px-10 py-2.5 lg:py-3 text-sm lg:text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          
          {searchInput && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-14 flex items-center pr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <FaTimes className="text-sm lg:text-base" />
            </button>
          )}
          
          <button
            type="submit"
            className="absolute inset-y-0 right-0 px-4 lg:px-5 bg-blue-600 text-white text-sm lg:text-base font-medium rounded-r-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </form>
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
      ) : query && !loading ? null : null}
    </div>
  );
};