import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { newsService } from '../services/api'
import { NewsCard } from '../components/news/NewsCard'
import { CategoryTabs } from '../components/common/CategoryTabs'

export const HomePage = () => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentCategory, setCurrentCategory] = useState('general')

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true)
      const data = await newsService.fetchTopHeadlines(currentCategory, 'us', 1)
      setArticles(data.articles || [])
      setLoading(false)
    }
    fetchNews()
  }, [currentCategory])

  const handleCategorySelect = (categoryId) => {
    setCurrentCategory(categoryId)
  }

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

  const featuredArticle = articles[0]
  const remainingArticles = articles.slice(1)

  return (
    <div className="container mx-auto px-4 py-8">
      <CategoryTabs onCategorySelect={handleCategorySelect} activeCategory={currentCategory} />

      {featuredArticle && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="relative rounded-xl overflow-hidden h-[400px] lg:h-[500px]">
            <img
              src={featuredArticle.urlToImage || 'https://picsum.photos/id/104/1200/600'}
              alt={featuredArticle.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://picsum.photos/id/104/1200/600'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
              <h1 className="font-serif text-2xl lg:text-4xl font-bold text-white mb-2 line-clamp-2">
                {featuredArticle.title}
              </h1>
              <p className="text-white/80 text-sm lg:text-base line-clamp-2">
                {featuredArticle.description}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {remainingArticles.map((article, index) => (
          <NewsCard key={article.url || index} article={article} />
        ))}
      </div>
    </div>
  )
}