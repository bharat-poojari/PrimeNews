import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaTwitter, 
  FaFacebook, 
  FaInstagram,
  FaLinkedin,
  FaPaperPlane
} from 'react-icons/fa';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      title: 'Visit Us',
      lines: ['123 News Street', 'Media City, NY 10001', 'United States'],
    },
    {
      icon: FaPhone,
      title: 'Call Us',
      lines: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
    },
    {
      icon: FaEnvelope,
      title: 'Email Us',
      lines: ['info@PrimeNews.com', 'support@PrimeNews.com'],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4 dark:text-white">Contact Us</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Have questions or feedback? We'd love to hear from you. 
          Reach out to our team and we'll get back to you as soon as possible.
        </p>
      </motion.div>

      {/* Contact Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {contactInfo.map((info, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center"
          >
            <div className="inline-block p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
              <info.icon className="text-3xl text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-3 dark:text-white">{info.title}</h3>
            {info.lines.map((line, i) => (
              <p key={i} className="text-gray-600 dark:text-gray-400">
                {line}
              </p>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Contact Form and Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold mb-6 dark:text-white">Send Us a Message</h2>
          
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg p-6 text-center"
            >
              <div className="text-green-600 dark:text-green-400 text-5xl mb-4">✓</div>
              <h3 className="text-xl font-bold mb-2 text-green-800 dark:text-green-300">
                Message Sent Successfully!
              </h3>
              <p className="text-green-700 dark:text-green-400">
                Thank you for contacting us. We'll get back to you within 24 hours.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-white">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-white">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-white">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="What is this about?"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-white">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Your message here..."
                />
              </div>
              
              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center space-x-2"
              >
                <FaPaperPlane />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </motion.div>

        {/* Map and Social */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Map Placeholder */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden h-64">
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <div className="text-center">
                <FaMapMarkerAlt className="text-5xl text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">
                  Interactive Map Placeholder
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  123 News Street, Media City, NY 10001
                </p>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 dark:text-white">Follow Us</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Stay connected with us on social media for the latest updates and news.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter className="text-xl" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook className="text-xl" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="text-xl" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="text-xl" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};