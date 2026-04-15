import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { FaRegClock, FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { useBookmarkStore } from '../../store/bookmarkStore';

export const NewsCard = ({ article, variant = 'default' }) => {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarkStore();
  
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

  if (variant === 'featured') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition-shadow h-full"
      >
        <Link to={`/article/${articleId}`} state={{ article }} className="block h-full">
          <div className="relative h-64 lg:h-80 overflow-hidden">
            <img
              src={article.urlToImage || 'https://picsum.photos/id/104/800/500'}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                e.target.src = 'https://picsum.photos/id/104/800/500';
              }}
            />
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded">
                {article.source?.name || 'News'}
              </span>
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
              <FaRegClock className="mr-1 text-xs" />
              {article.publishedAt ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true }) : 'Recently'}
            </div>
            <h2 className="font-serif font-bold text-xl lg:text-2xl text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {article.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">
              {article.description || 'Click to read full article'}
            </p>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <span className="text-blue-600 text-sm font-medium">Read full story →</span>
              <button
                onClick={handleBookmark}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
              >
                {bookmarked ? (
                  <FaBookmark className="text-blue-600" />
                ) : (
                  <FaRegBookmark className="text-gray-500" />
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
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition-shadow h-full"
    >
      <Link to={`/article/${articleId}`} state={{ article }} className="block h-full">
        <div className="relative h-48 overflow-hidden">
          <img
            src={article.urlToImage || 'https://picsum.photos/id/20/400/300'}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://picsum.photos/id/20/400/300';
            }}
          />
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span className="font-medium text-blue-600 dark:text-blue-400">{article.source?.name || 'News'}</span>
            <span className="flex items-center">
              <FaRegClock className="mr-1 text-xs" />
              {article.publishedAt ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true }) : 'Recently'}
            </span>
          </div>
          <h3 className="font-serif font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {article.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">
            {article.description || 'Click to read full article'}
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            <span className="text-blue-600 text-sm font-medium">Read more →</span>
            <button
              onClick={handleBookmark}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              {bookmarked ? (
                <FaBookmark className="text-blue-600 text-sm" />
              ) : (
                <FaRegBookmark className="text-gray-500 text-sm" />
              )}
            </button>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};