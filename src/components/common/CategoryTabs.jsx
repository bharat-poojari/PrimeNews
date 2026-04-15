import { useNavigate } from 'react-router-dom';
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
import { useNewsStore } from '../../store/newsStore';

export const CategoryTabs = () => {
  const navigate = useNavigate();
  const { currentCategory, setCurrentCategory } = useNewsStore();

  const CATEGORIES = [
    { id: "general", name: "General", icon: FaNewspaper },
    { id: "business", name: "Business", icon: FaBriefcase },
    { id: "technology", name: "Technology", icon: FaLaptopCode },
    { id: "entertainment", name: "Entertainment", icon: FaFilm },
    { id: "sports", name: "Sports", icon: FaFutbol },
    { id: "science", name: "Science", icon: FaFlask },
    { id: "health", name: "Health", icon: FaHeartbeat }
  ];

  const handleCategoryClick = (categoryId) => {
    setCurrentCategory(categoryId);
    navigate(`/category/${categoryId}`);
  };

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex space-x-2 min-w-max pb-2">
        {CATEGORIES.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCategoryClick(category.id)}
            className={`px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 ${
              currentCategory === category.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <category.icon className="text-lg" />
            {category.name}
          </motion.button>
        ))}
      </div>
    </div>
  );
};