import { motion } from 'framer-motion';
import { FaBookmark, FaTrash } from 'react-icons/fa';
import { useBookmarkStore } from '../store/bookmarkStore';
import { NewsGrid } from '../components/news/NewsGrid';
import { Link } from 'react-router-dom';

export const BookmarksPage = () => {
  const { bookmarks, clearAllBookmarks } = useBookmarkStore();

  if (bookmarks.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="mb-6">
            <FaBookmark className="text-6xl text-gray-400 mx-auto mb-4" />
          </div>
          <h1 className="text-3xl font-bold mb-4 dark:text-white">No Bookmarks Yet</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Start saving articles you want to read later. Click the bookmark icon on any article to add it here.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Articles
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 dark:text-white">Your Bookmarks</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {bookmarks.length} {bookmarks.length === 1 ? 'article' : 'articles'} saved
          </p>
        </div>
        
        <button
          onClick={clearAllBookmarks}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <FaTrash />
          <span>Clear All</span>
        </button>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarks.sort((a, b) => b.bookmarkedAt - a.bookmarkedAt).map((article, index) => (
            <motion.div
              key={article.url}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
            >
              <div className="flex items-start space-x-3">
                {article.urlToImage && (
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <Link 
                    to={`/article/${btoa(article.url).substring(0, 10)}`}
                    state={{ article }}
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <h3 className="font-semibold line-clamp-2 mb-1 dark:text-white">
                      {article.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {article.source.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Bookmarked {new Date(article.bookmarkedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <NewsGrid articles={bookmarks} />
    </div>
  );
};