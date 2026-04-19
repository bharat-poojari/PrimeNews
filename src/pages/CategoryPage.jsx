import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import { newsService } from '../services/api'
import { NewsCard } from '../components/news/NewsCard'

export const CategoryPage = () => {
  const { categoryId } = useParams()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true)
      const data = await newsService.fetchTopHeadlines(categoryId, 'us', 1)
      setArticles(data.articles || [])
      setLoading(false)
    }
    fetchNews()
  }, [categoryId])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-80 animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 mb-6">
        <FaArrowLeft className="mr-2" />
        Back to Home
      </Link>
      
      <h1 className="text-3xl font-bold mb-6 dark:text-white capitalize">{categoryId} News</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <NewsCard key={article.url || index} article={article} />
        ))}
      </div>
    </div>
  )
}