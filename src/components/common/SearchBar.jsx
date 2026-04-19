// PrimeNews/src/components/common/SearchBar.jsx
import { useState, useRef, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export const SearchBar = ({ onSearch, initialValue = '', autoFocus = false, placeholder = "Search for news..." }) => {
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
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    const savedSearches = localStorage.getItem('recent_searches');
    if (savedSearches && JSON.parse(savedSearches).length > 0) {
      setSuggestions(JSON.parse(savedSearches).slice(0, 5));
      setShowSuggestions(true);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value === '') {
      onSearch('');
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative w-full">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <FaSearch className="text-gray-400 dark:text-gray-500 text-sm lg:text-base" />
        </div>
        
        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          className="w-full px-10 py-2.5 lg:py-3 text-sm lg:text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
        />
        
        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-14 flex items-center pr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Clear search"
          >
            <FaTimes className="text-sm lg:text-base" />
          </button>
        )}
        
        {/* Search Button */}
        <button
          type="submit"
          className="absolute inset-y-0 right-0 px-4 lg:px-5 bg-blue-600 text-white text-sm lg:text-base font-medium rounded-r-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
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
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
          >
            <div className="py-2">
              <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Recent Searches
                </p>
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 group"
                >
                  <FaSearch className="text-gray-400 dark:text-gray-500 text-xs group-hover:text-blue-500 transition-colors" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm flex-1">{suggestion}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to search
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};