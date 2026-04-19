// src/pages/TrendingPage.jsx
import { useState, useEffect } from 'react';
import { FaFire, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { newsService } from '../services/api';
import { NewsCard } from '../components/news/NewsCard';
import { LoaderSkeleton } from '../components/common/LoaderSkeleton';

export const TrendingPage = () => {
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      const articles = await newsService.fetchTrending(1);
      setTrendingArticles(articles);
      setLoading(false);
    };
    fetchTrending();
  }, []);

  if (loading) return <LoaderSkeleton type="grid" />;

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="mb-8">
        <button onClick={() => navigate(-1)} className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 mb-4 transition-colors text-sm">
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
            <FaFire className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold dark:text-white">Trending News</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Most popular stories right now</p>
          </div>
        </div>
      </div>

      {/* Trending Grid */}
      {trendingArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingArticles.map((article, index) => (
            <div key={article.url || index} className="relative">
              {index < 3 && (
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm z-10 shadow-lg">
                  {index + 1}
                </div>
              )}
              <NewsCard article={article} variant="featured" />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No trending articles available.</p>
        </div>
      )}
    </div>
  );
};