import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { newsService } from '../services/api'
import { NewsCard } from '../components/news/NewsCard'
import { SearchBar } from '../components/common/SearchBar'

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const performSearch = async () => {
      if (!query || query.trim() === '') {
        setResults([])
        return
      }

      setLoading(true)
      const data = await newsService.searchNews(query, 1)
      setResults(data.articles || [])
      setLoading(false)
    }

    performSearch()
  }, [query])

  const handleSearch = (searchQuery) => {
    if (searchQuery && searchQuery.trim()) {
      setSearchParams({ q: searchQuery })
    }
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Search News</h1>
      
      <div className="mb-8">
        <SearchBar initialValue={query} onSearch={handleSearch} autoFocus={true} />
      </div>

      {query && (
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Found {results.length} results for "{query}"
        </p>
      )}

      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((article, index) => (
            <NewsCard key={article.url || index} article={article} />
          ))}
        </div>
      ) : query && !loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No results found for "{query}"</p>
        </div>
      ) : null}
    </div>
  )
}