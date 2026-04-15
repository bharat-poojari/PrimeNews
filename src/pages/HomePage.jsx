import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaNewspaper, FaArrowRight } from 'react-icons/fa';
import { BreakingTicker } from '../components/layout/BreakingTicker';
import { HeroSection } from '../components/news/HeroSection';
import { NewsGrid } from '../components/news/NewsGrid';
import { NewsCard } from '../components/news/NewsCard';
import { CategoryTabs } from '../components/common/CategoryTabs';
import { LoaderSkeleton } from '../components/common/LoaderSkeleton';
import { newsService } from '../services/api';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  const [apiError, setApiError] = useState(null);
  const [featuredNews, setFeaturedNews] = useState([]);
  const [categoryNews, setCategoryNews] = useState({});
  const [loading, setLoading] = useState(true);

  const categories = ['technology', 'business', 'sports', 'entertainment', 'science', 'health'];

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        const headlines = await newsService.fetchTopHeadlines('general', 'in', 1);
        setFeaturedNews(headlines.articles || []);

        const categoryData = {};
        
        await Promise.all(
          categories.map(async (cat) => {
            try {
              const data = await newsService.fetchTopHeadlines(cat, 'in', 1);
              categoryData[cat] = (data.articles || []).slice(0, 6);
            } catch (err) {
              console.error(`Failed to fetch ${cat}:`, err);
              categoryData[cat] = [];
            }
          })
        );
        
        setCategoryNews(categoryData);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
        setApiError('Failed to fetch news data. Please check your API configuration.');
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return <LoaderSkeleton type="home" />;
  }

  if (apiError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-red-900">API Error</h3>
          <p className="text-red-700 mt-2">{apiError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <BreakingTicker />
      
      <main className="container mx-auto px-4 py-8 lg:py-12">
        <HeroSection articles={featuredNews} />
        
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="my-16"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Categories
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-transparent" />
            </div>
          </div>
          <CategoryTabs />
        </motion.section>

        {Object.entries(categoryNews).map(([category, articles], idx) => (
          articles.length > 0 && (
            <motion.section
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="my-16"
            >
              <div className="relative mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white capitalize mb-2">
                      {category}
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-transparent" />
                  </div>
                  <Link 
                    to={`/category/${category}`}
                    className="group flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <span className="font-medium">View All</span>
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.slice(0, 3).map((article, i) => (
                  <NewsCard key={i} article={article} />
                ))}
              </div>
            </motion.section>
          )
        ))}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="my-20"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-12 lg:p-16">
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <div className="inline-block p-4 bg-blue-500/20 rounded-full mb-6">
                <FaNewspaper className="text-4xl text-blue-500" />
              </div>
              
              <h2 className="font-serif text-4xl lg:text-5xl font-bold text-white mb-4">
                Stay Informed
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                Get the latest news delivered straight to your inbox.
              </p>
              
              <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
                >
                  Subscribe
                </button>
              </form>
              
              <p className="text-gray-400 text-sm mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
};