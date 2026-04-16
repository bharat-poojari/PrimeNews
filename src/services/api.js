import axios from "axios";
import { cacheService } from "./cache";

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const GNEWS_API_KEY = import.meta.env.VITE_GNEWS_API_KEY;
const MEDIASTACK_API_KEY = import.meta.env.VITE_MEDIASTACK_API_KEY;

class NewsService {
  constructor() {
    this.api = axios.create({ timeout: 15000 });
    this.currentApiIndex = 0;
    
    this.apis = [
      {
        name: "NewsAPI",
        enabled: !!NEWS_API_KEY,
        fetchHeadlines: async (category, country, page) => {
          const response = await this.api.get(`https://newsapi.org/v2/top-headlines`, {
            params: {
              country: country,
              category: category !== "general" ? category : undefined,
              page: page,
              pageSize: 30,
              apiKey: NEWS_API_KEY
            }
          });
          return response.data;
        },
        fetchSearch: async (query, page) => {
          const response = await this.api.get(`https://newsapi.org/v2/everything`, {
            params: {
              q: query,
              pageSize: 30,
              page: page,
              sortBy: "publishedAt",
              apiKey: NEWS_API_KEY
            }
          });
          return response.data;
        }
      },
      {
        name: "GNews",
        enabled: !!GNEWS_API_KEY,
        fetchHeadlines: async (category, country, page) => {
          const response = await this.api.get("https://gnews.io/api/v4/top-headlines", {
            params: {
              token: GNEWS_API_KEY,
              country: country,
              category: category,
              lang: "en",
              max: 30,
              page: page
            }
          });
          
          return {
            articles: (response.data.articles || []).map(article => ({
              source: { id: null, name: article.source?.name || "GNews" },
              author: article.author,
              title: article.title,
              description: article.description,
              url: article.url,
              urlToImage: article.image,
              publishedAt: article.publishedAt,
              content: article.content
            })),
            totalResults: response.data.totalArticles || 0,
            status: "ok"
          };
        },
        fetchSearch: async (query, page) => {
          const response = await this.api.get("https://gnews.io/api/v4/search", {
            params: {
              token: GNEWS_API_KEY,
              q: query,
              lang: "en",
              max: 30,
              page: page,
              sortby: "publishedAt"
            }
          });
          
          return {
            articles: (response.data.articles || []).map(article => ({
              source: { id: null, name: article.source?.name || "GNews" },
              author: article.author,
              title: article.title,
              description: article.description,
              url: article.url,
              urlToImage: article.image,
              publishedAt: article.publishedAt,
              content: article.content
            })),
            totalResults: response.data.totalArticles || 0,
            status: "ok"
          };
        }
      }
    ];
    
    this.enabledApis = this.apis.filter(api => api.enabled);
  }

  async fetchWithFallback(method, ...args) {
    if (this.enabledApis.length === 0) {
      return this.getMockData(args[0], args[2]);
    }
    
    for (let i = 0; i < this.enabledApis.length; i++) {
      const api = this.enabledApis[(this.currentApiIndex + i) % this.enabledApis.length];
      try {
        const result = await api[method](...args);
        if (result.articles && result.articles.length > 0) {
          this.currentApiIndex = (this.currentApiIndex + i) % this.enabledApis.length;
          return result;
        }
      } catch (error) {
        console.error(`${api.name} failed:`, error.message);
      }
    }
    
    return this.getMockData(args[0], args[2] || 1);
  }

  async fetchTopHeadlines(category = "general", country = "in", page = 1) {
    const cacheKey = `headlines-${category}-${country}-${page}`;
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;
    
    try {
      const result = await this.fetchWithFallback("fetchHeadlines", category, country, page);
      if (result.articles && result.articles.length > 0) {
        cacheService.set(cacheKey, result, 300);
      }
      return result;
    } catch (error) {
      console.error("All APIs failed:", error);
      return this.getMockData(category, page);
    }
  }

  async searchNews(query, page = 1) {
    if (!query || query.trim() === '') {
      return { articles: [], totalResults: 0 };
    }
    
    const cacheKey = `search-${query.trim()}-${page}`;
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;
    
    try {
      for (let i = 0; i < this.enabledApis.length; i++) {
        const api = this.enabledApis[(this.currentApiIndex + i) % this.enabledApis.length];
        try {
          const result = await api.fetchSearch(query, page);
          if (result.articles && result.articles.length > 0) {
            cacheService.set(cacheKey, result, 300);
            return result;
          }
        } catch (err) {
          console.error(`${api.name} search failed:`, err.message);
        }
      }
      
      return { articles: [], totalResults: 0 };
    } catch (error) {
      console.error('Search error:', error);
      return { articles: [], totalResults: 0 };
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
      title: `Latest News Update ${i + 1}: Important developments in ${category}`,
      description: `Stay informed with the latest news and updates from around the world. This is story number ${i + 1}.`,
      url: `https://example.com/news/${i + 1}`,
      urlToImage: `https://picsum.photos/id/${(i % 100) + 1}/800/600`,
      publishedAt: new Date(Date.now() - 3600000 * i).toISOString(),
      content: `Full story content would appear here. This is a detailed report about current events.`
    }));
    
    return {
      articles: mockArticles.slice(start, end),
      totalResults: 50,
      status: "ok"
    };
  }
}

export const newsService = new NewsService();