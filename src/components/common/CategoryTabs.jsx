// src/components/common/CategoryTabs.jsx
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  FaNewspaper, 
  FaBriefcase, 
  FaLaptopCode, 
  FaFilm, 
  FaFutbol, 
  FaFlask, 
  FaHeartbeat,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

export const CategoryTabs = ({ onCategorySelect, activeCategory = 'general' }) => {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollContainerRef = useRef(null);
  
  const CATEGORIES = [
    { id: "general", name: "General", icon: FaNewspaper, color: "blue" },
    { id: "business", name: "Business", icon: FaBriefcase, color: "green" },
    { id: "technology", name: "Technology", icon: FaLaptopCode, color: "purple" },
    { id: "entertainment", name: "Entertainment", icon: FaFilm, color: "pink" },
    { id: "sports", name: "Sports", icon: FaFutbol, color: "orange" },
    { id: "science", name: "Science", icon: FaFlask, color: "teal" },
    { id: "health", name: "Health", icon: FaHeartbeat, color: "red" }
  ];

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -250 : 250;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScrollEvent = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      handleScrollEvent();
      container.addEventListener('scroll', handleScrollEvent);
      window.addEventListener('resize', handleScrollEvent);
      return () => {
        container.removeEventListener('scroll', handleScrollEvent);
        window.removeEventListener('resize', handleScrollEvent);
      };
    }
  }, []);

  const colorClasses = {
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    green: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    pink: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    orange: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    teal: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
    red: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
  };

  const handleCategoryClick = (categoryId) => {
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    }
  };

  return (
    <div className="relative">
      {showLeftArrow && (
        <button
          onClick={() => handleScroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full shadow-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-200 dark:border-gray-700"
          aria-label="Scroll left"
        >
          <FaChevronLeft className="text-gray-600 dark:text-gray-400 text-sm" />
        </button>
      )}
      
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-hide py-2 px-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex space-x-2 min-w-max">
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category.id;
            return (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategoryClick(category.id)}
                className={`
                  px-4 py-2 rounded-full font-medium transition-all duration-300 
                  flex items-center gap-2 text-sm md:text-base whitespace-nowrap
                  ${isActive 
                    ? `${colorClasses[category.color]} shadow-md scale-105` 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }
                `}
              >
                <category.icon className={`text-sm md:text-base ${isActive ? 'animate-pulse' : ''}`} />
                <span className="font-semibold">{category.name}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
      
      {showRightArrow && (
        <button
          onClick={() => handleScroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full shadow-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-200 dark:border-gray-700"
          aria-label="Scroll right"
        >
          <FaChevronRight className="text-gray-600 dark:text-gray-400 text-sm" />
        </button>
      )}
    </div>
  );
};