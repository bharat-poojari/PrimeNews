// PrimeNews/src/services/api.js
import axios from "axios";
import { cacheService } from "./cache";

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;

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
  }

  async fetchTopHeadlines(category = "general", country = "us", page = 1) {
    const cacheKey = `headlines-${category}-${country}-${page}`;
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.api.get(`${API_BASE_URL}/news`, {
        params: {
          endpoint: 'top-headlines',
          country: country || 'us',
          category: category,
          page: page
        }
      });
      
      const result = response.data;
      if (result.articles && result.articles.length > 0) {
        cacheService.set(cacheKey, result, 300);
        return result;
      }
      
      return { articles: [], totalResults: 0 };
    } catch (error) {
      console.error("Failed to fetch news:", error);
      return { articles: [], totalResults: 0 };
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
      const response = await this.api.get(`${API_BASE_URL}/news`, {
        params: {
          endpoint: 'everything',
          q: query.trim(),
          page: page,
          sortBy: 'publishedAt',
          language: 'en',
          pageSize: 30
        }
      });
      
      const result = response.data;
      if (result.articles) {
        cacheService.set(cacheKey, result, 300);
        return result;
      }
      
      return { articles: [], totalResults: 0 };
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
      const result = await this.searchNews(query, page);
      return result.articles || [];
    } catch (error) {
      console.error("Failed to fetch videos:", error);
      return [];
    }
  }
}

export const newsService = new NewsService();