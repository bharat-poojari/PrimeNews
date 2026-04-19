// PrimeNews/src/components/layout/Footer.jsx
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaTwitter, 
  FaFacebook, 
  FaInstagram, 
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaArrowRight
} from 'react-icons/fa';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const categories = [
    { name: 'Technology', path: '/category/technology', id: 'technology' },
    { name: 'Business', path: '/category/business', id: 'business' },
    { name: 'Sports', path: '/category/sports', id: 'sports' },
    { name: 'Entertainment', path: '/category/entertainment', id: 'entertainment' },
    { name: 'Health', path: '/category/health', id: 'health' },
    { name: 'Science', path: '/category/science', id: 'science' },
  ];

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Trending', path: '/trending' },
    { name: 'Videos', path: '/videos' },
    { name: 'Bookmarks', path: '/bookmarks' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleCategoryClick = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Top Section with Brand and Social */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-8 lg:mb-10 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="text-center lg:text-left">
            <h2 className="font-serif text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Prime<span className="text-blue-600 bg-none">News</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Delivering trustworthy, insightful news coverage.
            </p>
          </div>
          
          <div className="flex space-x-3">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:border-blue-600 transition-all duration-200"
              aria-label="Twitter"
            >
              <FaTwitter className="text-sm lg:text-base" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:border-blue-600 transition-all duration-200"
              aria-label="Facebook"
            >
              <FaFacebook className="text-sm lg:text-base" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:border-blue-600 transition-all duration-200"
              aria-label="Instagram"
            >
              <FaInstagram className="text-sm lg:text-base" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:border-blue-600 transition-all duration-200"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="text-sm lg:text-base" />
            </a>
          </div>
        </div>

        {/* Links Section - 3 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 lg:mb-10">
          {/* Categories */}
          <div>
            <h3 className="font-serif font-bold text-gray-900 dark:text-white mb-3 text-sm lg:text-base">
              Categories
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category.path}
                  onClick={() => handleCategoryClick(category.path)}
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 text-xs lg:text-sm transition-colors text-left group flex items-center"
                >
                  <FaArrowRight className="mr-1.5 text-[10px] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif font-bold text-gray-900 dark:text-white mb-3 text-sm lg:text-base">
              Quick Links
            </h3>
            <div className="space-y-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 text-xs lg:text-sm transition-colors"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif font-bold text-gray-900 dark:text-white mb-3 text-sm lg:text-base">
              Contact Us
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-600 flex-shrink-0 text-sm" />
                <span className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm">
                  Sirsi, Karnataka 581401
                </span>
              </li>
              <li className="flex items-center gap-2">
                <FaPhone className="text-blue-600 flex-shrink-0 text-sm" />
                <span className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm">
                  +91 98765 43210
                </span>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-blue-600 flex-shrink-0 text-sm" />
                <span className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm">
                  contact@primenews.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mb-8 lg:mb-10 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-md mx-auto text-center">
            <h3 className="font-serif font-bold text-gray-900 dark:text-white mb-2 text-sm lg:text-base">
              Newsletter
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm mb-3">
              Get the latest news delivered to your inbox
            </p>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const email = e.target.email.value;
                if (email && email.includes('@')) {
                  e.target.reset();
                }
              }}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                type="email"
                name="email"
                placeholder="Your email address"
                className="flex-1 px-3 py-2 text-xs lg:text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white text-xs lg:text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-5 lg:pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-[11px] lg:text-xs text-gray-500 dark:text-gray-400 mb-2">
              © {currentYear} PrimeNews. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[11px] lg:text-xs text-gray-500 dark:text-gray-400">
              <Link to="/privacy" className="hover:text-blue-600 transition-colors">
                Privacy Policy
              </Link>
              <span className="text-gray-300 dark:text-gray-600 select-none">•</span>
              <Link to="/terms" className="hover:text-blue-600 transition-colors">
                Terms
              </Link>
              <span className="text-gray-300 dark:text-gray-600 select-none">•</span>
              <Link to="/contact" className="hover:text-blue-600 transition-colors">
                Contact
              </Link>
              <span className="text-gray-300 dark:text-gray-600 select-none">•</span>
              <Link to="/sitemap" className="hover:text-blue-600 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};