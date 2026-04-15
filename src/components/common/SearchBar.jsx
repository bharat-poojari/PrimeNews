import { useState, useRef, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnalyticsStore } from '../../store/analyticsStore';

export const SearchBar = ({ onSearch, initialValue = '', autoFocus = false }) => {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const { searchHistory, trackSearch } = useAnalyticsStore();

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      trackSearch(query.trim());
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    trackSearch(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    if (searchHistory.length > 0) {
      setSuggestions(searchHistory);
      setShowSuggestions(true);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Search for news..."
          className="w-full px-5 py-3 pl-12 pr-10 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        )}
        
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
          >
            <div className="p-2">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 px-2">
                Recent Searches
              </p>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <FaSearch className="inline mr-2 text-gray-400 text-sm" />
                  <span className="text-gray-700 dark:text-gray-300">{suggestion}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};