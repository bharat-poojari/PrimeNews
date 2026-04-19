// src/pages/HomePage.jsx - Optimized version
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaNewspaper, FaArrowRight, FaFilter } from 'react-icons/fa';
import { BreakingTicker } from '../components/layout/BreakingTicker';
import { HeroSection } from '../components/news/HeroSection';
import { NewsCard } from '../components/news/NewsCard';
import { CategoryTabs } from '../components/common/CategoryTabs';
import { LoaderSkeleton } from '../components/common/LoaderSkeleton';
import { newsService } from '../services/api';
import { Link } from 'react-router-dom';
import { useNewsStore } from '../store/newsStore';

export const HomePage = () => {
  const [featuredNews, setFeaturedNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [allCategoryNews, setAllCategoryNews] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAllCategories, setShowAllCategories] = useState(true);
  const { currentCategory, setCurrentCategory } = useNewsStore();

  const categories = ['technology', 'business', 'sports', 'entertainment', 'science', 'health'];

  const fetchCategoryNews = async (category) => {
    const data = await newsService.fetchTopHeadlines(category, 'us', 1);
    return (data.articles || []).slice(0, 6);
  };

  const fetchAllCategoriesNews = async () => {
    // Parallel fetching for all categories - MUCH FASTER
    const promises = categories.map(cat => fetchCategoryNews(cat));
    const results = await Promise.all(promises);
    
    const categoryData = {};
    categories.forEach((cat, index) => {
      categoryData[cat] = results[index];
    });
    setAllCategoryNews(categoryData);
  };

  const handleCategorySelect = async (categoryId) => {
    setCurrentCategory(categoryId);
    setShowAllCategories(false);
    setLoading(true);
    
    // Parallel fetch for both headline and category news
    const [headlines, categoryArticles] = await Promise.all([
      newsService.fetchTopHeadlines(categoryId, 'us', 1),
      fetchCategoryNews(categoryId)
    ]);
    
    setFeaturedNews(headlines.articles || []);
    setFilteredNews(categoryArticles);
    setLoading(false);
  };

  const handleShowAllCategories = async () => {
    setCurrentCategory('general');
    setShowAllCategories(true);
    setLoading(true);
    
    // Parallel fetch for all data
    const [headlines, categoryData] = await Promise.all([
      newsService.fetchTopHeadlines('general', 'us', 1),
      fetchAllCategoriesNews()
    ]);
    
    setFeaturedNews(headlines.articles || []);
    setLoading(false);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      
      // Parallel fetch for initial data - MUCH FASTER
      const [headlines, categoryData] = await Promise.all([
        newsService.fetchTopHeadlines('general', 'us', 1),
        fetchAllCategoriesNews()
      ]);
      
      setFeaturedNews(headlines.articles || []);
      setShowAllCategories(true);
      setCurrentCategory('general');
      setLoading(false);
    };
    
    loadInitialData();
  }, []);

  const getCategoryDisplayName = () => {
    const names = {
      general: 'General', business: 'Business', technology: 'Technology',
      entertainment: 'Entertainment', sports: 'Sports', science: 'Science', health: 'Health'
    };
    return names[currentCategory] || 'General';
  };

  // Show loading state only on first load
  if (loading && featuredNews.length === 0) {
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
            transition={{ duration: 0.3 }}
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

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div>
                <h2 className="font-serif text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {showAllCategories ? 'Top Stories' : `${getCategoryDisplayName()} News`}
                </h2>
                <div className="w-12 h-0.5 bg-gradient-to-r from-blue-600 to-transparent" />
              </div>
              {!showAllCategories && (
                <Link 
                  to={`/category/${currentCategory}`}
                  className="group flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium"
                >
                  <span>View All</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform text-xs" />
                </Link>
              )}
            </div>
          </motion.section>

          {!showAllCategories && filteredNews.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className="mb-12"
            >
              <div className="mb-4">
                <h2 className="font-serif text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1 capitalize">
                  More {currentCategory} News
                </h2>
                <div className="w-12 h-0.5 bg-gradient-to-r from-blue-600 to-transparent" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredNews.map((article, index) => (
                  <NewsCard key={`filtered-${index}`} article={article} />
                ))}
              </div>
            </motion.section>
          )}

          {showAllCategories && Object.entries(allCategoryNews).map(([category, articles], idx) => (
            articles.length > 0 && (
              <motion.section
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * idx, duration: 0.3 }}
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
                  {articles.slice(0, 6).map((article, i) => (
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