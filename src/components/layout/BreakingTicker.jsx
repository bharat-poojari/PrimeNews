import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCircle, FaChevronLeft, FaChevronRight, FaPause, FaPlay } from 'react-icons/fa';
import { newsService } from '../../services/api';

export const BreakingTicker = () => {
  const [headlines, setHeadlines] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBreaking = async () => {
      try {
        const data = await newsService.fetchTopHeadlines('general', 'in', 1);
        setHeadlines(data.articles?.slice(0, 15) || []);
      } catch (error) {
        console.error('Failed to fetch breaking news:', error);
      }
    };

    fetchBreaking();
    const interval = setInterval(fetchBreaking, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isPaused && headlines.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % headlines.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [isPaused, headlines.length]);

  if (headlines.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-3 shadow-lg relative overflow-hidden">
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center space-x-4">
          {/* Breaking Label */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-full shadow-lg flex-shrink-0"
          >
            <FaCircle className="text-red-300 text-xs animate-pulse" />
            <span className="font-bold text-sm tracking-wider uppercase">Breaking</span>
          </motion.div>

          {/* Ticker Content */}
          <div className="flex-1 overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center"
              >
                <span className="text-white/80 mr-3 font-semibold text-sm">
                  {headlines[currentIndex]?.source?.name || 'News'}:
                </span>
                <span className="font-medium truncate text-sm">
                  {headlines[currentIndex]?.title || ''}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + headlines.length) % headlines.length)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <FaChevronLeft className="text-sm" />
            </button>
            
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              {isPaused ? <FaPlay className="text-sm" /> : <FaPause className="text-sm" />}
            </button>
            
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % headlines.length)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <FaChevronRight className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};