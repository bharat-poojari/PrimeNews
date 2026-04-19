import { useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { format } from 'date-fns'
import { FaArrowLeft, FaCalendar, FaUser } from 'react-icons/fa'
import { Helmet } from 'react-helmet-async'
import { BookmarkButton } from '../components/common/BookmarkButton'

export const ArticlePage = () => {
  const location = useLocation()
  const article = location.state?.article

  useEffect(() => {
    if (!article) {
      window.location.href = '/'
    }
  }, [article])

  if (!article) {
    return null
  }

  const publishDate = new Date(article.publishedAt)

  return (
    <>
      <Helmet>
        <title>{article.title} - PrimeNews</title>
        <meta name="description" content={article.description} />
      </Helmet>

      <article className="bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-6">
          <Link to="/" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600">
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="relative h-[40vh] min-h-[300px]">
          <img
            src={article.urlToImage || 'https://picsum.photos/id/104/1200/600'}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://picsum.photos/id/104/1200/600'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center space-x-4 mb-3">
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
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                {article.title}
              </h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6 pb-6 border-b">
            <BookmarkButton article={article} />
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
            <p className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">
              {article.description}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Click the "Read Full Article" button above to read the complete story on the source website.
            </p>
          </div>
        </div>
      </article>
    </>
  )
}