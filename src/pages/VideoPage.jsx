import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaVideo, FaYoutube, FaSearch, FaPlay, FaTimes } from 'react-icons/fa';
import { LoaderSkeleton } from '../components/common/LoaderSkeleton';

export const VideoPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  const categories = [
    { id: 'all', name: 'All', query: 'news today' },
    { id: 'news', name: 'News', query: 'breaking news today' },
    { id: 'sports', name: 'Sports', query: 'sports news highlights' },
    { id: 'entertainment', name: 'Entertainment', query: 'entertainment news' },
    { id: 'technology', name: 'Technology', query: 'technology news' },
    { id: 'business', name: 'Business', query: 'business news' },
  ];

  const getMockVideos = (query, pageNum = 1) => {
    const allMockVideos = Array(50).fill().map((_, i) => ({
      id: `mock-${i}`,
      title: `${query || 'News'} Update ${i + 1}: Latest developments and breaking stories from around the world`,
      description: `Comprehensive coverage of today's most important news events. This video brings you the latest updates on global affairs, politics, economy, and more.`,
      thumbnail: `https://picsum.photos/id/${(i % 100) + 1}/400/225`,
      channelTitle: 'Global News Network',
      publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
      url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
      source: { name: 'YouTube' }
    }));
    
    const startIdx = (pageNum - 1) * 30;
    const endIdx = startIdx + 30;
    
    return {
      videos: allMockVideos.slice(startIdx, endIdx),
      hasMore: endIdx < allMockVideos.length
    };
  };

  const loadVideos = useCallback(async (pageNum = 1, isLoadMore = false) => {
    try {
      let query = '';
      if (selectedCategory === 'all') {
        query = searchQuery || 'news today';
      } else {
        const category = categories.find(c => c.id === selectedCategory);
        query = searchQuery || category.query;
      }
      
      const result = getMockVideos(query, pageNum);
      
      if (isLoadMore) {
        setVideos(prev => [...prev, ...result.videos]);
      } else {
        setVideos(result.videos);
      }
      
      setHasMore(result.hasMore);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    setPage(1);
    setVideos([]);
    setHasMore(true);
    setLoading(true);
    loadVideos(1, false).finally(() => setLoading(false));
  }, [selectedCategory, searchQuery, loadVideos]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          setLoadingMore(true);
          const nextPage = page + 1;
          setPage(nextPage);
          loadVideos(nextPage, true).finally(() => setLoadingMore(false));
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, page, loadVideos]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setPage(1);
      setVideos([]);
      setHasMore(true);
      setLoading(true);
      loadVideos(1, false).finally(() => setLoading(false));
    }
  };

  const VideoModal = ({ video, onClose }) => {
    const getYouTubeId = (url) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return match && match[2].length === 11 ? match[2] : null;
    };

    const videoId = getYouTubeId(video.url);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <FaTimes size={18} />
          </button>
          
          <div className="relative pb-[56.25%] h-0">
            {videoId ? (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                title={video.title}
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                <div className="text-center text-white">
                  <FaPlay className="text-5xl mx-auto mb-3" />
                  <p className="text-sm">Video Preview - {video.title}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 bg-gray-900 text-white">
            <h2 className="text-lg font-bold mb-1 line-clamp-2">{video.title}</h2>
            <p className="text-gray-400 text-xs mb-1">{video.channelTitle}</p>
            <p className="text-gray-300 text-xs line-clamp-2">{video.description}</p>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  if (loading && videos.length === 0) {
    return <LoaderSkeleton type="grid" />;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-red-500 to-red-600 rounded-full">
          <FaVideo className="text-white text-base" />
          <h1 className="text-white font-bold text-base">Videos</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{videos.length} videos loaded</p>
      </div>

      <form onSubmit={handleSearch} className="max-w-md mx-auto mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search videos..."
            className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-800 dark:text-white"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1"
          >
            <FaSearch className="text-xs" />
            Search
          </button>
        </div>
      </form>

      {/* Scrollable Categories */}
      <div className="overflow-x-auto scrollbar-hide mb-6">
        <div className="flex gap-1.5 min-w-max pb-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1.5 rounded-full transition-colors text-xs whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {videos.length > 0 && (
        <>
          {/* Featured Video */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-3 dark:text-white">Featured</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="relative cursor-pointer rounded-lg overflow-hidden shadow-lg"
                  onClick={() => setSelectedVideo(videos[0])}
                >
                  <div className="relative pb-[56.25%]">
                    <img
                      src={videos[0].thumbnail}
                      alt={videos[0].title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                        <FaPlay className="text-white text-lg ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                    <h3 className="text-white font-bold text-sm line-clamp-2">
                      {videos[0].title}
                    </h3>
                    <p className="text-gray-300 text-xs">{videos[0].channelTitle}</p>
                  </div>
                </motion.div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-bold mb-2 dark:text-white flex items-center text-sm">
                  <FaYoutube className="mr-1 text-red-600" />
                  About
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-xs mb-3 line-clamp-4">
                  {videos[0].description}
                </p>
                <div className="pt-3 border-t dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Channel: {videos[0].channelTitle}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Published: {new Date(videos[0].publishedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Video Grid */}
          <div>
            <h2 className="text-lg font-bold mb-3 dark:text-white">More Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.slice(1).map((video, index) => (
                <motion.div
                  key={video.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index % 10) * 0.05 }}
                  whileHover={{ y: -3 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer"
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="relative pb-[56.25%]">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                        <FaPlay className="text-white text-sm ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-1.5 py-0.5 rounded text-[10px] flex items-center">
                      <FaYoutube className="mr-0.5 text-red-500 text-[10px]" />
                      Watch
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold mb-1 line-clamp-2 dark:text-white text-sm">
                      {video.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {video.channelTitle}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {(loadingMore || hasMore) && (
              <div ref={loaderRef} className="text-center py-6">
                {loadingMore && (
                  <div className="inline-flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Loading more videos...</span>
                  </div>
                )}
              </div>
            )}
            
            {!hasMore && videos.length > 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 mt-6 py-4 text-sm">
                You've reached the end of videos
              </p>
            )}
          </div>
        </>
      )}

      <AnimatePresence>
        {selectedVideo && (
          <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};