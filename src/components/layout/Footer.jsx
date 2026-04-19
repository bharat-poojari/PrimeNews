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
        {/* Brand Section - Centered */}
        <div className="text-center mb-8 lg:mb-10">
          <h2 className="font-serif text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3">
            Prime<span className="text-blue-600 bg-none">News</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto">
            Delivering trustworthy, insightful news coverage since 2024.
          </p>
        </div>

        {/* Social Icons - Centered */}
        <div className="flex justify-center space-x-4 mb-10 lg:mb-12">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:border-blue-600 hover:shadow-md transition-all duration-200"
            aria-label="Twitter"
          >
            <FaTwitter className="text-base lg:text-lg" />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:border-blue-600 hover:shadow-md transition-all duration-200"
            aria-label="Facebook"
          >
            <FaFacebook className="text-base lg:text-lg" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:border-blue-600 hover:shadow-md transition-all duration-200"
            aria-label="Instagram"
          >
            <FaInstagram className="text-base lg:text-lg" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:border-blue-600 hover:shadow-md transition-all duration-200"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="text-base lg:text-lg" />
          </a>
        </div>

        {/* Main Links Grid - Categories & Quick Links with Equal Spacing */}
        <div className="max-w-4xl mx-auto mb-10 lg:mb-12">
          <div className="grid grid-cols-2 gap-8 md:gap-12 lg:gap-16">
            {/* Categories - Left Column */}
            <div className="text-left">
              <h3 className="font-serif text-base lg:text-lg font-bold text-gray-900 dark:text-white mb-4 lg:mb-5 text-center sm:text-left">
                Categories
              </h3>
              <div className="space-y-2.5 lg:space-y-3">
                {categories.map((category) => (
                  <button
                    key={category.path}
                    onClick={() => handleCategoryClick(category.path)}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 text-sm lg:text-base transition-colors flex items-center justify-center sm:justify-start group w-full"
                  >
                    <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Links - Right Column */}
            <div className="text-left">
              <h3 className="font-serif text-base lg:text-lg font-bold text-gray-900 dark:text-white mb-4 lg:mb-5 text-center sm:text-left">
                Quick Links
              </h3>
              <div className="space-y-2.5 lg:space-y-3">
                {quickLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 text-sm lg:text-base transition-colors flex items-center justify-center sm:justify-start w-full"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter and Contact Section */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
            {/* Newsletter - First on mobile, left on desktop */}
            <div className="text-center md:text-left order-1 md:order-1">
              <h3 className="font-serif text-base lg:text-lg font-bold text-gray-900 dark:text-white mb-4 lg:mb-5">
                Newsletter
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Get the latest news delivered to your inbox
              </p>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const email = e.target.email.value;
                  if (email && email.includes('@')) {
                    alert('Subscribed successfully!');
                    e.target.reset();
                  } else {
                    alert('Please enter a valid email');
                  }
                }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="email"
                  name="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-2.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shadow-sm hover:shadow-md"
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* Contact Us - Second on mobile, right on desktop with icons on LEFT */}
            <div className="text-center md:text-right order-2 md:order-2">
              <h3 className="font-serif text-base lg:text-lg font-bold text-gray-900 dark:text-white mb-4 lg:mb-5">
                Contact Us
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center justify-center md:justify-start space-x-3">
                  <FaMapMarkerAlt className="text-blue-600 flex-shrink-0 text-base" />
                  <span className="text-gray-600 dark:text-gray-400 text-sm">
                    Sirsi, Karnataka 581401
                  </span>
                </li>
                <li className="flex items-center justify-center md:justify-start space-x-3">
                  <FaPhone className="text-blue-600 flex-shrink-0 text-base" />
                  <span className="text-gray-600 dark:text-gray-400 text-sm">
                    +91 98765 43210
                  </span>
                </li>
                <li className="flex items-center justify-center md:justify-start space-x-3">
                  <FaEnvelope className="text-blue-600 flex-shrink-0 text-base" />
                  <span className="text-gray-600 dark:text-gray-400 text-sm">
                    contact@primenews.com
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Centered Copyright with Policy Links */}
        <div className="mt-10 lg:mt-12 pt-6 lg:pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 mb-3">
              © {currentYear} PrimeNews. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400">
              <Link to="/privacy" className="hover:text-blue-600 transition-colors">
                Privacy Policy
              </Link>
              <span className="text-gray-300 dark:text-gray-600 select-none">•</span>
              <Link to="/terms" className="hover:text-blue-600 transition-colors">
                Terms of Service
              </Link>
              <span className="text-gray-300 dark:text-gray-600 select-none">•</span>
              <Link to="/contact" className="hover:text-blue-600 transition-colors">
                Contact Us
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