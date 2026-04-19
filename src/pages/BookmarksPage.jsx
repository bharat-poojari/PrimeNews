import { motion } from 'framer-motion';
import { FaBookmark, FaTrash } from 'react-icons/fa';
import { useBookmarkStore } from '../store/bookmarkStore';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const BookmarksPage = () => {
  const { bookmarks, clearAllBookmarks } = useBookmarkStore();

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all bookmarks?')) {
      clearAllBookmarks();
      toast.success('All bookmarks cleared');
    }
  };

  if (bookmarks.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="mb-4">
            <FaBookmark className="text-5xl text-gray-400 mx-auto mb-3" />
          </div>
          <h1 className="text-2xl font-bold mb-2 dark:text-white">No Bookmarks Yet</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
            Start saving articles you want to read later. Click the bookmark icon on any article to add it here.
          </p>
          <Link
            to="/"
            className="inline-block px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Articles
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FaBookmark className="text-blue-600 text-lg" />
            <h1 className="text-xl font-bold dark:text-white">Your Bookmarks</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-xs">
            {bookmarks.length} {bookmarks.length === 1 ? 'article' : 'articles'} saved
          </p>
        </div>
        
        <button
          onClick={handleClearAll}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
        >
          <FaTrash className="text-xs" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookmarks.sort((a, b) => b.bookmarkedAt - a.bookmarkedAt).map((article, index) => (
          <motion.div
            key={article.url}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3"
          >
            <div className="flex gap-3">
              {article.urlToImage && (
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div className="flex-1 min-w-0">
                <Link 
                  to={`/article/${btoa(article.url).substring(0, 10)}`}
                  state={{ article }}
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <h3 className="font-semibold text-sm line-clamp-2 mb-1 dark:text-white">
                    {article.title}
                  </h3>
                </Link>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {article.source.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {new Date(article.bookmarkedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};