// src/pages/HomePage.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaNewspaper, FaArrowRight, FaFilter } from 'react-icons/fa';
import { BreakingTicker } from '../components/layout/BreakingTicker';
import { HeroSection } from '../components/news/HeroSection';
import { NewsCard } from '../components/news/NewsCard';
import { CategoryTabs } from '../components/common/CategoryTabs';
import { LoaderSkeleton } from '../components/common/LoaderSkeleton';
import { useNews } from '../hooks/useNews';
import { Link } from 'react-router-dom';
import { useNewsStore } from '../store/newsStore';

export const HomePage = () => {
  const [showAllCategories, setShowAllCategories] = useState(true);
  const { currentCategory, setCurrentCategory } = useNewsStore();
  
  const { articles: featuredNews, loading: featuredLoading } = useNews('general', 20);
  const { articles: techNews, loading: techLoading } = useNews('technology', 6);
  const { articles: businessNews, loading: businessLoading } = useNews('business', 6);
  const { articles: sportsNews, loading: sportsLoading } = useNews('sports', 6);
  const { articles: entertainmentNews, loading: entertainmentLoading } = useNews('entertainment', 6);
  const { articles: scienceNews, loading: scienceLoading } = useNews('science', 6);
  const { articles: healthNews, loading: healthLoading } = useNews('health', 6);

  const allCategoryNews = {
    technology: techNews,
    business: businessNews,
    sports: sportsNews,
    entertainment: entertainmentNews,
    science: scienceNews,
    health: healthNews,
  };

  const categories = ['technology', 'business', 'sports', 'entertainment', 'science', 'health'];

  const handleCategorySelect = (categoryId) => {
    setCurrentCategory(categoryId);
    setShowAllCategories(false);
  };

  const handleShowAllCategories = () => {
    setCurrentCategory('general');
    setShowAllCategories(true);
  };

  const getCategoryDisplayName = () => {
    const names = {
      general: 'General', business: 'Business', technology: 'Technology',
      entertainment: 'Entertainment', sports: 'Sports', science: 'Science', health: 'Health'
    };
    return names[currentCategory] || 'General';
  };

  if (featuredLoading && featuredNews.length === 0) {
    return <LoaderSkeleton type="home" />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 w-full">
      <BreakingTicker />
      
      <main className="w-full">
        <div className="w-full">
          <HeroSection articles={featuredNews} />
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div>
                <h2 className="font-serif text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  News Categories
                </h2>
                <div className="w-16 h-0.5 bg-gradient-to-r from-blue-600 to-transparent" />
              </div>
              {!showAllCategories && (
                <button
                  onClick={handleShowAllCategories}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                  <FaFilter className="text-xs" />
                  Show All Categories
                </button>
              )}
            </div>
            <CategoryTabs 
              onCategorySelect={handleCategorySelect} 
              activeCategory={currentCategory}
            />
          </motion.section>

          {showAllCategories && categories.map((category) => (
            allCategoryNews[category]?.length > 0 && (
              <motion.section
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
              >
                <div className="relative mb-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <h2 className="font-serif text-xl lg:text-2xl font-bold text-gray-900 dark:text-white capitalize mb-1">
                        {category}
                      </h2>
                      <div className="w-12 h-0.5 bg-gradient-to-r from-blue-600 to-transparent" />
                    </div>
                    <button
                      onClick={() => handleCategorySelect(category)}
                      className="group flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium"
                    >
                      <span>View All</span>
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform text-xs" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {allCategoryNews[category].slice(0, 6).map((article, i) => (
                    <NewsCard key={`${category}-${i}`} article={article} />
                  ))}
                </div>
              </motion.section>
            )
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomePage;