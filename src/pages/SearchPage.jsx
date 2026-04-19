// PrimeNews/src/pages/SearchPage.jsx
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
  const observerRef = useRef(null);
  const loadingRef = useRef(null);
  const [maxPagesLoaded, setMaxPagesLoaded] = useState(0);

  const debouncedQuery = useDebounce(query, 500);

  const performSearch = useCallback(async (searchQuery, pageNum, isLoadMore = false) => {
    if (!searchQuery || searchQuery.trim() === '') {
      setResults([]);
      setHasMore(false);
      setTotalResults(0);
      setMaxPagesLoaded(0);
      return [];
    }

    try {
      setSearchError(null);
      console.log(`Searching for: "${searchQuery}" on page ${pageNum}`);
      
      const data = await newsService.searchNews(searchQuery, pageNum);
      const newArticles = data.articles || [];
      
      console.log(`Found ${newArticles.length} results on page ${pageNum}. Total results: ${data.totalResults || 0}`);
      
      if (isLoadMore) {
        setResults(prev => {
          // Remove duplicates based on URL
          const existingUrls = new Set(prev.map(a => a.url));
          const uniqueNewArticles = newArticles.filter(a => !existingUrls.has(a.url));
          console.log(`Adding ${uniqueNewArticles.length} new unique articles`);
          return [...prev, ...uniqueNewArticles];
        });
      } else {
        setResults(newArticles);
        setMaxPagesLoaded(1);
      }
      
      const total = data.totalResults || 0;
      setTotalResults(total);
      
      // Calculate if there are more pages to load
      // API returns max 30 per page, so check if we've loaded all available pages
      const resultsPerPage = 30;
      const maxPages = Math.ceil(Math.min(total, 100) / resultsPerPage); // Most APIs limit to 100 results max
      const currentPageLoaded = pageNum;
      const hasMorePages = currentPageLoaded < maxPages && newArticles.length === resultsPerPage;
      
      setHasMore(hasMorePages);
      
      if (!hasMorePages) {
        console.log(`No more pages to load. Loaded ${currentPageLoaded} of ${maxPages} pages`);
      }
      
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
  }, []);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (loadingMore || !hasMore || loading || !debouncedQuery) return;
    
    const options = {
      root: null,
      rootMargin: '200px', // Increased margin to load earlier
      threshold: 0.1
    };
    
    observerRef.current = new IntersectionObserver((entries) => {
      const firstEntry = entries[0];
      if (firstEntry.isIntersecting && !loadingMore && hasMore && !loading && debouncedQuery) {
        console.log('Loading more results...');
        setLoadingMore(true);
        const nextPage = page + 1;
        setPage(nextPage);
        performSearch(debouncedQuery, nextPage, true).finally(() => {
          setLoadingMore(false);
          setMaxPagesLoaded(prev => prev + 1);
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

  // Initial search when query changes
  useEffect(() => {
    if (debouncedQuery && debouncedQuery.trim()) {
      setPage(1);
      setResults([]);
      setHasMore(true);
      setLoading(true);
      setMaxPagesLoaded(0);
      performSearch(debouncedQuery, 1, false).finally(() => setLoading(false));
    } else {
      setResults([]);
      setHasMore(false);
      setTotalResults(0);
      setMaxPagesLoaded(0);
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

  const clearSearch = () => {
    setSearchParams({});
    setResults([]);
    setTotalResults(0);
    setHasMore(false);
    setPage(1);
    setMaxPagesLoaded(0);
  };

  const loadAllRemaining = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    let currentPage = page;
    let hasMorePages = true;
    
    while (hasMorePages && currentPage < 10) { // Max 10 pages to prevent overloading
      currentPage++;
      console.log(`Loading page ${currentPage}...`);
      const newArticles = await performSearch(debouncedQuery, currentPage, true);
      setPage(currentPage);
      
      // Check if we got less than 30 results (means last page)
      hasMorePages = newArticles.length === 30;
      if (!hasMorePages) {
        setHasMore(false);
        break;
      }
      
      // Small delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setLoadingMore(false);
    toast.success(`Loaded all available results!`);
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
          />
        </div>

        {query && (
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {loading ? 'Searching...' : (
                totalResults > 0 
                  ? `Found ${totalResults.toLocaleString()} results for "${query}" - Showing ${results.length} articles`
                  : !loading && `No results found for "${query}"`
              )}
            </p>
            <div className="flex gap-2">
              {results.length > 0 && results.length < totalResults && !loading && (
                <button
                  onClick={loadAllRemaining}
                  disabled={loadingMore}
                  className="text-sm px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Load All Results
                </button>
              )}
              <button
                onClick={clearSearch}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1 transition-colors"
              >
                <FaTimes className="text-xs" />
                Clear search
              </button>
            </div>
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
          
          {/* Infinite Scroll Loader */}
          <div ref={loadingRef} className="text-center py-8">
            {loadingMore && (
              <div className="inline-flex items-center space-x-3">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  Loading more results... ({results.length} / {Math.min(totalResults, 100)})
                </span>
              </div>
            )}
            {!hasMore && !loadingMore && results.length > 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                <p className="text-sm">
                  Loaded {results.length} of {Math.min(totalResults, 100)} results
                  {totalResults > 100 && " (API limit: 100 results max)"}
                </p>
                {totalResults > 100 && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Note: News APIs typically limit search results to 100 articles
                  </p>
                )}
              </div>
            )}
            {hasMore && !loadingMore && !loading && results.length > 0 && (
              <div className="text-center text-gray-400 dark:text-gray-600 py-4">
                <p className="text-xs">Scroll down to load more results...</p>
                <p className="text-xs mt-1">
                  Loaded {results.length} of {Math.min(totalResults, 100)} results
                </p>
              </div>
            )}
          </div>
        </>
      ) : query && !loading ? (
        <div className="text-center py-12">
          <div className="inline-block p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
            <FaSearch className="text-4xl text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2 dark:text-white">No results found</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto text-sm">
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