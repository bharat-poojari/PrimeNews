// src/pages/VideoPage.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaVideo, FaYoutube, FaSearch, FaPlay, FaArrowLeft } from 'react-icons/fa';
import { LoaderSkeleton } from '../components/common/LoaderSkeleton';
import { newsService } from '../services/api';
import { useNavigate } from 'react-router-dom';

export const VideoPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'news', name: 'News' },
    { id: 'sports', name: 'Sports' },
    { id: 'entertainment', name: 'Entertainment' },
    { id: 'technology', name: 'Tech' },
    { id: 'business', name: 'Business' },
  ];

  const loadVideos = async (nextQuery = searchQuery, nextCategory = selectedCategory) => {
    setLoading(true);
    let query = nextCategory === 'all' ? 'news video' : `${nextCategory} news video`;
    if (nextQuery && nextQuery.trim()) query = nextQuery.trim();

    const result = await newsService.searchNews(query, 1);
    const articles = (result.articles || []).slice(0, 24).map((article, index) => ({
      ...article,
      thumbnail: article.urlToImage || `https://picsum.photos/id/${(index + 12) % 100}/800/450`,
    }));

    setVideos(articles);
    setLoading(false);
  };

  useEffect(() => {
    loadVideos();
  }, [selectedCategory, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSelectedCategory('all');
      loadVideos(searchQuery, 'all');
    }
  };

  const handleArticleClick = (article) => {
    const articleId = btoa(encodeURIComponent(article.url)).substring(0, 20);
    navigate(`/article/${articleId}`, { state: { article } });
  };

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
          <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
            <FaVideo className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold dark:text-white">Video News</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Watch the latest news stories</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-lg mb-6">
        <div className="flex gap-2">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search videos..." className="flex-1 px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-800 dark:text-white" />
          <button type="submit" className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
            <FaSearch className="text-xs" /> Search
          </button>
        </div>
      </form>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button key={cat.id} onClick={() => { setSelectedCategory(cat.id); setSearchQuery(''); }} className={`px-4 py-1.5 rounded-full text-sm transition-colors ${selectedCategory === cat.id ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {videos.map((video, index) => (
            <motion.div key={video.url || index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.05, 0.5) }} whileHover={{ y: -4 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden cursor-pointer group" onClick={() => handleArticleClick(video)}>
              <div className="relative aspect-video overflow-hidden">
                <img src={video.thumbnail || `https://picsum.photos/id/${(index + 20) % 100}/800/450`} alt={video.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" onError={(e) => { e.target.src = `https://picsum.photos/id/20/800/450`; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                    <FaPlay className="text-white text-xl ml-0.5" />
                  </div>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-sm line-clamp-2 dark:text-white group-hover:text-red-600 transition-colors">{video.title}</h3>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{video.source?.name || 'News Source'}</p>
                  <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300 text-[10px] font-semibold uppercase tracking-wide">Video</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FaVideo className="text-5xl text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No videos found. Try a different search term.</p>
        </div>
      )}
    </div>
  );
};