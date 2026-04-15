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
  const [totalResults, setTotalResults] = useState(0);
  const loaderRef = useRef(null);

  const debouncedQuery = useDebounce(query, 500);

  const performSearch = useCallback(async (searchQuery, pageNum, isLoadMore = false) => {
    if (!searchQuery) {
      setResults([]);
      setHasMore(false);
      return;
    }

    try {
      const data = await newsService.searchNews(searchQuery, pageNum);
      const newArticles = data.articles || [];
      
      if (isLoadMore) {
        setResults(prev => [...prev, ...newArticles]);
      } else {
        setResults(newArticles);
      }
      
      setTotalResults(data.totalResults || 0);
      setHasMore(newArticles.length === 30 && (pageNum * 30) < (data.totalResults || 1000));
      
      return newArticles;
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  }, []);

  useEffect(() => {
    if (debouncedQuery) {
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading && debouncedQuery) {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Search News</h1>
      
      <div className="mb-8">
        <SearchBar 
          initialValue={query}
          onSearch={(q) => setSearchParams({ q })}
        />
      </div>

      {loading && results.length === 0 ? (
        <LoaderSkeleton type="grid" />
      ) : results.length > 0 ? (
        <>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Found {totalResults} results for "{debouncedQuery}" - Showing {results.length}
          </p>
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
          
          {!hasMore && (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-8 py-8">
              End of results
            </p>
          )}
        </>
      ) : debouncedQuery ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            No results found for "{debouncedQuery}"
          </p>
        </div>
      ) : null}
    </div>
  );
};