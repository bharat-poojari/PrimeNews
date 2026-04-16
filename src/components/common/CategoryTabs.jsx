import { motion } from 'framer-motion';
import { 
  FaNewspaper, 
  FaBriefcase, 
  FaLaptopCode, 
  FaFilm, 
  FaFutbol, 
  FaFlask, 
  FaHeartbeat 
} from 'react-icons/fa';

export const CategoryTabs = ({ onCategorySelect }) => {
  const CATEGORIES = [
    { id: "general", name: "General", icon: FaNewspaper, color: "blue" },
    { id: "business", name: "Business", icon: FaBriefcase, color: "green" },
    { id: "technology", name: "Technology", icon: FaLaptopCode, color: "purple" },
    { id: "entertainment", name: "Entertainment", icon: FaFilm, color: "pink" },
    { id: "sports", name: "Sports", icon: FaFutbol, color: "orange" },
    { id: "science", name: "Science", icon: FaFlask, color: "teal" },
    { id: "health", name: "Health", icon: FaHeartbeat, color: "red" }
  ];

  const handleCategoryClick = (categoryId) => {
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    }
  };

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex space-x-2 min-w-max pb-1">
        {CATEGORIES.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleCategoryClick(category.id)}
            className={`px-3 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5 text-xs md:text-sm whitespace-nowrap
              bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700
              hover:shadow-md active:scale-95`}
          >
            <category.icon className="text-xs md:text-sm" />
            {category.name}
          </motion.button>
        ))}
      </div>
    </div>
  );
};