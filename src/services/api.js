// src/services/api.js
import axios from "axios";

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const GNEWS_API_KEY = import.meta.env.VITE_GNEWS_API_KEY;
const MEDIASTACK_API_KEY = import.meta.env.VITE_MEDIASTACK_API_KEY;

class NewsService {
  constructor() {
    this.api = axios.create({
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Fetch top headlines using NewsAPI as primary
  async fetchTopHeadlines(category = "general", country = "us", page = 1) {
    try {
      // Try NewsAPI first
      if (NEWS_API_KEY && NEWS_API_KEY !== "83e4e21631f747069da9a0be3b153a32") {
        const response = await this.fetchFromNewsAPI(category, country, page);
        if (response.articles && response.articles.length > 0) {
          console.log(`NewsAPI returned ${response.articles.length} articles`);
          return response;
        }
      }

      // Fallback to GNews
      if (GNEWS_API_KEY && GNEWS_API_KEY !== "062379a68af3aea550e5dd82fcf479b3") {
        const response = await this.fetchFromGNews(category, country, page);
        if (response.articles && response.articles.length > 0) {
          console.log(`GNews returned ${response.articles.length} articles`);
          return response;
        }
      }

      // Fallback to MediaStack
      if (MEDIASTACK_API_KEY && MEDIASTACK_API_KEY !== "2557e8713c3d622145ab692da933d6d2") {
        const response = await this.fetchFromMediaStack(category, country, page);
        if (response.articles && response.articles.length > 0) {
          console.log(`MediaStack returned ${response.articles.length} articles`);
          return response;
        }
      }

      console.warn("No API keys configured or all APIs failed");
      return { articles: [], totalResults: 0 };
    } catch (error) {
      console.error("Failed to fetch news:", error);
      return { articles: [], totalResults: 0 };
    }
  }

  // Fetch from NewsAPI
  async fetchFromNewsAPI(category, country, page) {
    try {
      let url = `https://newsapi.org/v2/top-headlines?country=${country}&pageSize=30&page=${page}&apiKey=${NEWS_API_KEY}`;
      if (category && category !== "general") {
        url += `&category=${category}`;
      }

      const response = await this.api.get(url);
      const data = response.data;

      if (data.status === "ok" && data.articles) {
        return {
          articles: data.articles.filter(a => a.title && a.title !== "[Removed]").map(article => ({
            source: article.source || { id: null, name: "NewsAPI" },
            author: article.author,
            title: article.title,
            description: article.description || "Read the full article for more details.",
            url: article.url,
            urlToImage: article.urlToImage || this.getFallbackImage(category),
            publishedAt: article.publishedAt,
            content: article.content,
          })),
          totalResults: data.totalResults || 0,
        };
      }
      return { articles: [], totalResults: 0 };
    } catch (error) {
      console.error("NewsAPI error:", error.response?.data?.message || error.message);
      return { articles: [], totalResults: 0 };
    }
  }

  // Fetch from GNews
  async fetchFromGNews(category, country, page) {
    try {
      let url = `https://gnews.io/api/v4/top-headlines?token=${GNEWS_API_KEY}&country=${country}&max=30&page=${page}&lang=en`;
      if (category && category !== "general") {
        url += `&category=${category}`;
      }

      const response = await this.api.get(url);
      const data = response.data;

      if (data.articles) {
        return {
          articles: data.articles.map(article => ({
            source: { id: null, name: article.source?.name || "GNews" },
            author: article.author,
            title: article.title,
            description: article.description || "Read the full article for more details.",
            url: article.url,
            urlToImage: article.image || this.getFallbackImage(category),
            publishedAt: article.publishedAt,
            content: article.content,
          })),
          totalResults: data.totalArticles || 0,
        };
      }
      return { articles: [], totalResults: 0 };
    } catch (error) {
      console.error("GNews error:", error.message);
      return { articles: [], totalResults: 0 };
    }
  }

  // Fetch from MediaStack
  async fetchFromMediaStack(category, country, page) {
    try {
      let url = `http://api.mediastack.com/v1/news?access_key=${MEDIASTACK_API_KEY}&countries=${country}&limit=30&offset=${(page - 1) * 30}`;
      if (category && category !== "general") {
        url += `&categories=${category}`;
      }

      const response = await this.api.get(url);
      const data = response.data;

      if (data.data) {
        return {
          articles: data.data.map(article => ({
            source: { id: null, name: article.source || "MediaStack" },
            author: article.author,
            title: article.title,
            description: article.description || "Read the full article for more details.",
            url: article.url,
            urlToImage: article.image || this.getFallbackImage(category),
            publishedAt: article.published_at,
            content: article.content,
          })),
          totalResults: data.pagination?.total || 0,
        };
      }
      return { articles: [], totalResults: 0 };
    } catch (error) {
      console.error("MediaStack error:", error.message);
      return { articles: [], totalResults: 0 };
    }
  }

  // Search news across multiple APIs
  async searchNews(query, page = 1) {
    if (!query || query.trim() === "") {
      return { articles: [], totalResults: 0 };
    }

    try {
      // Try GNews first for search (it has better free tier for search)
      if (GNEWS_API_KEY && GNEWS_API_KEY !== "062379a68af3aea550e5dd82fcf479b3") {
        const url = `https://gnews.io/api/v4/search?token=${GNEWS_API_KEY}&q=${encodeURIComponent(query)}&max=30&page=${page}&lang=en&sortby=publishedAt`;
        const response = await this.api.get(url);
        const data = response.data;

        if (data.articles && data.articles.length > 0) {
          return {
            articles: data.articles.map(article => ({
              source: { id: null, name: article.source?.name || "GNews" },
              author: article.author,
              title: article.title,
              description: article.description || "Read the full article for more details.",
              url: article.url,
              urlToImage: article.image || this.getFallbackImage(),
              publishedAt: article.publishedAt,
              content: article.content,
            })),
            totalResults: data.totalArticles || 0,
          };
        }
      }

      // Fallback to NewsAPI for search
      if (NEWS_API_KEY && NEWS_API_KEY !== "83e4e21631f747069da9a0be3b153a32") {
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=30&page=${page}&sortBy=publishedAt&language=en&apiKey=${NEWS_API_KEY}`;
        const response = await this.api.get(url);
        const data = response.data;

        if (data.status === "ok" && data.articles) {
          return {
            articles: data.articles.filter(a => a.title && a.title !== "[Removed]").map(article => ({
              source: article.source || { id: null, name: "NewsAPI" },
              author: article.author,
              title: article.title,
              description: article.description || "Read the full article for more details.",
              url: article.url,
              urlToImage: article.urlToImage || this.getFallbackImage(),
              publishedAt: article.publishedAt,
              content: article.content,
            })),
            totalResults: data.totalResults || 0,
          };
        }
      }

      return { articles: [], totalResults: 0 };
    } catch (error) {
      console.error("Search error:", error);
      return { articles: [], totalResults: 0 };
    }
  }

  // Fetch trending news (aggregate from multiple categories)
  async fetchTrending(page = 1) {
    const categories = ["technology", "business", "entertainment", "sports"];
    try {
      const promises = categories.map(cat => this.fetchTopHeadlines(cat, "us", page));
      const results = await Promise.all(promises);
      const allArticles = results.flatMap(result => result.articles || []);
      
      // Remove duplicates and limit
      const uniqueArticles = [];
      const seenUrls = new Set();
      for (const article of allArticles) {
        if (article.url && !seenUrls.has(article.url)) {
          seenUrls.add(article.url);
          uniqueArticles.push(article);
        }
      }
      
      return uniqueArticles.slice(0, 30);
    } catch (error) {
      console.error("Failed to fetch trending:", error);
      return [];
    }
  }

  getFallbackImage(category = "general") {
    const images = {
      general: "https://picsum.photos/id/104/800/500",
      technology: "https://picsum.photos/id/0/800/500",
      business: "https://picsum.photos/id/20/800/500",
      sports: "https://picsum.photos/id/145/800/500",
      entertainment: "https://picsum.photos/id/106/800/500",
      science: "https://picsum.photos/id/96/800/500",
      health: "https://picsum.photos/id/116/800/500",
    };
    return images[category] || images.general;
  }
}

export const newsService = new NewsService();