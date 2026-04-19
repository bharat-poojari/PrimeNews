// src/services/api.js
import axios from "axios";

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const GNEWS_API_KEY = import.meta.env.VITE_GNEWS_API_KEY;
const MEDIASTACK_API_KEY = import.meta.env.VITE_MEDIASTACK_API_KEY;

// Cache system for faster subsequent loads
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map();
  }

  async get(key, fetcher, ttl = 300000) { // 5 minutes default TTL
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }

    // Prevent duplicate simultaneous requests
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }

    const promise = fetcher().then(data => {
      this.cache.set(key, { data, timestamp: Date.now() });
      this.pendingRequests.delete(key);
      return data;
    }).catch(error => {
      this.pendingRequests.delete(key);
      throw error;
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  clear(key) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
}

const cacheManager = new CacheManager();

class NewsService {
  constructor() {
    this.api = axios.create({
      timeout: 8000, // Reduced timeout for faster response
      headers: { "Content-Type": "application/json" },
    });
  }

  // Fetch top headlines with aggressive caching
  async fetchTopHeadlines(category = "general", country = "us", page = 1) {
    const cacheKey = `headlines_${category}_${country}_${page}`;
    
    return cacheManager.get(cacheKey, async () => {
      // Try NewsAPI first (fastest)
      if (NEWS_API_KEY && NEWS_API_KEY !== "83e4e21631f747069da9a0be3b153a32") {
        try {
          const result = await this.fetchFromNewsAPI(category, country, page);
          if (result.articles?.length > 0) {
            return result;
          }
        } catch (e) { /* silent fail */ }
      }

      // Try GNews second
      if (GNEWS_API_KEY && GNEWS_API_KEY !== "062379a68af3aea550e5dd82fcf479b3") {
        try {
          const result = await this.fetchFromGNews(category, country, page);
          if (result.articles?.length > 0) {
            return result;
          }
        } catch (e) { /* silent fail */ }
      }

      // Try MediaStack last
      if (MEDIASTACK_API_KEY && MEDIASTACK_API_KEY !== "2557e8713c3d622145ab692da933d6d2") {
        try {
          const result = await this.fetchFromMediaStack(category, country, page);
          if (result.articles?.length > 0) {
            return result;
          }
        } catch (e) { /* silent fail */ }
      }

      return { articles: [], totalResults: 0 };
    }, 300000); // 5 minutes cache
  }

  async fetchFromNewsAPI(category, country, page) {
    let url = `https://newsapi.org/v2/top-headlines?country=${country}&pageSize=20&page=${page}&apiKey=${NEWS_API_KEY}`;
    if (category && category !== "general") url += `&category=${category}`;

    const response = await this.api.get(url, { timeout: 5000 });
    const data = response.data;

    if (data.status === "ok" && data.articles) {
      const validArticles = data.articles.filter(a => a.title && a.title !== "[Removed]" && a.url);
      return {
        articles: validArticles.slice(0, 20).map(a => ({
          source: a.source || { id: null, name: a.source?.name || "NewsAPI" },
          author: a.author,
          title: a.title,
          description: a.description || "",
          url: a.url,
          urlToImage: a.urlToImage,
          publishedAt: a.publishedAt,
          content: a.content,
        })),
        totalResults: Math.min(data.totalResults || 0, 100),
      };
    }
    throw new Error("No articles");
  }

  async fetchFromGNews(category, country, page) {
    let url = `https://gnews.io/api/v4/top-headlines?token=${GNEWS_API_KEY}&country=${country}&max=20&page=${page}&lang=en`;
    if (category && category !== "general") url += `&category=${category}`;

    const response = await this.api.get(url, { timeout: 5000 });
    const data = response.data;

    if (data.articles?.length > 0) {
      return {
        articles: data.articles.slice(0, 20).map(a => ({
          source: { id: null, name: a.source?.name || "GNews" },
          author: a.author,
          title: a.title,
          description: a.description || "",
          url: a.url,
          urlToImage: a.image,
          publishedAt: a.publishedAt,
          content: a.content,
        })),
        totalResults: Math.min(data.totalArticles || 0, 100),
      };
    }
    throw new Error("No articles");
  }

  async fetchFromMediaStack(category, country, page) {
    let url = `http://api.mediastack.com/v1/news?access_key=${MEDIASTACK_API_KEY}&countries=${country}&limit=20&offset=${(page-1)*20}&sort=published_desc`;
    if (category && category !== "general") url += `&categories=${category}`;

    const response = await this.api.get(url, { timeout: 5000 });
    const data = response.data;

    if (data.data?.length > 0) {
      return {
        articles: data.data.slice(0, 20).map(a => ({
          source: { id: null, name: a.source || "MediaStack" },
          author: a.author,
          title: a.title,
          description: a.description || "",
          url: a.url,
          urlToImage: a.image,
          publishedAt: a.published_at,
          content: a.content,
        })),
        totalResults: Math.min(data.pagination?.total || 0, 100),
      };
    }
    throw new Error("No articles");
  }

  async searchNews(query, page = 1) {
    if (!query?.trim()) return { articles: [], totalResults: 0 };
    
    const cacheKey = `search_${query}_${page}`;
    
    return cacheManager.get(cacheKey, async () => {
      if (GNEWS_API_KEY) {
        try {
          const url = `https://gnews.io/api/v4/search?token=${GNEWS_API_KEY}&q=${encodeURIComponent(query)}&max=20&page=${page}&lang=en`;
          const response = await this.api.get(url, { timeout: 5000 });
          if (response.data.articles?.length > 0) {
            return {
              articles: response.data.articles.slice(0, 20).map(a => ({
                source: { id: null, name: a.source?.name || "GNews" },
                author: a.author,
                title: a.title,
                description: a.description || "",
                url: a.url,
                urlToImage: a.image,
                publishedAt: a.publishedAt,
                content: a.content,
              })),
              totalResults: Math.min(response.data.totalArticles || 0, 100),
            };
          }
        } catch (e) { /* silent fail */ }
      }

      if (NEWS_API_KEY) {
        try {
          const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=20&page=${page}&apiKey=${NEWS_API_KEY}`;
          const response = await this.api.get(url, { timeout: 5000 });
          if (response.data.status === "ok" && response.data.articles?.length > 0) {
            return {
              articles: response.data.articles.filter(a => a.title && a.title !== "[Removed]").slice(0, 20).map(a => ({
                source: a.source || { id: null, name: a.source?.name || "NewsAPI" },
                author: a.author,
                title: a.title,
                description: a.description || "",
                url: a.url,
                urlToImage: a.urlToImage,
                publishedAt: a.publishedAt,
                content: a.content,
              })),
              totalResults: Math.min(response.data.totalResults || 0, 100),
            };
          }
        } catch (e) { /* silent fail */ }
      }

      return { articles: [], totalResults: 0 };
    }, 300000);
  }

  async fetchTrending(page = 1) {
    const cacheKey = `trending_${page}`;
    
    return cacheManager.get(cacheKey, async () => {
      const categories = ["technology", "business", "entertainment", "sports"];
      // Parallel requests for faster loading
      const promises = categories.map(cat => this.fetchTopHeadlines(cat, "us", page));
      const results = await Promise.all(promises);
      const allArticles = results.flatMap(result => result.articles || []);
      
      const unique = [];
      const seen = new Set();
      for (const article of allArticles) {
        if (article.url && !seen.has(article.url)) {
          seen.add(article.url);
          unique.push(article);
        }
      }
      
      return unique.slice(0, 30);
    }, 300000);
  }

  // Preload popular categories for faster home page
  async preloadHomePage() {
    const categories = ["general", "technology", "business", "sports", "entertainment"];
    await Promise.all(categories.map(cat => this.fetchTopHeadlines(cat, "us", 1)));
  }
}

export const newsService = new NewsService();

// Preload data on service initialization
if (typeof window !== 'undefined') {
  setTimeout(() => {
    newsService.preloadHomePage();
  }, 100);
}