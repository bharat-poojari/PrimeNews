// src/pages/ArticlePage.jsx
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
  const [imageError, setImageError] = useState(false);
  
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
  }, [article, articleId, location.pathname, navigate, trackArticleClick, addViewedArticle]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const getFallbackImage = () => {
    return 'https://picsum.photos/id/104/1200/600';
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
        <meta property="og:image" content={article.urlToImage || getFallbackImage()} />
        <meta property="og:url" content={shareUrl} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <article className="min-h-screen bg-white dark:bg-gray-900 w-full">
        {/* Back Button - Sticky full width */}
        <div className="w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-14 lg:top-16 z-30">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Link 
              to="/" 
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium"
            >
              <FaArrowLeft className="mr-2 text-xs" />
              Back to Home
            </Link>
          </div>
        </div>

        {/* Hero Image Section - Full Width */}
        <div className="relative w-full h-[50vh] lg:h-[60vh] min-h-[400px]">
          <img
            src={!imageError && article.urlToImage ? article.urlToImage : getFallbackImage()}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl"
              >
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs lg:text-sm font-semibold rounded">
                    {article.source?.name || 'News'}
                  </span>
                  <span className="text-white/80 text-xs lg:text-sm flex items-center">
                    <FaCalendar className="mr-1 text-xs" />
                    {format(publishDate, 'MMMM dd, yyyy')}
                  </span>
                  {article.author && (
                    <span className="text-white/80 text-xs lg:text-sm flex items-center">
                      <FaUser className="mr-1 text-xs" />
                      {article.author}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 leading-tight">
                  {article.title}
                </h1>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Article Content Section */}
        <div className="w-full">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              {/* Main Content */}
              <div className="lg:w-2/3">
                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <BookmarkButton article={article} />
                    
                    <div className="relative">
                      <button
                        onClick={() => setShowShareMenu(!showShareMenu)}
                        className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Share"
                      >
                        <FaShare className="text-sm" />
                      </button>
                      
                      {showShareMenu && (
                        <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 flex flex-wrap gap-2 z-10 min-w-[220px] border border-gray-200 dark:border-gray-700">
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
                            aria-label="Copy link"
                          >
                            <FaLink />
                            {copySuccess && (
                              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
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
                    className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Read Full Article
                  </a>
                </div>

                {/* Article Text */}
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-lg lg:text-xl font-medium mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                    {article.description}
                  </p>
                  
                  {article.content ? (
                    <div className="text-gray-800 dark:text-gray-200 text-base lg:text-lg leading-relaxed space-y-4">
                      <p>{article.content.replace(/\[.*?\]/g, '')}</p>
                    </div>
                  ) : (
                    <div className="text-gray-600 dark:text-gray-400 text-base lg:text-lg">
                      <p>Full article content is available on the source website. Click the "Read Full Article" button above to view the complete story.</p>
                    </div>
                  )}
                </div>

                {/* Source Info */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                    <span>Source:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {article.source?.name || 'Unknown Source'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Related Articles Sidebar */}
              <div className="lg:w-1/3">
                <div className="sticky top-24 lg:top-28">
                  <h2 className="text-xl lg:text-2xl font-bold mb-6 dark:text-white">Related Articles</h2>
                  {relatedArticles.length > 0 ? (
                    <div className="space-y-4">
                      {relatedArticles.map((related, index) => (
                        <div key={related.url || index} className="group">
                          <NewsGrid articles={[related]} columns={1} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
                      <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-3"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
};