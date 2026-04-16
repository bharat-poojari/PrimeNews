import axios from "axios";
import { cacheService } from "./cache";

class NewsService {
  constructor() {
    this.api = axios.create({ timeout: 15000 });
  }

  async searchNews(query, page = 1) {
    if (!query || query.trim() === '') {
      return { articles: [], totalResults: 0 };
    }
    
    const cacheKey = `search-${query.trim()}-${page}`;
    const cached = cacheService.get(cacheKey);
    if (cached) {
      console.log('Returning cached search results');
      return cached;
    }
    
    try {
      console.log(`Searching for: "${query}" on page ${page}`);
      
      // Use the Vercel API route
      const response = await this.api.get('/api/news', {
        params: {
          endpoint: 'search',
          q: query.trim(),
          page: page
        }
      });
      
      const data = response.data;
      console.log(`Search results: ${data.articles?.length || 0} articles found`);
      
      if (data.articles && data.articles.length > 0) {
        cacheService.set(cacheKey, data, 300);
      }
      
      return data;
    } catch (error) {
      console.error('Search error:', error);
      return { articles: [], totalResults: 0, error: error.message };
    }
  }

  async fetchTopHeadlines(category = "general", country = "in", page = 1) {
    const cacheKey = `headlines-${category}-${country}-${page}`;
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;
    
    try {
      const response = await this.api.get('/api/news', {
        params: {
          endpoint: 'headlines',
          category: category,
          country: country,
          page: page
        }
      });
      
      const data = response.data;
      if (data.articles && data.articles.length > 0) {
        cacheService.set(cacheKey, data, 300);
      }
      return data;
    } catch (error) {
      console.error('Failed to fetch headlines:', error);
      return this.getMockData(category, page);
    }
  }

  async fetchTrending(page = 1) {
    const categories = ["technology", "business", "entertainment", "sports", "science", "health"];
    const promises = categories.map(cat => this.fetchTopHeadlines(cat, "in", page));
    const results = await Promise.all(promises);
    const allArticles = results.flatMap(result => result.articles || []);
    const uniqueArticles = [];
    const seenUrls = new Set();
    
    for (const article of allArticles) {
      if (article.url && !seenUrls.has(article.url)) {
        seenUrls.add(article.url);
        uniqueArticles.push(article);
      }
    }
    
    return uniqueArticles;
  }

  getMockData(category = "general", page = 1) {
    const start = 30 * (page - 1);
    const end = start + 30;
    
    const mockArticles = Array(50).fill().map((_, i) => ({
      source: { id: "1", name: "News Source" },
      author: "News Desk",
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} News ${i + 1}: Latest updates and breaking stories`,
      description: `Stay informed with the latest ${category} news and updates from around the world.`,
      url: `https://example.com/news/${i + 1}`,
      urlToImage: `https://picsum.photos/id/${(i % 100) + 1}/800/600`,
      publishedAt: new Date(Date.now() - 3600000 * i).toISOString(),
      content: `Full story content would appear here. This is a detailed report about current events in ${category}.`
    }));
    
    return {
      articles: mockArticles.slice(start, end),
      totalResults: 50,
      status: "ok"
    };
  }
}

export const newsService = new NewsService();