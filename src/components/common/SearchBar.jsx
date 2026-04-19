// PrimeNews/src/components/common/SearchBar.jsx
import { useState, useRef, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export const SearchBar = ({ onSearch, initialValue = '', autoFocus = false }) => {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recent_searches');
    if (savedSearches) {
      setSuggestions(JSON.parse(savedSearches).slice(0, 5));
    }
  }, []);

  const saveToRecentSearches = (searchTerm) => {
    const savedSearches = localStorage.getItem('recent_searches');
    let searches = savedSearches ? JSON.parse(savedSearches) : [];
    searches = [searchTerm, ...searches.filter(s => s !== searchTerm)].slice(0, 5);
    localStorage.setItem('recent_searches', JSON.stringify(searches));
    setSuggestions(searches);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      saveToRecentSearches(query.trim());
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    saveToRecentSearches(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
    onSearch('');
  };

  const handleFocus = () => {
    const savedSearches = localStorage.getItem('recent_searches');
    if (savedSearches) {
      setSuggestions(JSON.parse(savedSearches).slice(0, 5));
      setShowSuggestions(true);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value === '') {
      onSearch('');
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Search for news..."
          className="w-full px-4 py-2.5 pl-10 pr-20 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
        
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-16 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Clear search"
          >
            <FaTimes className="text-sm" />
          </button>
        )}
        
        <button
          type="submit"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
          aria-label="Search"
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
            className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
          >
            <div className="p-1">
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-1 px-2 pt-1">
                Recent Searches
              </p>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-sm"
                >
                  <FaSearch className="inline mr-2 text-gray-400 text-[10px]" />
                  <span className="text-gray-700 dark:text-gray-300 text-xs">{suggestion}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};