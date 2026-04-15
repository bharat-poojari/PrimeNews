import { motion } from 'framer-motion';

export const LoaderSkeleton = ({ type = 'grid', count = 6 }) => {
  const pulseAnimation = {
    initial: { opacity: 0.6 },
    animate: {
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  if (type === 'home') {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Hero Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <motion.div
            variants={pulseAnimation}
            initial="initial"
            animate="animate"
            className="lg:col-span-2 h-[500px] bg-gray-200 dark:bg-gray-700 rounded-xl"
          />
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <motion.div
                key={i}
                variants={pulseAnimation}
                initial="initial"
                animate="animate"
                className="h-[235px] bg-gray-200 dark:bg-gray-700 rounded-xl"
              />
            ))}
          </div>
        </div>

        {/* Category Tabs Skeleton */}
        <div className="flex space-x-2 mb-8">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <motion.div
              key={i}
              variants={pulseAnimation}
              initial="initial"
              animate="animate"
              className="h-12 w-28 bg-gray-200 dark:bg-gray-700 rounded-full"
            />
          ))}
        </div>

        {/* News Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: count }).map((_, i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <NewsCardSkeleton key={i} />
      ))}
    </div>
  );
};

const NewsCardSkeleton = () => (
  <motion.div
    variants={{
      initial: { opacity: 0.6 },
      animate: {
        opacity: [0.6, 1, 0.6],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
    }}
    initial="initial"
    animate="animate"
    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
  >
    <div className="h-48 bg-gray-200 dark:bg-gray-700" />
    <div className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
      <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  </motion.div>
);