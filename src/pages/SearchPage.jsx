// src/pages/SearchPage.jsx
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { newsService } from '../services/api';
import { NewsCard } from '../components/news/NewsCard';
import { SearchBar } from '../components/common/SearchBar';
import { LoaderSkeleton } from '../components/common/LoaderSkeleton';
import { useDebounce } from '../hooks/useDebounce';
import { FaSearch, FaTimes, FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [searchError, setSearchError] = useState(null);

  const debouncedQuery = useDebounce(query, 500);

  const performSearch = async (searchQuery) => {
    if (!searchQuery || searchQuery.trim() === '') {
      setResults([]);
      setTotalResults(0);
      return;
    }

    try {
      setSearchError(null);
      setLoading(true);
      console.log(`Searching for: "${searchQuery}"`);
      
      const data = await newsService.searchNews(searchQuery, 1);
      const newArticles = data.articles || [];
      
      console.log(`Found ${newArticles.length} results for "${searchQuery}"`);
      setResults(newArticles);
      setTotalResults(data.totalResults || 0);
      
      if (newArticles.length === 0 && searchQuery.trim()) {
        toast.error(`No results found for "${searchQuery}"`);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setSearchError('Failed to fetch search results. Please try again.');
      toast.error('Search failed. Please try again.');
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
    <div className="container mx-auto px-4 py-6 pt-20 lg:pt-24">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-4 transition-colors"
      >
        <FaArrowLeft className="mr-2" />
        Go Back
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4 dark:text-white">Search News</h1>
        
        <div className="mb-6">
          <SearchBar 
            initialValue={query}
            onSearch={handleSearch}
            autoFocus={true}
            placeholder="Search for news articles..."
          />
        </div>

        {query && (
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
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
          <button
            onClick={() => performSearch(query)}
            className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

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
          <div className="mt-6 flex gap-3 justify-center">
            <button
              onClick={() => navigate('/')}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Home
            </button>
            <button
              onClick={() => {
                setSearchParams({});
                setResults([]);
                setTotalResults(0);
              }}
              className="px-5 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Clear Search
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};