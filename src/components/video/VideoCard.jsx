import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaTimes, FaYoutube } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

export const VideoCard = ({ video }) => {
  const [showModal, setShowModal] = useState(false);

  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeId(video.url);
  const thumbnailUrl = videoId 
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : video.thumbnail || video.urlToImage || 'https://picsum.photos/id/20/400/225';

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer group"
        onClick={() => setShowModal(true)}
      >
        <div className="relative">
          <img
            src={thumbnailUrl}
            alt={video.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center transform transition-transform group-hover:scale-110">
              <FaPlay className="text-white text-2xl ml-1" />
            </div>
          </div>
          {videoId && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs flex items-center">
              <FaYoutube className="mr-1 text-red-500" />
              Watch on YouTube
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-bold mb-2 line-clamp-2 dark:text-white text-base">
            {video.title}
          </h3>
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span className="truncate">{video.channelTitle || video.source?.name || 'News Video'}</span>
            {video.publishedAt && (
              <span className="text-xs">
                {formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true })}
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Video Modal */}
      <AnimatePresence>
        {showModal && videoId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl bg-black rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <FaTimes size={20} />
              </button>
              
              <div className="relative pb-[56.25%] h-0">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                  title={video.title}
                  className="absolute top-0 left-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              
              <div className="p-6 bg-gray-900 text-white">
                <h2 className="text-xl lg:text-2xl font-bold mb-2">{video.title}</h2>
                <p className="text-gray-400 mb-2">{video.channelTitle || video.source?.name}</p>
                <p className="text-gray-300 text-sm">{video.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};