// src/components/news/HeroSection.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { FaRegClock, FaRegBookmark, FaBookmark, FaArrowRight } from 'react-icons/fa';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useBookmarkStore } from '../../store/bookmarkStore';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useState } from 'react';

export const HeroSection = ({ articles }) => {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarkStore();
  const [imageErrors, setImageErrors] = useState({});
  
  if (!articles || articles.length === 0) {
    return null;
  }

  const mainArticle = articles[0];
  const secondaryArticles = articles.slice(1, 3);
  const sideArticles = articles.slice(3, 5);

  const getArticleId = (article) => {
    return btoa(encodeURIComponent(article.url || article.title)).substring(0, 20);
  };

  const getFallbackImage = (id = 104) => {
    return `https://picsum.photos/id/${id}/1200/800`;
  };

  const handleImageError = (url) => {
    setImageErrors(prev => ({ ...prev, [url]: true }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mb-8 lg:mb-12"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
        {/* Main Article */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <article className="relative h-[380px] lg:h-[460px] rounded-xl overflow-hidden group cursor-pointer shadow-lg">
            <Link to={`/article/${getArticleId(mainArticle)}`} state={{ article: mainArticle }}>
              <LazyLoadImage
                src={!imageErrors[mainArticle.url] && mainArticle.urlToImage ? mainArticle.urlToImage : getFallbackImage(104)}
                alt={mainArticle.title}
                effect="blur"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={() => handleImageError(mainArticle.url)}
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-7">
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <div className="flex flex-wrap items-center gap-3 mb-2 text-white/80 text-xs lg:text-sm">
                    <span className="px-2 py-0.5 bg-blue-600 rounded font-semibold text-white text-xs">
                      {mainArticle.source?.name || 'News'}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaRegClock className="text-xs" />
                      {mainArticle.publishedAt ? formatDistanceToNow(new Date(mainArticle.publishedAt), { addSuffix: true }) : 'Recently'}
                    </span>
                  </div>
                  
                  <h2 className="font-serif text-xl lg:text-2xl xl:text-3xl font-bold text-white mb-2 leading-tight line-clamp-3">
                    {mainArticle.title}
                  </h2>
                  
                  <p className="text-white/80 text-sm lg:text-base mb-3 line-clamp-2 hidden sm:block">
                    {mainArticle.description || 'Click to read full article'}
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-2 text-blue-400 font-semibold group text-sm">
                      Read Full Story
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform text-xs" />
                    </span>
                    <BookmarkButton article={mainArticle} />
                  </div>
                </motion.div>
              </div>
            </Link>
          </article>
        </motion.div>

        {/* Secondary Articles */}
        <motion.div variants={itemVariants} className="space-y-4">
          {secondaryArticles.map((article, index) => (
            <motion.article
              key={article.url || index}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -2 }}
              className="group cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <Link to={`/article/${getArticleId(article)}`} state={{ article }}>
                <div className="flex gap-3 p-3">
                  <div className="relative w-20 h-20 lg:w-24 lg:h-24 flex-shrink-0 overflow-hidden rounded-lg">
                    <LazyLoadImage
                      src={!imageErrors[article.url] && article.urlToImage ? article.urlToImage : getFallbackImage(20 + index * 10)}
                      alt={article.title}
                      effect="blur"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={() => handleImageError(article.url)}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 text-sm lg:text-base mb-1">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <FaRegClock className="text-xs" />
                      <span>{article.publishedAt ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true }) : 'Recently'}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
          
          {/* Side Stories */}
          {sideArticles.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-300 text-sm">
                More Top Stories
              </h3>
              <div className="space-y-2">
                {sideArticles.map((article, index) => (
                  <Link
                    key={article.url || index}
                    to={`/article/${getArticleId(article)}`}
                    state={{ article }}
                    className="block group"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold text-xs">•</span>
                      <span className="text-xs text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                        {article.title}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
};

const BookmarkButton = ({ article }) => {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarkStore();
  const bookmarked = isBookmarked(article.url);

  const handleBookmark = (e) => {
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
      onClick={handleBookmark}
      className="p-1.5 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-300"
      aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      {bookmarked ? (
        <FaBookmark className="text-blue-400 text-sm lg:text-base" />
      ) : (
        <FaRegBookmark className="text-white text-sm lg:text-base" />
      )}
    </button>
  );
};