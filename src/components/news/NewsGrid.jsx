// src/components/news/NewsGrid.jsx
import { motion } from 'framer-motion';
import { NewsCard } from './NewsCard';

export const NewsGrid = ({ articles, variant = 'default', columns = 3 }) => {
  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No articles available</p>
      </div>
    );
  }

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={`grid ${gridCols[columns]} gap-6`}
    >
      {articles.map((article, index) => (
        <motion.div key={`${article.url}-${index}`} variants={item}>
          <NewsCard article={article} variant={variant} />
        </motion.div>
      ))}
    </motion.div>
  );
};