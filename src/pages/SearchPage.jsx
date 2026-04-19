// PrimeNews/src/pages/SearchPage.jsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { newsService } from '../services/api';
import { NewsCard } from '../components/news/NewsCard';
import { SearchBar } from '../components/common/SearchBar';
import { LoaderSkeleton } from '../components/common/LoaderSkeleton';
import { useDebounce } from '../hooks/useDebounce';
import { FaSearch, FaTimes } from 'react-icons/fa';

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  const debouncedQuery = useDebounce(query, 500);

  const performSearch = async (searchQuery) => {
    if (!searchQuery || searchQuery.trim() === '') {
      setResults([]);
      setTotalResults(0);
      return;
    }

    try {
      setLoading(true);
      const data = await newsService.searchNews(searchQuery, 1);
      setResults(data.articles || []);
      setTotalResults(data.totalResults || 0);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedQuery && debouncedQuery.trim()) {
      performSearch(debouncedQuery);
    } else {
      setResults([]);
      setTotalResults(0);
    }
  }, [debouncedQuery]);

  const handleSearch = (searchQuery) => {
    if (searchQuery && searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
    }
  };

  const clearSearch = () => {
    setSearchParams({});
    setResults([]);
    setTotalResults(0);
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
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

      {loading && results.length === 0 ? (
        <LoaderSkeleton type="grid" />
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((article, index) => (
            <NewsCard key={`${article.url}-${index}`} article={article} />
          ))}
        </div>
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