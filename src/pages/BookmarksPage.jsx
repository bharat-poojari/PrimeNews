// src/pages/BookmarksPage.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBookmark, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { useBookmarkStore } from '../store/bookmarkStore';
import { Link, useNavigate } from 'react-router-dom';

export const BookmarksPage = () => {
  const { bookmarks, clearAllBookmarks } = useBookmarkStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleClearAll = () => {
    clearAllBookmarks();
    setShowConfirm(false);
  };

  if (bookmarks.length === 0) {
    return (
      <div className="container-custom py-8">
        <button onClick={() => navigate(-1)} className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 mb-6 transition-colors text-sm">
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <div className="text-center py-16 max-w-md mx-auto">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaBookmark className="text-3xl text-gray-400" />
          </div>
          <h1 className="text-xl font-bold mb-2 dark:text-white">No Bookmarks Yet</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">Save articles you want to read later by clicking the bookmark icon.</p>
          <Link to="/" className="inline-block px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Browse Articles</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="mb-8">
        <button onClick={() => navigate(-1)} className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 mb-4 transition-colors text-sm">
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <FaBookmark className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold dark:text-white">Bookmarks</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{bookmarks.length} saved articles</p>
            </div>
          </div>
          <button onClick={() => setShowConfirm(true)} className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors">
            <FaTrash className="text-xs" /> Clear All
          </button>
        </div>
      </div>

      {/* Bookmarks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {bookmarks.sort((a, b) => b.bookmarkedAt - a.bookmarkedAt).map((article, index) => (
          <motion.div key={article.url} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <Link to={`/article/${btoa(article.url).substring(0, 10)}`} state={{ article }} onClick={() => window.scrollTo(0, 0)}>
              {article.urlToImage && (
                <img src={article.urlToImage} alt={article.title} className="w-full h-40 object-cover" onError={(e) => { e.target.src = 'https://picsum.photos/id/104/400/200'; }} />
              )}
              <div className="p-4">
                <h3 className="font-bold text-base line-clamp-2 dark:text-white hover:text-blue-600 transition-colors mb-2">{article.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{article.source?.name || 'News Source'}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Saved: {new Date(article.bookmarkedAt).toLocaleDateString()}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowConfirm(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white dark:bg-gray-800 rounded-lg max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold mb-2 dark:text-white">Clear All Bookmarks?</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">This action cannot be undone. All your saved articles will be removed.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirm(false)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                <button onClick={handleClearAll} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Clear All</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};