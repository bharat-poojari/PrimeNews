import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useBookmarkStore } from '../../store/bookmarkStore';

export const BookmarkButton = ({ article }) => {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarkStore();
  const bookmarked = isBookmarked(article.url);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (bookmarked) {
      removeBookmark(article.url);
    } else {
      addBookmark(article);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      {bookmarked ? (
        <FaBookmark className="text-yellow-500 text-xl" />
      ) : (
        <FaRegBookmark className="text-gray-600 dark:text-gray-400 text-xl" />
      )}
    </button>
  );
};