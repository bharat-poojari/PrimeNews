import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBars, 
  FaTimes, 
  FaSearch, 
  FaMoon, 
  FaSun,
  FaBookmark,
  FaFire,
  FaVideo,
  FaHome
} from 'react-icons/fa';
import { useThemeStore } from '../../store/themeStore';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && isOpen) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const navItems = [
    { path: '/', label: 'Home', icon: FaHome },
    { path: '/trending', label: 'Trending', icon: FaFire },
    { path: '/videos', label: 'Videos', icon: FaVideo },
    { path: '/bookmarks', label: 'Bookmarks', icon: FaBookmark },
  ];

  const handleSearchClick = () => {
    navigate('/search');
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm' 
          : 'bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700'
      }`}>
        <nav className="container mx-auto px-4">
          <div className="flex items-center justify-between h-12 lg:h-14">
            <Link to="/" className="flex items-center">
              <h1 className="font-serif text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                Prime<span className="text-blue-600">News</span>
              </h1>
            </Link>

            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3 py-1.5 rounded-md font-medium transition-colors text-sm ${
                      isActive
                        ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  <item.icon className="text-base" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={handleSearchClick}
                className="p-1.5 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Search"
              >
                <FaSearch className="text-base" />
              </button>

              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? <FaSun className="text-base" /> : <FaMoon className="text-base" />}
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-1.5 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Menu"
              >
                {isOpen ? <FaTimes className="text-base" /> : <FaBars className="text-base" />}
              </button>
            </div>
          </div>
        </nav>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <div className="container mx-auto px-4 py-4">
                <div className="space-y-1">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <NavLink
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center space-x-3 px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                            isActive
                              ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`
                        }
                      >
                        <item.icon className="text-base" />
                        <span>{item.label}</span>
                      </NavLink>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};