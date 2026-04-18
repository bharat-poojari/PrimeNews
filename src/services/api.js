// PrimeNews/src/services/api.js
import axios from "axios";
import { cacheService } from "./cache";

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const GNEWS_API_KEY = import.meta.env.VITE_GNEWS_API_KEY;
const MEDIASTACK_API_KEY = import.meta.env.VITE_MEDIASTACK_API_KEY;

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
          const baseUrl = "https://newsapi.org/v2";
          const response = await this.api.get(`${baseUrl}/top-headlines`, {
            params: {
              country: country || 'us',
              category: category !== "general" ? category : undefined,
              page: page,
              pageSize: 30,
              apiKey: NEWS_API_KEY
            }
          });
          return response.data;
        },
        fetchSearch: async (query, page) => {
          const baseUrl = "https://newsapi.org/v2";
          const response = await this.api.get(`${baseUrl}/everything`, {
            params: {
              q: query,
              apiKey: NEWS_API_KEY,
              page: page,
              pageSize: 30,
              sortBy: "publishedAt",
              language: "en"
            }
          });
          return {
            articles: response.data.articles,
            totalResults: response.data.totalResults,
            status: "ok"
          };
        }
      },
      {
        name: "GNews",
        enabled: !!GNEWS_API_KEY && GNEWS_API_KEY !== "",
        fetchHeadlines: async (category, country, page) => {
          const response = await this.api.get("https://gnews.io/api/v4/top-headlines", {
            params: {
              token: GNEWS_API_KEY,
              country: country,
              category: category !== "general" ? category : undefined,
              max: 30,
              page: page,
              lang: "en"
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
      },
      {
        name: "MediaStack",
        enabled: !!MEDIASTACK_API_KEY && MEDIASTACK_API_KEY !== "",
        fetchHeadlines: async (category, country, page) => {
          const categoryMap = {
            general: "general",
            technology: "technology",
            business: "business",
            entertainment: "entertainment",
            sports: "sports",
            science: "science",
            health: "health"
          };
          const response = await this.api.get("http://api.mediastack.com/v1/news", {
            params: {
              access_key: MEDIASTACK_API_KEY,
              countries: country,
              categories: categoryMap[category] || "general",
              languages: "en",
              limit: 30,
              offset: 30 * (page - 1)
            }
          });
          return {
            articles: (response.data.data || []).map(article => ({
              source: { id: null, name: article.source || "MediaStack" },
              author: article.author,
              title: article.title,
              description: article.description,
              url: article.url,
              urlToImage: article.image,
              publishedAt: article.published_at,
              content: article.content
            })),
            totalResults: response.data.pagination?.total || 0,
            status: "ok"
          };
        },
        fetchSearch: async (query, page) => {
          const response = await this.api.get("http://api.mediastack.com/v1/news", {
            params: {
              access_key: MEDIASTACK_API_KEY,
              keywords: query,
              languages: "en",
              limit: 30,
              offset: 30 * (page - 1),
              sort: "published_desc"
            }
          });
          return {
            articles: (response.data.data || []).map(article => ({
              source: { id: null, name: article.source || "MediaStack" },
              author: article.author,
              title: article.title,
              description: article.description,
              url: article.url,
              urlToImage: article.image,
              publishedAt: article.published_at,
              content: article.content
            })),
            totalResults: response.data.pagination?.total || 0,
            status: "ok"
          };
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
      console.log(`Searching for: ${query} using ${this.enabledApis.length} APIs`);
      const result = await this.fetchWithFallback("fetchSearch", query, page);
      if (result.articles && result.articles.length > 0) {
        cacheService.set(cacheKey, result, 300);
      }
      return result;
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
    // Search for news videos using NewsAPI
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