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
import toast from 'react-hot-toast';

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

  const handleSubscribe = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (email && email.includes('@')) {
      toast.success('Subscribed successfully!');
      e.target.reset();
    } else {
      toast.error('Please enter a valid email');
    }
  };

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="text-center sm:text-left">
            <h2 className="font-serif text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3">
              Prime<span className="text-blue-600 bg-none">News</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
              Delivering trustworthy, insightful news coverage since 2024. 
              Stay informed with our comprehensive reporting and expert analysis.
            </p>
            <div className="flex justify-center sm:justify-start space-x-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:border-blue-600 transition-all duration-200"
                aria-label="Twitter"
              >
                <FaTwitter className="text-base" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:border-blue-600 transition-all duration-200"
                aria-label="Facebook"
              >
                <FaFacebook className="text-base" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:border-blue-600 transition-all duration-200"
                aria-label="Instagram"
              >
                <FaInstagram className="text-base" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:border-blue-600 transition-all duration-200"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="text-base" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div className="text-center sm:text-left">
            <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.path}>
                  <button
                    onClick={() => handleCategoryClick(category.path)}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 text-sm transition-colors flex items-center justify-center sm:justify-start group"
                  >
                    <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 text-sm transition-colors inline-block"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center sm:text-left">
            <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center justify-center sm:justify-start space-x-3">
                <FaMapMarkerAlt className="text-blue-600 flex-shrink-0 text-base" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  123 News Street, Media City, NY 10001
                </span>
              </li>
              <li className="flex items-center justify-center sm:justify-start space-x-3">
                <FaPhone className="text-blue-600 flex-shrink-0 text-base" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  +1 (555) 123-4567
                </span>
              </li>
              <li className="flex items-center justify-center sm:justify-start space-x-3">
                <FaEnvelope className="text-blue-600 flex-shrink-0 text-base" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  contact@primenews.com
                </span>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Newsletter</h4>
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <input
                  type="email"
                  name="email"
                  placeholder="Your email"
                  className="px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-600 transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 dark:text-gray-400 gap-3">
            <p>&copy; {currentYear} PrimeNews. All rights reserved.</p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="hover:text-blue-600 transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-blue-600 transition-colors">
                Terms
              </Link>
              <Link to="/contact" className="hover:text-blue-600 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};