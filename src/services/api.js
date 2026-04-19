// PrimeNews/src/services/api.js
import axios from "axios";
import { cacheService } from "./cache";

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const GNEWS_API_KEY = import.meta.env.VITE_GNEWS_API_KEY;
const MEDIASTACK_API_KEY = import.meta.env.VITE_MEDIASTACK_API_KEY;

// Determine if we're in production (Vercel) or development
const isProduction = import.meta.env.PROD;
const API_BASE_URL = isProduction ? '/api' : 'http://localhost:3000/api';

class NewsService {
  constructor() {
    this.api = axios.create({
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    this.currentApiIndex = 0;
    this.apis = [
      {
        name: "NewsAPI",
        enabled: !!NEWS_API_KEY && NEWS_API_KEY !== "",
        fetchHeadlines: async (category, country, page) => {
          const response = await this.api.get(`${API_BASE_URL}/news`, {
            params: {
              endpoint: 'top-headlines',
              country: country || 'us',
              category: category,
              page: page
            }
          });
          return response.data;
        },
        fetchSearch: async (query, page) => {
          const response = await this.api.get(`${API_BASE_URL}/news`, {
            params: {
              endpoint: 'everything',
              q: query,
              page: page
            }
          });
          return response.data;
        }
      },
      {
        name: "GNews",
        enabled: !!GNEWS_API_KEY && GNEWS_API_KEY !== "",
        fetchHeadlines: async (category, country, page) => {
          const response = await this.api.get(`${API_BASE_URL}/news`, {
            params: {
              endpoint: 'gnews',
              country: country || 'us',
              category: category,
              page: page
            }
          });
          return response.data;
        },
        fetchSearch: async (query, page) => {
          const response = await this.api.get(`${API_BASE_URL}/news`, {
            params: {
              endpoint: 'gnews-search',
              q: query,
              page: page
            }
          });
          return response.data;
        }
      },
      {
        name: "MediaStack",
        enabled: !!MEDIASTACK_API_KEY && MEDIASTACK_API_KEY !== "",
        fetchHeadlines: async (category, country, page) => {
          const response = await this.api.get(`${API_BASE_URL}/news`, {
            params: {
              endpoint: 'mediastack',
              country: country || 'us',
              category: category,
              page: page
            }
          });
          return response.data;
        },
        fetchSearch: async (query, page) => {
          const response = await this.api.get(`${API_BASE_URL}/news`, {
            params: {
              endpoint: 'mediastack-search',
              q: query,
              page: page
            }
          });
          return response.data;
        }
      }
    ];
    this.enabledApis = this.apis.filter(api => api.enabled);
    if (this.enabledApis.length === 0) {
      console.error("No API keys found! Please check your .env file.");
    }
  }

  async fetchWithFallback(method, ...args) {
    if (this.enabledApis.length === 0) {
      throw new Error("No API keys configured");
    }

    for (let i = 0; i < this.enabledApis.length; i++) {
      const api = this.enabledApis[(this.currentApiIndex + i) % this.enabledApis.length];
      try {
        console.log(`Trying ${api.name} for ${method}...`);
        const result = await api[method](...args);
        if (result.articles && result.articles.length > 0) {
          console.log(`Successfully fetched from ${api.name}`);
          this.currentApiIndex = (this.currentApiIndex + i) % this.enabledApis.length;
          return result;
        }
      } catch (error) {
        console.error(`${api.name} failed:`, error.message);
      }
    }
    throw new Error("All APIs failed to fetch data");
  }

  async fetchTopHeadlines(category = "general", country = "us", page = 1) {
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
      return { articles: [], totalResults: 0, status: "error" };
    }
  }

  async searchNews(query, page = 1) {
  if (!query || query.trim() === "") {
    return { articles: [], totalResults: 0 };
  }

  const cacheKey = `search-${query.trim()}-${page}`;
  const cached = cacheService.get(cacheKey);
  if (cached) return cached;

  try {
    console.log(`Searching for: ${query} on page ${page}`);
    const result = await this.fetchWithFallback("fetchSearch", query, page);
    
    // Ensure we return consistent data structure
    const articles = result.articles || [];
    const totalResults = result.totalResults || 0;
    
    console.log(`Page ${page} returned ${articles.length} articles. Total available: ${totalResults}`);
    
    // Cache the result
    if (articles.length > 0) {
      cacheService.set(cacheKey, { articles, totalResults }, 300);
    }
    
    return { articles, totalResults };
  } catch (error) {
    console.error("Search error:", error);
    return { articles: [], totalResults: 0 };
  }
}

  async fetchTrending(page = 1) {
    const categories = ["technology", "business", "entertainment", "sports"];
    try {
      const promises = categories.map(cat => this.fetchTopHeadlines(cat, "us", page));
      const results = await Promise.all(promises);
      const allArticles = results.flatMap(result => result.articles || []);
      
      // Remove duplicates
      const uniqueArticles = [];
      const seenUrls = new Set();
      for (const article of allArticles) {
        if (article.url && !seenUrls.has(article.url)) {
          seenUrls.add(article.url);
          uniqueArticles.push(article);
        }
      }
      
      return uniqueArticles;
    } catch (error) {
      console.error("Failed to fetch trending:", error);
      return [];
    }
  }

  async fetchVideos(query = "news today", page = 1) {
    try {
      const result = await this.searchNews(query + " video", page);
      return result.articles || [];
    } catch (error) {
      console.error("Failed to fetch videos:", error);
      return [];
    }
  }
}

export const newsService = new NewsService();