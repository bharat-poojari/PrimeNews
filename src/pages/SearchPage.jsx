// src/pages/SearchPage.jsx
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { newsService } from '../services/api';
import { NewsCard } from '../components/news/NewsCard';
import { SearchBar } from '../components/common/SearchBar';
import { LoaderSkeleton } from '../components/common/LoaderSkeleton';
import { useDebounce } from '../hooks/useDebounce';
import { FaSearch, FaTimes, FaArrowLeft } from 'react-icons/fa';

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const debouncedQuery = useDebounce(query, 500);

  const performSearch = async (searchQuery) => {
    if (!searchQuery || searchQuery.trim() === '') {
      setResults([]);
      setTotalResults(0);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);
    
    try {
      const data = await newsService.searchNews(searchQuery, 1);
      setResults(data.articles || []);
      setTotalResults(data.totalResults || 0);
    } catch (error) {
      console.error('Search error:', error);
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
      setHasSearched(false);
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
    setHasSearched(false);
  };

  return (
    <div className="container-custom py-6 lg:py-8">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 mb-6 transition-colors text-sm"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-600 rounded-lg">
            <FaSearch className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold dark:text-white">Search News</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Find the latest news articles from around the world</p>
          </div>
        </div>
        
        <SearchBar 
          initialValue={query} 
          onSearch={handleSearch} 
          autoFocus={true} 
          placeholder="Search for news articles... (e.g., technology, sports, politics)"
        />
      </div>

      {/* Results Info */}
      {query && (
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching for "{query}"...
              </span>
            ) : totalResults > 0 ? (
              `Found ${totalResults} results for "${query}"`
            ) : hasSearched && (
              `No results found for "${query}"`
            )}
          </p>
          {results.length > 0 && (
            <button 
              onClick={clearSearch} 
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1 transition-colors"
            >
              <FaTimes className="text-xs" /> Clear
            </button>
          )}
        </div>
      )}

      {/* Results Grid */}
      {loading ? (
        <LoaderSkeleton type="grid" count={6} />
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((article, index) => (
            <NewsCard key={`${article.url}-${index}`} article={article} />
          ))}
        </div>
      ) : hasSearched && query && !loading ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaSearch className="text-3xl text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2 dark:text-white">No results found</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            We couldn't find any news matching "{query}". Try different keywords or browse our categories.
          </p>
          <div className="flex gap-3 justify-center mt-6">
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
                setHasSearched(false);
              }} 
              className="px-5 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Clear Search
            </button>
          </div>
        </div>
      ) : null}

      {/* Empty state - no search performed yet */}
      {!query && !hasSearched && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaSearch className="text-3xl text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2 dark:text-white">Ready to search</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Enter a keyword above to search for news articles. Try searching for topics like "technology", "sports", or "business".
          </p>
          <div className="flex flex-wrap gap-2 justify-center mt-6">
            {['Technology', 'Sports', 'Business', 'Politics', 'Health', 'Science'].map((topic) => (
              <button
                key={topic}
                onClick={() => handleSearch(topic.toLowerCase())}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};