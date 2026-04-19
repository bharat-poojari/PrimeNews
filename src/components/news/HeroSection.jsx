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
  const secondaryArticles = articles.slice(1, 4);
  const sideArticles = articles.slice(4, 6);

  const getArticleId = (article) => {
    return btoa(encodeURIComponent(article.url || article.title)).substring(0, 20);
  };

  const getFallbackImage = () => {
    return 'https://picsum.photos/id/104/1200/800';
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
      className="mb-16"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <article className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden group cursor-pointer shadow-2xl">
            <Link to={`/article/${getArticleId(mainArticle)}`} state={{ article: mainArticle }}>
              <LazyLoadImage
                src={!imageErrors[mainArticle.url] && mainArticle.urlToImage ? mainArticle.urlToImage : getFallbackImage()}
                alt={mainArticle.title}
                effect="blur"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={() => handleImageError(mainArticle.url)}
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="max-w-4xl"
                >
                  <div className="flex items-center space-x-4 mb-3 text-white/80 text-sm">
                    <span className="font-semibold text-white">
                      {mainArticle.source?.name || 'News Source'}
                    </span>
                    <span className="w-1 h-1 bg-white/50 rounded-full" />
                    <span className="flex items-center">
                      <FaRegClock className="mr-2 text-xs" />
                      {mainArticle.publishedAt ? formatDistanceToNow(new Date(mainArticle.publishedAt), { addSuffix: true }) : 'Recently'}
                    </span>
                  </div>
                  
                  <h1 className="font-serif text-xl lg:text-3xl xl:text-4xl font-bold text-white mb-3 leading-tight line-clamp-3">
                    {mainArticle.title}
                  </h1>
                  
                  <p className="text-white/80 text-sm lg:text-base mb-4 line-clamp-2">
                    {mainArticle.description || 'Click to read full article'}
                  </p>
                  
                  <div className="flex items-center space-x-6">
                    <span className="inline-flex items-center text-blue-400 font-semibold group text-sm lg:text-base">
                      Read Full Story
                      <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform text-sm" />
                    </span>
                    
                    <BookmarkButton article={mainArticle} />
                  </div>
                </motion.div>
              </div>
            </Link>
          </article>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-4">
          {secondaryArticles.map((article, index) => (
            <motion.article
              key={article.url || index}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -3 }}
              className="group cursor-pointer"
            >
              <Link to={`/article/${getArticleId(article)}`} state={{ article }}>
                <div className="flex gap-3">
                  <div className="relative w-24 h-24 lg:w-28 lg:h-28 flex-shrink-0 overflow-hidden rounded-lg">
                    <LazyLoadImage
                      src={!imageErrors[article.url] && article.urlToImage ? article.urlToImage : 'https://picsum.photos/id/20/150/150'}
                      alt={article.title}
                      effect="blur"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={() => handleImageError(article.url)}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-serif font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-3 text-sm lg:text-base mb-1">
                      {article.title}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <FaRegClock className="mr-1 text-xs" />
                      <span>{article.publishedAt ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true }) : 'Recently'}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
          
          {sideArticles.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-serif font-bold mb-3 text-gray-900 dark:text-white text-sm">
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
                    <div className="flex items-start space-x-2">
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
      className="p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-300"
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