import { Link } from 'react-router-dom';
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

  const categories = [
    { name: 'Technology', path: '/category/technology' },
    { name: 'Business', path: '/category/business' },
    { name: 'Sports', path: '/category/sports' },
    { name: 'Entertainment', path: '/category/entertainment' },
    { name: 'Health', path: '/category/health' },
    { name: 'Science', path: '/category/science' },
  ];

  const quickLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Cookie Policy', path: '/cookies' },
    { name: 'Advertise', path: '/advertise' },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-4">
              The<span className="text-accent">Chronicle</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
              Delivering trustworthy, insightful news coverage since 2024. 
              Stay informed with our comprehensive reporting and expert analysis.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-600 dark:text-gray-400 hover:text-accent hover:border-accent transition-all"
                aria-label="Twitter"
              >
                <FaTwitter className="text-lg" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-600 dark:text-gray-400 hover:text-accent hover:border-accent transition-all"
                aria-label="Facebook"
              >
                <FaFacebook className="text-lg" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-600 dark:text-gray-400 hover:text-accent hover:border-accent transition-all"
                aria-label="Instagram"
              >
                <FaInstagram className="text-lg" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-600 dark:text-gray-400 hover:text-accent hover:border-accent transition-all"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="text-lg" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.path}>
                  <Link
                    to={category.path}
                    className="text-gray-600 dark:text-gray-400 hover:text-accent text-sm transition-colors flex items-center group"
                  >
                    <FaArrowRight className="mr-2 text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-600 dark:text-gray-400 hover:text-accent text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-accent mt-1 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  123 News Street, Media City, NY 10001
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="text-accent flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  +1 (555) 123-4567
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-accent flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  contact@thechronicle.com
                </span>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Newsletter</h4>
              <form className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-accent transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent-dark transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <p>&copy; {currentYear} The Chronicle. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <Link to="/privacy" className="hover:text-accent transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-accent transition-colors">
                Terms
              </Link>
              <Link to="/cookies" className="hover:text-accent transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};