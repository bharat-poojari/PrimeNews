// src/components/layout/Footer.jsx
import { Link, useNavigate } from 'react-router-dom';
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const categories = [
    { name: 'Technology', path: '/category/technology' },
    { name: 'Business', path: '/category/business' },
    { name: 'Sports', path: '/category/sports' },
    { name: 'Entertainment', path: '/category/entertainment' },
    { name: 'Health', path: '/category/health' },
    { name: 'Science', path: '/category/science' },
  ];

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Trending', path: '/trending' },
    { name: 'Videos', path: '/videos' },
    { name: 'Bookmarks', path: '/bookmarks' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-white mb-3">
              Prime<span className="text-blue-500">News</span>
            </h2>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Delivering trustworthy, insightful news coverage from around the world since 2024.
            </p>
            <div className="flex space-x-3">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-social-icon p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition-all duration-300"
                aria-label="Twitter"
              >
                <FaTwitter className="text-sm" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-social-icon p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition-all duration-300"
                aria-label="Facebook"
              >
                <FaFacebook className="text-sm" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-social-icon p-2 bg-gray-800 rounded-full hover:bg-pink-600 transition-all duration-300"
                aria-label="Instagram"
              >
                <FaInstagram className="text-sm" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-social-icon p-2 bg-gray-800 rounded-full hover:bg-blue-700 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="text-sm" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-white mb-3 text-lg">Categories</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.path}>
                  <button 
                    onClick={() => { navigate(cat.path); window.scrollTo(0, 0); }} 
                    className="footer-link text-sm text-gray-400 hover:text-blue-500 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <FaArrowRight className="text-xs opacity-0 group-hover:opacity-100 transition-all duration-200" />
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-3 text-lg">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    onClick={() => window.scrollTo(0, 0)} 
                    className="footer-link text-sm text-gray-400 hover:text-blue-500 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-white mb-3 text-lg">Contact Us</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-blue-500 text-base mt-0.5 flex-shrink-0" />
                <span>Sirsi, Karnataka 581401, India</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-blue-500 text-sm flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-blue-500 text-sm flex-shrink-0" />
                <span>contact@primenews.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 pt-6 mb-6">
          <div className="max-w-md mx-auto text-center">
            <h3 className="font-semibold text-white mb-2">Subscribe to Newsletter</h3>
            <p className="text-xs text-gray-400 mb-3">Get the latest news delivered to your inbox</p>
            <form onSubmit={(e) => { e.preventDefault(); e.target.reset(); }} className="flex gap-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white transition-all duration-200" 
                required 
              />
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-xs text-gray-500">© {currentYear} PrimeNews. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs">
            <Link to="/privacy" className="footer-link text-gray-500 hover:text-blue-500 transition-colors duration-200">Privacy Policy</Link>
            <span className="text-gray-700">•</span>
            <Link to="/terms" className="footer-link text-gray-500 hover:text-blue-500 transition-colors duration-200">Terms of Use</Link>
            <span className="text-gray-700">•</span>
            <Link to="/contact" className="footer-link text-gray-500 hover:text-blue-500 transition-colors duration-200">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};