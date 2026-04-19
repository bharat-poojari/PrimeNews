// PrimeNews/src/components/layout/BreakingTicker.jsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCircle, FaChevronLeft, FaChevronRight, FaPause, FaPlay } from 'react-icons/fa';
import { newsService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export const BreakingTicker = () => {
  const [headlines, setHeadlines] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchBreaking = async () => {
      try {
        const data = await newsService.fetchTopHeadlines('general', 'us', 1);
        const articles = data.articles?.filter(a => a.title && a.url).slice(0, 15) || [];
        setHeadlines(articles);
      } catch (error) {
        console.error('Failed to fetch breaking news:', error);
      }
    };

    fetchBreaking();
    const interval = setInterval(fetchBreaking, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isPaused && headlines.length > 0 && !isMobile) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % headlines.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [isPaused, headlines.length, isMobile]);

  const handleArticleClick = (article) => {
    if (article && article.url) {
      const articleId = btoa(encodeURIComponent(article.url)).substring(0, 20);
      navigate(`/article/${articleId}`, { state: { article } });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (headlines.length === 0) return null;

  // Mobile view with working click and marquee
  if (isMobile) {
    const marqueeText = headlines.map(h => `${h.source?.name || 'News'}: ${h.title}`).join(' ••• ');
    
    return (
      <div className="fixed top-14 lg:top-16 left-0 right-0 bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-2.5 shadow-lg z-40 overflow-hidden">
        <div className="container mx-auto px-3">
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-white/20 rounded-full flex-shrink-0"
            >
              <FaCircle className="text-red-300 text-[8px] animate-pulse" />
              <span className="font-bold text-[10px] tracking-wider uppercase">Breaking</span>
            </motion.div>
            
            <div 
              className="flex-1 overflow-hidden cursor-pointer"
              onClick={() => handleArticleClick(headlines[0])}
            >
              <div className="animate-marquee whitespace-nowrap">
                <span className="text-xs font-medium inline-block px-2">
                  {marqueeText}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop view with controls
  return (
    <div className="fixed top-14 lg:top-16 left-0 right-0 bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-2 shadow-lg z-40 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full flex-shrink-0"
          >
            <FaCircle className="text-red-300 text-xs animate-pulse" />
            <span className="font-bold text-sm tracking-wider uppercase">Breaking</span>
          </motion.div>

          <div 
            className="flex-1 overflow-hidden cursor-pointer"
            onClick={() => handleArticleClick(headlines[currentIndex])}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3"
              >
                <span className="text-white/80 font-semibold text-sm flex-shrink-0">
                  {headlines[currentIndex]?.source?.name || 'News'}:
                </span>
                <span className="font-medium text-sm truncate">
                  {headlines[currentIndex]?.title || ''}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + headlines.length) % headlines.length)}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Previous"
            >
              <FaChevronLeft className="text-xs" />
            </button>
            
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
              aria-label={isPaused ? 'Play' : 'Pause'}
            >
              {isPaused ? <FaPlay className="text-xs" /> : <FaPause className="text-xs" />}
            </button>
            
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % headlines.length)}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Next"
            >
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};