// src/pages/ArticlePage.jsx
import { useEffect, useRef, useState } from 'react';
import { useLocation, Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { format, isValid } from 'date-fns';
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
  const [readingProgress, setReadingProgress] = useState(0);
  const readingAreaRef = useRef(null);
  
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

  useEffect(() => {
    const updateProgress = () => {
      const readingArea = readingAreaRef.current;
      if (!readingArea) return;

      const topOffset = Math.min(180, window.innerHeight * 0.22);
      const { top, height } = readingArea.getBoundingClientRect();
      const distance = Math.max(1, height - window.innerHeight + topOffset);
      const progress = Math.min(100, Math.max(0, ((topOffset - top) / distance) * 100));
      setReadingProgress(Math.round(progress));
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    document.body.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      window.removeEventListener('scroll', updateProgress);
      document.body.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [article]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      window.setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Unable to copy article link:', error);
    }
  };

  const getFallbackImage = () => {
    const seed = (article?.url || article?.title || 'news')
      .split('')
      .reduce((total, char) => total + char.charCodeAt(0), 0);
    return `https://picsum.photos/id/${(seed % 100) + 1}/1200/600`;
  };

  const cleanArticleText = (value) => String(value || '')
      .replace(/\[[^\]]*\]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const buildArticleBody = (sourceArticle) => {
    const summary = cleanArticleText(sourceArticle?.description);
    let content = cleanArticleText(sourceArticle?.content);
    if (summary && content.toLowerCase().startsWith(summary.toLowerCase())) {
      content = content.slice(summary.length).trim();
    }
    if (!content) return [];

    const sentences = content.split(/(?<=[.!?])\s+/).filter(Boolean);
    const paragraphs = [];
    for (let i = 0; i < sentences.length; i += 3) {
      paragraphs.push(sentences.slice(i, i + 3).join(' '));
    }
    return paragraphs;
  };

  if (!article) {
    return null;
  }

  const shareUrl = window.location.href;
  const publishDate = new Date(article.publishedAt);
  const articleBody = buildArticleBody(article);
  const summary = cleanArticleText(article.description) || cleanArticleText(article.content);
  const publishedDateLabel = isValid(publishDate) ? format(publishDate, 'MMMM dd, yyyy') : 'Date unavailable';
  const authorName = cleanArticleText(article.author);
  const sourceName = article.source?.name || 'The publisher';

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
        <div
          className="fixed inset-x-0 top-14 lg:top-16 z-40 h-1 bg-gray-200/80 dark:bg-gray-700/80"
          role="progressbar"
          aria-label="Article reading progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={readingProgress}
        >
          <div
            className="h-full bg-blue-600 transition-[width] duration-150"
            style={{ width: `${readingProgress}%` }}
          />
        </div>

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
                    {publishedDateLabel}
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
          <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-10 lg:gap-14">
              {/* Main Content */}
              <div className="w-full max-w-[1040px]">
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

                <div ref={readingAreaRef} className="max-w-[880px]">
                  <section className="mb-10 border-l-4 border-blue-600 bg-blue-50/70 dark:bg-blue-950/30 px-5 py-5 sm:px-7 sm:py-6">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700 dark:text-blue-300 mb-3">
                      Story brief
                    </p>
                    <p className="text-xl sm:text-2xl font-serif font-semibold leading-relaxed text-gray-900 dark:text-white">
                      {summary || 'Open the publisher’s report for the complete story.'}
                    </p>
                  </section>

                  <section className="prose prose-lg dark:prose-invert max-w-none">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                      <h2 className="!m-0 text-xs font-bold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                        Article details
                      </h2>
                      <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                    </div>
                    {articleBody.length > 0 ? (
                      <div className="text-gray-800 dark:text-gray-200 text-lg lg:text-xl leading-[1.85] space-y-6">
                    {articleBody.map((paragraph, index) => (
                      <p key={`${article.url || article.title}-paragraph-${index}`}>{paragraph}</p>
                    ))}
                      </div>
                    ) : (
                      <div className="border-y border-gray-200 dark:border-gray-700 py-5 text-gray-600 dark:text-gray-300">
                        <p className="text-base leading-relaxed">
                          {sourceName} supplied a summary rather than the full article text. Read the complete report on the publisher’s website.
                        </p>
                        {article.url && article.url !== '#' && (
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex mt-4 text-blue-700 dark:text-blue-300 font-semibold hover:underline"
                          >
                            Continue to {sourceName} <span aria-hidden="true" className="ml-1">&rarr;</span>
                          </a>
                        )}
                      </div>
                    )}
                  </section>

                  <section className="mt-10 flex items-center gap-4 border-y border-gray-200 dark:border-gray-700 py-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                      <FaUser aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
                        {authorName ? 'Byline' : 'Published by'}
                      </p>
                      <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                        {authorName || sourceName}
                      </p>
                      {authorName && (
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          Published by {sourceName}. The feed does not provide a verified author biography.
                        </p>
                      )}
                    </div>
                  </section>
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
              <div className="w-full">
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