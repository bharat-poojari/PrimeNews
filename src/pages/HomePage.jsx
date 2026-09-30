// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { BreakingTicker } from '../components/layout/BreakingTicker';
import { HeroSection } from '../components/news/HeroSection';
import { NewsCard } from '../components/news/NewsCard';
import { CategoryTabs } from '../components/common/CategoryTabs';
import { LoaderSkeleton } from '../components/common/LoaderSkeleton';
import { useNews } from '../hooks/useNews';
import { newsService } from '../services/api';

const CATEGORIES = ['india', 'technology', 'business', 'sports', 'entertainment', 'science', 'health'];

export const HomePage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [categoryNews, setCategoryNews] = useState({});
  
  // Fetch main featured news
  const { articles: featuredNews, loading: featuredLoading } = useNews('general', 20);
  const spotlightStories = featuredNews.slice(5, 9);

  useEffect(() => {
    let isCurrent = true;
    const fetchAllCategoryNews = async () => {
      const categoryResults = await Promise.all(CATEGORIES.map(async (category) => {
        try {
          const data = await newsService.fetchTopHeadlines(category, 'us', 1);
          return [category, data.articles || []];
        } catch (error) {
          console.error(`Failed to fetch ${category} news:`, error);
          return [category, []];
        }
      }));

      if (isCurrent) setCategoryNews(Object.fromEntries(categoryResults));
    };
    
    fetchAllCategoryNews();

    return () => {
      isCurrent = false;
    };
  }, []);

  // Handle category tab click - navigate to category page
  const handleCategorySelect = (categoryId) => {
    if (categoryId === 'general') {
      setSelectedCategory('general');
    } else {
      navigate(`/category/${categoryId}`);
    }
  };

  // Handle "View All" button click - navigate to category page
  const handleViewAll = (category) => {
    navigate(`/category/${category}`);
  };

  const renderCategoryStories = (category, articles) => {
    if (category === 'business' || category === 'sports') {
      return (
        <div className="grid grid-cols-1 xl:grid-cols-2 xl:gap-x-10">
          {articles.slice(0, 8).map((article, index) => (
            <NewsCard key={`${category}-${article.url || index}`} article={article} variant="brief" />
          ))}
        </div>
      );
    }

    const columns = category === 'technology' || category === 'entertainment'
      ? 'xl:grid-cols-3'
      : 'xl:grid-cols-4';
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${columns} gap-5 md:gap-6`}>
        {articles.slice(0, 8).map((article, index) => (
          <NewsCard key={`${category}-${article.url || index}`} article={article} />
        ))}
      </div>
    );
  };

  if (featuredLoading && featuredNews.length === 0) {
    return <LoaderSkeleton type="home" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <BreakingTicker />
      
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        {/* Hero Section */}
        <div className="mb-8 lg:mb-10">
          <HeroSection articles={featuredNews.slice(0, 6)} />
        </div>

        {spotlightStories.length > 0 && (
          <section className="mb-10 lg:mb-12">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 font-semibold">Editor’s picks</p>
                <h2 className="font-serif text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Top stories</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              {spotlightStories.map((article, index) => (
                <div key={`${article.url || index}-spotlight`} className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={article.urlToImage || `https://picsum.photos/id/${(index + 15) % 100}/800/600`}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400 font-semibold mb-2">{article.source?.name || 'News'}</p>
                    <h3 className="font-serif font-bold text-lg leading-snug text-gray-900 dark:text-white line-clamp-3">{article.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

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
            {CATEGORIES.map((category) => (
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
                  
                  {renderCategoryStories(category, categoryNews[category])}
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