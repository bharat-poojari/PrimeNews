// PrimeNews/src/pages/ArticlePage.jsx
import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { format } from 'date-fns';
import { 
  FaFacebook, 
  FaTwitter, 
  FaWhatsapp, 
  FaLinkedin, 
  FaLink,
  FaCalendar,
  FaUser,
  FaArrowLeft,
  FaShare
} from 'react-icons/fa';
import { 
  FacebookShareButton, 
  TwitterShareButton, 
  WhatsappShareButton, 
  LinkedinShareButton 
} from 'react-share';
import { BookmarkButton } from '../components/common/BookmarkButton';
import { NewsGrid } from '../components/news/NewsGrid';
import { useAnalyticsStore } from '../store/analyticsStore';
import { useNewsStore } from '../store/newsStore';
import { newsService } from '../services/api';

export const ArticlePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { articleId } = useParams();
  const article = location.state?.article;
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  const { trackArticleClick } = useAnalyticsStore();
  const { addViewedArticle } = useNewsStore();

  useEffect(() => {
    if (!article) {
      const savedArticle = localStorage.getItem(`article_${articleId}`);
      if (savedArticle) {
        try {
          const parsed = JSON.parse(savedArticle);
          navigate(location.pathname, { state: { article: parsed }, replace: true });
        } catch (e) {
          navigate('/');
        }
      } else {
        navigate('/');
      }
      return;
    }

    trackArticleClick(article.url, article.title);
    addViewedArticle(article);
    
    localStorage.setItem(`article_${articleId}`, JSON.stringify(article));
    
    const fetchRelated = async () => {
      try {
        const searchTerm = article.source?.name || article.title?.split(' ').slice(0, 3).join(' ');
        const data = await newsService.searchNews(searchTerm);
        setRelatedArticles(data.articles?.filter(a => a.url !== article.url).slice(0, 6) || []);
      } catch (error) {
        console.error('Failed to fetch related articles:', error);
      }
    };
    
    fetchRelated();
  }, [article, articleId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  if (!article) {
    return null;
  }

  const shareUrl = window.location.href;
  const publishDate = new Date(article.publishedAt);

  return (
    <>
      <Helmet>
        <title>{article.title} - PrimeNews</title>
        <meta name="description" content={article.description} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.description} />
        <meta property="og:image" content={article.urlToImage} />
        <meta property="og:url" content={shareUrl} />
      </Helmet>

      <article className="bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 pt-24 pb-6">
          <Link to="/" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="relative h-[50vh] min-h-[400px]">
          <img
            src={article.urlToImage || 'https://picsum.photos/id/104/1200/600'}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://picsum.photos/id/104/1200/600';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0">
            <div className="container mx-auto px-4 py-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <span className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded">
                    {article.source?.name || 'News'}
                  </span>
                  <span className="text-white/80 text-sm flex items-center">
                    <FaCalendar className="mr-1" />
                    {format(publishDate, 'MMMM dd, yyyy')}
                  </span>
                  {article.author && (
                    <span className="text-white/80 text-sm flex items-center">
                      <FaUser className="mr-1" />
                      {article.author}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                  {article.title}
                </h1>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <div className="flex items-center justify-between mb-6 pb-6 border-b dark:border-gray-700">
                <div className="flex items-center space-x-4">
                  <BookmarkButton article={article} />
                  
                  <div className="relative">
                    <button
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <FaShare />
                    </button>
                    
                    {showShareMenu && (
                      <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 flex space-x-2 z-10">
                        <FacebookShareButton url={shareUrl} quote={article.title}>
                          <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                            <FaFacebook />
                          </button>
                        </FacebookShareButton>
                        
                        <TwitterShareButton url={shareUrl} title={article.title}>
                          <button className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors">
                            <FaTwitter />
                          </button>
                        </TwitterShareButton>
                        
                        <WhatsappShareButton url={shareUrl} title={article.title}>
                          <button className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors">
                            <FaWhatsapp />
                          </button>
                        </WhatsappShareButton>
                        
                        <LinkedinShareButton url={shareUrl} title={article.title} summary={article.description}>
                          <button className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors">
                            <FaLinkedin />
                          </button>
                        </LinkedinShareButton>
                        
                        <button
                          onClick={handleCopyLink}
                          className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors relative"
                        >
                          <FaLink />
                          {copySuccess && (
                            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap">
                              Copied!
                            </span>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Read Full Article
                </a>
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-xl font-medium mb-6 text-gray-700 dark:text-gray-300">
                  {article.description}
                </p>
                
                {article.content ? (
                  <div className="text-gray-800 dark:text-gray-200">
                    <p>{article.content.replace(/\[.*?\]/g, '')}</p>
                  </div>
                ) : (
                  <div className="text-gray-600 dark:text-gray-400">
                    <p>Full article content is available on the source website. Click the "Read Full Article" button above to view the complete story.</p>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t dark:border-gray-700">
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <span className="text-sm">Source:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {article.source?.name || 'Unknown Source'}
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:w-1/3">
              <div className="sticky top-24">
                <h2 className="text-2xl font-bold mb-6 dark:text-white">Related Articles</h2>
                {relatedArticles.length > 0 ? (
                  <NewsGrid articles={relatedArticles} columns={1} />
                ) : (
                  <div className="text-gray-500 dark:text-gray-400">Loading related articles...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
};