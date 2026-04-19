// PrimeNews/src/pages/HomePage.jsx
import { useEffect, useState, useCallback, useRef } from 'react';
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
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const loadingRef = useRef(null);
  const { currentCategory, setCurrentCategory } = useNewsStore();

  const categories = ['technology', 'business', 'sports', 'entertainment', 'science', 'health'];

  const fetchCategoryNews = useCallback(async (category, pageNum = 1) => {
    try {
      const data = await newsService.fetchTopHeadlines(category, 'us', pageNum);
      return (data.articles || []).slice(0, 6);
    } catch (err) {
      console.error(`Failed to fetch ${category}:`, err);
      return [];
    }
  }, []);

  const fetchFeaturedNews = useCallback(async (category = currentCategory, pageNum = 1, isLoadMore = false) => {
    try {
      const headlines = await newsService.fetchTopHeadlines(category, 'us', pageNum);
      const articles = headlines.articles || [];
      
      if (isLoadMore) {
        setFeaturedNews(prev => {
          const existingUrls = new Set(prev.map(a => a.url));
          const newArticles = articles.filter(a => !existingUrls.has(a.url));
          return [...prev, ...newArticles];
        });
      } else {
        setFeaturedNews(articles);
      }
      
      setHasMore(articles.length === 30);
      return articles;
    } catch (error) {
      console.error('Failed to fetch featured news:', error);
      return [];
    }
  }, [currentCategory]);

  const fetchAllCategoriesNews = useCallback(async () => {
    const categoryData = {};
    
    await Promise.all(
      categories.map(async (cat) => {
        const articles = await fetchCategoryNews(cat);
        categoryData[cat] = articles;
      })
    );
    
    setAllCategoryNews(categoryData);
  }, [fetchCategoryNews]);

  const handleCategorySelect = useCallback(async (categoryId) => {
    setCurrentCategory(categoryId);
    setShowAllCategories(false);
    setFeaturedNews([]);
    setFilteredNews([]);
    setPage(1);
    setHasMore(true);
    
    try {
      const headlines = await newsService.fetchTopHeadlines(categoryId, 'us', 1);
      setFeaturedNews(headlines.articles || []);
      setHasMore(headlines.articles?.length === 30);
      
      const categoryArticles = await fetchCategoryNews(categoryId);
      setFilteredNews(categoryArticles);
    } catch (error) {
      console.error('Failed to fetch category news:', error);
    }
  }, [setCurrentCategory, fetchCategoryNews]);

  const handleShowAllCategories = useCallback(async () => {
    setCurrentCategory('general');
    setShowAllCategories(true);
    setFeaturedNews([]);
    setPage(1);
    setHasMore(true);
    
    try {
      const headlines = await newsService.fetchTopHeadlines('general', 'us', 1);
      setFeaturedNews(headlines.articles || []);
      setHasMore(headlines.articles?.length === 30);
      await fetchAllCategoriesNews();
    } catch (error) {
      console.error('Failed to fetch all categories:', error);
    }
  }, [setCurrentCategory, fetchAllCategoriesNews]);

  const loadMoreFeatured = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    const nextPage = page + 1;
    try {
      await fetchFeaturedNews(currentCategory, nextPage, true);
      setPage(nextPage);
    } catch (error) {
      console.error('Failed to load more:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, page, currentCategory, fetchFeaturedNews]);

  useEffect(() => {
    if (loadingMore || !hasMore || initialLoading || showAllCategories) return;
    
    const options = {
      root: null,
      rootMargin: '200px',
      threshold: 0.1
    };
    
    observerRef.current = new IntersectionObserver((entries) => {
      const firstEntry = entries[0];
      if (firstEntry.isIntersecting && !loadingMore && hasMore && !initialLoading) {
        loadMoreFeatured();
      }
    }, options);
    
    const currentLoadingRef = loadingRef.current;
    if (currentLoadingRef) {
      observerRef.current.observe(currentLoadingRef);
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadingMore, hasMore, initialLoading, loadMoreFeatured, showAllCategories]);

  useEffect(() => {
    const loadInitialData = async () => {
      setInitialLoading(true);
      try {
        const headlines = await newsService.fetchTopHeadlines('general', 'us', 1);
        setFeaturedNews(headlines.articles || []);
        setHasMore(headlines.articles?.length === 30);
        await fetchAllCategoriesNews();
        setShowAllCategories(true);
        setCurrentCategory('general');
      } catch (error) {
        console.error('Failed to load initial data:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadInitialData();
  }, [fetchAllCategoriesNews, setCurrentCategory]);

  const getCategoryDisplayName = () => {
    const names = {
      general: 'General',
      business: 'Business',
      technology: 'Technology',
      entertainment: 'Entertainment',
      sports: 'Sports',
      science: 'Science',
      health: 'Health'
    };
    return names[currentCategory] || 'General';
  };

  if (initialLoading) {
    return <LoaderSkeleton type="home" />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <BreakingTicker />
      
      <main className="container mx-auto px-4 py-6 lg:py-8">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 mt-[3.3rem] lg:mt-[3.3rem]"
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
          transition={{ delay: 0.2 }}
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
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <span>View All</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform text-xs" />
              </Link>
            )}
          </div>
          <HeroSection articles={featuredNews} />
        </motion.section>

        {!showAllCategories && filteredNews.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
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
                <NewsCard key={`filtered-${article.url || index}`} article={article} />
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
              transition={{ delay: 0.4 + idx * 0.1 }}
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
                  <NewsCard key={`${category}-${article.url || i}`} article={article} />
                ))}
              </div>
            </motion.section>
          )
        ))}

        {!showAllCategories && (
          <div ref={loadingRef} className="text-center py-8">
            {loadingMore && (
              <div className="inline-flex items-center space-x-3">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-600 dark:text-gray-400 text-sm">Loading more articles...</span>
              </div>
            )}
          </div>
        )}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="my-16"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 lg:p-12">
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <div className="inline-block p-3 bg-blue-500/20 rounded-full mb-4">
                <FaNewspaper className="text-3xl lg:text-4xl text-blue-500" />
              </div>
              <h2 className="font-serif text-2xl lg:text-4xl font-bold text-white mb-2">
                Stay Informed
              </h2>
              <p className="text-gray-300 text-sm lg:text-base mb-6">
                Get the latest news delivered straight to your inbox.
              </p>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const email = e.target.email.value;
                  if (email && email.includes('@')) {
                    alert('Subscribed successfully!');
                    e.target.reset();
                  } else {
                    alert('Please enter a valid email');
                  }
                }}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg text-sm"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-gray-400 text-xs mt-3">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
};