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

  // YouTube API Key - Replace with your actual key or use mock data
  const YOUTUBE_API_KEY = ''; // Leave empty to use mock data

  const fetchYouTubeVideos = async (query, pageNum = 1) => {
    try {
      // If no API key, use enhanced mock data
      if (!YOUTUBE_API_KEY) {
        return getEnhancedMockVideos(query, pageNum);
      }

      const maxResults = 30;
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&pageToken=${pageNum === 1 ? '' : pageNum}&q=${encodeURIComponent(query)}&type=video&key=${YOUTUBE_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        return {
          videos: data.items.map(item => ({
            id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.high.url,
            channelTitle: item.snippet.channelTitle,
            publishedAt: item.snippet.publishedAt,
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            source: { name: 'YouTube' }
          })),
          nextPageToken: data.nextPageToken,
          hasMore: !!data.nextPageToken
        };
      }
      return { videos: getEnhancedMockVideos(query, pageNum).videos, hasMore: pageNum < 5 };
    } catch (error) {
      console.error('Failed to fetch YouTube videos:', error);
      return { videos: getEnhancedMockVideos(query, pageNum).videos, hasMore: pageNum < 5 };
    }
  };

  const getEnhancedMockVideos = (query, pageNum = 1) => {
    const allMockVideos = {
      all: Array(50).fill().map((_, i) => ({
        id: `mock-all-${i}`,
        title: `News Update ${i + 1}: Latest developments and breaking stories from around the world`,
        description: `Comprehensive coverage of today's most important news events. This video brings you the latest updates on global affairs, politics, economy, and more. Stay informed with our detailed reporting.`,
        thumbnail: `https://picsum.photos/id/${(i % 100) + 1}/400/225`,
        channelTitle: 'Global News Network',
        publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
        url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
        source: { name: 'YouTube' }
      })),
      news: Array(50).fill().map((_, i) => ({
        id: `mock-news-${i}`,
        title: `Breaking News ${i + 1}: Major events and important announcements shaping our world`,
        description: `Live coverage and analysis of the most significant news stories of the day. Expert commentary and on-the-ground reporting.`,
        thumbnail: `https://picsum.photos/id/${(i % 100) + 104}/400/225`,
        channelTitle: 'News Channel',
        publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
        url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
        source: { name: 'YouTube' }
      })),
      sports: Array(50).fill().map((_, i) => ({
        id: `mock-sports-${i}`,
        title: `Sports Highlights ${i + 1}: Best moments, top plays, and championship updates`,
        description: `Watch the most exciting moments from the world of sports. Goals, victories, and unforgettable performances.`,
        thumbnail: `https://picsum.photos/id/${(i % 100) + 128}/400/225`,
        channelTitle: 'Sports Central',
        publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
        url: `https://www.youtube.com/watch?v=8jWw6B8D5ZI`,
        source: { name: 'YouTube' }
      })),
      technology: Array(50).fill().map((_, i) => ({
        id: `mock-tech-${i}`,
        title: `Tech Review ${i + 1}: Latest gadgets, AI breakthroughs, and innovation updates`,
        description: `Exploring cutting-edge technology and digital trends. Product reviews and expert analysis.`,
        thumbnail: `https://picsum.photos/id/${(i % 100) + 0}/400/225`,
        channelTitle: 'Tech Today',
        publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
        url: `https://www.youtube.com/watch?v=7rL5_3kqQj8`,
        source: { name: 'YouTube' }
      })),
      entertainment: Array(50).fill().map((_, i) => ({
        id: `mock-ent-${i}`,
        title: `Entertainment Buzz ${i + 1}: Movie trailers, celebrity news, and pop culture`,
        description: `Latest updates from Hollywood and the entertainment industry. Interviews and behind-the-scenes content.`,
        thumbnail: `https://picsum.photos/id/${(i % 100) + 106}/400/225`,
        channelTitle: 'Entertainment Weekly',
        publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
        url: `https://www.youtube.com/watch?v=9bZkp7q19f0`,
        source: { name: 'YouTube' }
      })),
      business: Array(50).fill().map((_, i) => ({
        id: `mock-biz-${i}`,
        title: `Market Report ${i + 1}: Stock updates, economic trends, and financial insights`,
        description: `Comprehensive analysis of global markets, business strategies, and economic indicators.`,
        thumbnail: `https://picsum.photos/id/${(i % 100) + 26}/400/225`,
        channelTitle: 'Business Daily',
        publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
        url: `https://www.youtube.com/watch?v=2rJ6KjW8Y6M`,
        source: { name: 'YouTube' }
      }))
    };

    const categoryKey = selectedCategory === 'all' ? 'all' : selectedCategory;
    const categoryVideos = allMockVideos[categoryKey] || allMockVideos.all;
    const startIdx = (pageNum - 1) * 30;
    const endIdx = startIdx + 30;
    
    return {
      videos: categoryVideos.slice(startIdx, endIdx),
      hasMore: endIdx < categoryVideos.length
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
      
      const result = await fetchYouTubeVideos(query, pageNum);
      
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
          className="relative w-full max-w-5xl bg-black rounded-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            <FaTimes size={24} />
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
                  <FaPlay className="text-6xl mx-auto mb-4" />
                  <p>Video Preview - {video.title}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-6 bg-gray-900 text-white">
            <h2 className="text-2xl font-bold mb-2">{video.title}</h2>
            <p className="text-gray-400 mb-2">{video.channelTitle}</p>
            <p className="text-gray-300">{video.description}</p>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  if (loading && videos.length === 0) {
    return <LoaderSkeleton type="grid" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <div className="inline-block p-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full mb-4">
          <FaVideo className="text-4xl text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-2 dark:text-white">Videos</h1>
        <p className="text-gray-600 dark:text-gray-400">{videos.length} videos loaded</p>
      </div>

      <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search videos..."
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-800 dark:text-white"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <FaSearch />
            Search
          </button>
        </div>
      </form>

      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full transition-colors ${
              selectedCategory === category.id
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {videos.length > 0 && (
        <>
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Featured</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative cursor-pointer rounded-xl overflow-hidden shadow-xl"
                  onClick={() => setSelectedVideo(videos[0])}
                >
                  <div className="relative pb-[56.25%]">
                    <img
                      src={videos[0].thumbnail}
                      alt={videos[0].title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center">
                        <FaPlay className="text-white text-3xl ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                    <h3 className="text-white font-bold text-lg line-clamp-2">
                      {videos[0].title}
                    </h3>
                    <p className="text-gray-300 text-sm">{videos[0].channelTitle}</p>
                  </div>
                </motion.div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 dark:text-white flex items-center">
                  <FaYoutube className="mr-2 text-red-600" />
                  About
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-4">
                  {videos[0].description}
                </p>
                <div className="pt-4 border-t dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Channel: {videos[0].channelTitle}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Published: {new Date(videos[0].publishedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6 dark:text-white">More Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.slice(1).map((video, index) => (
                <motion.div
                  key={video.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index % 10) * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden cursor-pointer"
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="relative pb-[56.25%]">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                        <FaPlay className="text-white text-lg ml-1" />
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center">
                      <FaYoutube className="mr-1 text-red-500 text-xs" />
                      Watch
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-2 line-clamp-2 dark:text-white text-sm">
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
              <div ref={loaderRef} className="text-center py-8">
                {loadingMore && (
                  <div className="inline-flex items-center space-x-2">
                    <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-600 dark:text-gray-400">Loading more videos...</span>
                  </div>
                )}
              </div>
            )}
            
            {!hasMore && videos.length > 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 mt-8 py-8">
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