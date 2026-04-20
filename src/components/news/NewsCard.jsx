// src/components/news/NewsCard.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { FaRegClock, FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { useBookmarkStore } from '../../store/bookmarkStore';
import { useState } from 'react';

export const NewsCard = ({ article, variant = 'default' }) => {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarkStore();
  const [imageError, setImageError] = useState(false);
  
  if (!article) return null;
  
  const bookmarked = isBookmarked(article.url);
  const articleId = btoa(encodeURIComponent(article.url || article.title)).substring(0, 20);

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (bookmarked) {
      removeBookmark(article.url);
    } else {
      addBookmark(article);
    }
  };

  const getFallbackImage = () => {
    return 'https://picsum.photos/id/104/800/500';
  };

  const imageUrl = !imageError && article.urlToImage ? article.urlToImage : getFallbackImage();

  if (variant === 'featured') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300 h-full"
      >
        <Link to={`/article/${articleId}`} state={{ article }} className="block h-full">
          <div className="relative h-48 lg:h-52 overflow-hidden">
            <img
              src={imageUrl}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={() => setImageError(true)}
            />
            <div className="absolute top-2 left-2">
              <span className="px-1.5 py-0.5 bg-blue-600 text-white text-[10px] font-semibold rounded">
                {article.source?.name || 'News'}
              </span>
            </div>
          </div>
          <div className="p-3">
            <div className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 mb-1">
              <FaRegClock className="text-[10px]" />
              {article.publishedAt ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true }) : 'Recently'}
            </div>
            <h2 className="font-serif font-bold text-sm lg:text-base text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {article.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-xs line-clamp-2 mb-2">
              {article.description || 'Click to read full article'}
            </p>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
              <span className="text-blue-600 text-xs font-medium">Read full story →</span>
              <button
                onClick={handleBookmark}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
              >
                {bookmarked ? (
                  <FaBookmark className="text-blue-600 text-xs" />
                ) : (
                  <FaRegBookmark className="text-gray-500 text-xs" />
                )}
              </button>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300 h-full flex flex-col"
    >
      <Link to={`/article/${articleId}`} state={{ article }} className="block h-full flex flex-col">
        <div className="relative h-40 overflow-hidden">
          <img
            src={imageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        </div>
        <div className="p-3 flex-1 flex flex-col">
          <div className="flex items-center justify-between gap-2 text-[10px] text-gray-500 dark:text-gray-400 mb-1">
            <span className="font-medium text-blue-600 dark:text-blue-400 truncate">{article.source?.name || 'News'}</span>
            <span className="flex items-center gap-1 flex-shrink-0">
              <FaRegClock className="text-[10px]" />
              {article.publishedAt ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true }) : 'Recently'}
            </span>
          </div>
          <h3 className="font-serif font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm">
            {article.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-xs line-clamp-2 mb-2 flex-1">
            {article.description || 'Click to read full article'}
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            <span className="text-blue-600 text-xs font-medium">Read more →</span>
            <button
              onClick={handleBookmark}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              {bookmarked ? (
                <FaBookmark className="text-blue-600 text-xs" />
              ) : (
                <FaRegBookmark className="text-gray-500 text-xs" />
              )}
            </button>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};