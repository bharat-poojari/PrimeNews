// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaFilter, FaNewspaper } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { BreakingTicker } from '../components/layout/BreakingTicker';
import { HeroSection } from '../components/news/HeroSection';
import { NewsCard } from '../components/news/NewsCard';
import { CategoryTabs } from '../components/common/CategoryTabs';
import { LoaderSkeleton } from '../components/common/LoaderSkeleton';
import { useNews } from '../hooks/useNews';
import { newsService } from '../services/api';

export const HomePage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [showAllCategories, setShowAllCategories] = useState(true);
  const [categoryNews, setCategoryNews] = useState({});
  const [categoryLoading, setCategoryLoading] = useState({});
  
  // Fetch main featured news
  const { articles: featuredNews, loading: featuredLoading } = useNews('general', 20);
  
  const categories = ['technology', 'business', 'sports', 'entertainment', 'science', 'health'];

  // Fetch news for each category
  useEffect(() => {
    const fetchAllCategoryNews = async () => {
      for (const cat of categories) {
        setCategoryLoading(prev => ({ ...prev, [cat]: true }));
        try {
          const data = await newsService.fetchTopHeadlines(cat, 'us', 1);
          setCategoryNews(prev => ({ ...prev, [cat]: data.articles || [] }));
        } catch (error) {
          console.error(`Failed to fetch ${cat} news:`, error);
          setCategoryNews(prev => ({ ...prev, [cat]: [] }));
        } finally {
          setCategoryLoading(prev => ({ ...prev, [cat]: false }));
        }
      }
    };
    
    fetchAllCategoryNews();
  }, []);

  // Handle category tab click - navigate to category page
  const handleCategorySelect = (categoryId) => {
    if (categoryId === 'general') {
      setShowAllCategories(true);
      setSelectedCategory('general');
    } else {
      navigate(`/category/${categoryId}`);
    }
  };

  // Handle "View All" button click - navigate to category page
  const handleViewAll = (category) => {
    navigate(`/category/${category}`);
  };

  if (featuredLoading && featuredNews.length === 0) {
    return <LoaderSkeleton type="home" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <BreakingTicker />
      
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        {/* Hero Section */}
        <div className="mb-10 lg:mb-12">
          <HeroSection articles={featuredNews.slice(0, 6)} />
        </div>

        {/* Categories Section */}
        <section className="mb-10 lg:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="font-serif text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                Latest News
              </h2>
              <div className="w-16 h-0.5 bg-blue-600 mt-1 rounded-full" />
            </div>
          </div>
          
          <CategoryTabs 
            onCategorySelect={handleCategorySelect} 
            activeCategory={selectedCategory}
          />
        </section>

        {/* News Grid - All Categories View */}
        <AnimatePresence mode="wait">
          <motion.div
            key="all-categories"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-10 lg:space-y-12"
          >
            {categories.map((category) => (
              categoryNews[category] && categoryNews[category].length > 0 && (
                <div key={category} className="category-section">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-serif text-xl lg:text-2xl font-bold text-gray-900 dark:text-white capitalize">
                      {category}
                    </h3>
                    <button
                      onClick={() => handleViewAll(category)}
                      className="group flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                    >
                      <span>View All</span>
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform text-xs" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {categoryNews[category].slice(0, 6).map((article, index) => (
                      <NewsCard key={`${category}-${article.url || index}`} article={article} />
                    ))}
                  </div>
                </div>
              )
            ))}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default HomePage;