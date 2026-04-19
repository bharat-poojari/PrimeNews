import { Link } from 'react-router-dom'
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t mt-auto">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="text-center mb-8">
          <h2 className="font-serif text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
            Prime<span className="text-blue-600 bg-none">News</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto">
            Delivering trustworthy, insightful news coverage.
          </p>
        </div>

        <div className="flex justify-center space-x-3 mb-8">
          <a href="#" className="p-2 bg-white dark:bg-gray-800 border rounded-full text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-all">
            <FaTwitter className="text-sm" />
          </a>
          <a href="#" className="p-2 bg-white dark:bg-gray-800 border rounded-full text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-all">
            <FaFacebook className="text-sm" />
          </a>
          <a href="#" className="p-2 bg-white dark:bg-gray-800 border rounded-full text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-all">
            <FaInstagram className="text-sm" />
          </a>
          <a href="#" className="p-2 bg-white dark:bg-gray-800 border rounded-full text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-all">
            <FaLinkedin className="text-sm" />
          </a>
        </div>

        <div className="border-t pt-8 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © {currentYear} PrimeNews. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}