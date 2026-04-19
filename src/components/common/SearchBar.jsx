// PrimeNews/src/components/common/SearchBar.jsx
import { useState, useRef, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

export const SearchBar = ({ onSearch, initialValue = '', autoFocus = false, placeholder = "Search for news..." }) => {
  const [query, setQuery] = useState(initialValue);
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
    onSearch('');
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value === '') {
      onSearch('');
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
          className="absolute inset-y-0 right-0 px-4 lg:px-5 bg-blue-600 text-white text-sm lg:text-base font-medium rounded-r-lg hover:bg-blue-700 transition-colors"
          aria-label="Search"
        >
          Search
        </button>
      </form>
    </div>
  );
};