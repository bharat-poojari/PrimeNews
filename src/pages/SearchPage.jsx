import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { newsService } from '../services/api';
import { NewsCard } from '../components/news/NewsCard';
import { SearchBar } from '../components/common/SearchBar';
import { LoaderSkeleton } from '../components/common/LoaderSkeleton';
import { useDebounce } from '../hooks/useDebounce';
import { FaSearch, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [searchError, setSearchError] = useState(null);
  const loaderRef = useRef(null);

  const debouncedQuery = useDebounce(query, 500);

  const performSearch = useCallback(async (searchQuery, pageNum, isLoadMore = false) => {
    if (!searchQuery || searchQuery.trim() === '') {
      setResults([]);
      setHasMore(false);
      setTotalResults(0);
      return [];
    }

    try {
      setSearchError(null);
      console.log(`Searching for: "${searchQuery}" on page ${pageNum}`);
      
      const data = await newsService.searchNews(searchQuery, pageNum);
      const newArticles = data.articles || [];
      
      console.log(`Found ${newArticles.length} results for "${searchQuery}"`);
      
      if (isLoadMore) {
        setResults(prev => [...prev, ...newArticles]);
      } else {
        setResults(newArticles);
      }
      
      setTotalResults(data.totalResults || 0);
      
      // Check if there are more results
      const totalFetched = isLoadMore ? results.length + newArticles.length : newArticles.length;
      setHasMore(newArticles.length === 30 && totalFetched < (data.totalResults || 0));
      
      if (newArticles.length === 0 && !isLoadMore) {
        toast.error(`No results found for "${searchQuery}"`);
      }
      
      return newArticles;
    } catch (error) {
      console.error('Search failed:', error);
      setSearchError('Failed to fetch search results. Please try again.');
      toast.error('Search failed. Please try again.');
      return [];
    }
  }, [results.length]);

  // Initial search when query changes
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
      setTotalResults(0);
    }
  }, [debouncedQuery, performSearch]);

  // Load more results
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading && debouncedQuery && debouncedQuery.trim()) {
          setLoadingMore(true);
          const nextPage = page + 1;
          setPage(nextPage);
          performSearch(debouncedQuery, nextPage, true).finally(() => setLoadingMore(false));
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, page, performSearch, debouncedQuery]);

  const handleSearch = (searchQuery) => {
    if (searchQuery && searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
      setPage(1);
      setResults([]);
      setHasMore(true);
    }
  };

  const clearSearch = () => {
    setSearchParams({});
    setResults([]);
    setTotalResults(0);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4 dark:text-white">Search News</h1>
        
        <div className="mb-6">
          <SearchBar 
            initialValue={query}
            onSearch={handleSearch}
            autoFocus={true}
          />
        </div>

        {query && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {loading ? 'Searching...' : (
                totalResults > 0 
                  ? `Found ${totalResults} results for "${query}" - Showing ${results.length}`
                  : !loading && `No results found for "${query}"`
              )}
            </p>
            {results.length > 0 && (
              <button
                onClick={clearSearch}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1"
              >
                <FaTimes className="text-xs" />
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {searchError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-700 dark:text-red-400 text-sm">{searchError}</p>
        </div>
      )}

      {loading && results.length === 0 ? (
        <LoaderSkeleton type="grid" />
      ) : results.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((article, index) => (
              <NewsCard key={`${article.url}-${index}`} article={article} />
            ))}
          </div>
          
          {(loadingMore || hasMore) && (
            <div ref={loaderRef} className="text-center py-8">
              {loadingMore && (
                <div className="inline-flex items-center space-x-2">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-600 dark:text-gray-400">Loading more results...</span>
                </div>
              )}
            </div>
          )}
          
          {!hasMore && results.length > 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-8 py-8">
              End of results
            </p>
          )}
        </>
      ) : query && !loading ? (
        <div className="text-center py-12">
          <div className="inline-block p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
            <FaSearch className="text-4xl text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2 dark:text-white">No results found</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            We couldn't find any news matching "{query}". Try different keywords or browse our categories.
          </p>
          <div className="mt-6">
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Home
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};