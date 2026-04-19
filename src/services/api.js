// src/services/api.js
import axios from "axios";

class NewsService {
  constructor() {
    this.api = axios.create({
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    // Detect if we're on Vercel or local
    this.isVercel = window.location.hostname !== 'localhost';
  }

  async fetchTopHeadlines(category = "general", country = "us", page = 1) {
    try {
      // Use the serverless function on Vercel, direct API on local
      let url;
      if (this.isVercel) {
        url = `/api/news?endpoint=top-headlines&category=${category}&country=${country}&page=${page}`;
      } else {
        // Local development - use direct API calls
        return this.fetchDirectFromAPI(category, country, page);
      }
      
      const response = await this.api.get(url);
      return response.data;
    } catch (error) {
      console.error("API error:", error.message);
      return { articles: [], totalResults: 0 };
    }
  }

  async fetchDirectFromAPI(category, country, page) {
    const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
    const GNEWS_API_KEY = import.meta.env.VITE_GNEWS_API_KEY;
    
    // Try GNews first
    if (GNEWS_API_KEY) {
      try {
        let url = `https://gnews.io/api/v4/top-headlines?token=${GNEWS_API_KEY}&country=${country}&max=30&page=${page}&lang=en`;
        if (category && category !== "general") {
          url += `&category=${category}`;
        }
        
        const response = await this.api.get(url);
        const data = response.data;
        
        if (data.articles && data.articles.length > 0) {
          return {
            articles: data.articles.map(a => ({
              source: { id: null, name: a.source?.name || "GNews" },
              author: a.author,
              title: a.title,
              description: a.description || "",
              url: a.url,
              urlToImage: a.image,
              publishedAt: a.publishedAt,
              content: a.content,
            })),
            totalResults: data.totalArticles || 0,
          };
        }
      } catch (error) {
        console.log("GNews error:", error.message);
      }
    }

    // Try NewsAPI
    if (NEWS_API_KEY) {
      try {
        let url = `https://newsapi.org/v2/top-headlines?country=${country}&pageSize=30&page=${page}&apiKey=${NEWS_API_KEY}`;
        if (category && category !== "general") {
          url += `&category=${category}`;
        }
        
        const response = await this.api.get(url);
        const data = response.data;
        
        if (data.status === "ok" && data.articles) {
          const validArticles = data.articles.filter(a => a.title && a.title !== "[Removed]" && a.url);
          return {
            articles: validArticles.map(a => ({
              source: a.source || { id: null, name: a.source?.name || "NewsAPI" },
              author: a.author,
              title: a.title,
              description: a.description || "",
              url: a.url,
              urlToImage: a.urlToImage,
              publishedAt: a.publishedAt,
              content: a.content,
            })),
            totalResults: data.totalResults || 0,
          };
        }
      } catch (error) {
        console.log("NewsAPI error:", error.message);
      }
    }
    
    return { articles: [], totalResults: 0 };
  }

  async searchNews(query, page = 1) {
    if (!query || query.trim() === "") {
      return { articles: [], totalResults: 0 };
    }

    try {
      let url;
      if (this.isVercel) {
        url = `/api/news?endpoint=search&q=${encodeURIComponent(query)}&page=${page}`;
      } else {
        return this.searchDirectFromAPI(query, page);
      }
      
      const response = await this.api.get(url);
      return response.data;
    } catch (error) {
      console.error("Search error:", error.message);
      return { articles: [], totalResults: 0 };
    }
  }

  async searchDirectFromAPI(query, page) {
    const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
    const GNEWS_API_KEY = import.meta.env.VITE_GNEWS_API_KEY;
    
    if (GNEWS_API_KEY) {
      try {
        const url = `https://gnews.io/api/v4/search?token=${GNEWS_API_KEY}&q=${encodeURIComponent(query)}&max=30&page=${page}&lang=en`;
        const response = await this.api.get(url);
        const data = response.data;
        
        if (data.articles && data.articles.length > 0) {
          return {
            articles: data.articles.map(a => ({
              source: { id: null, name: a.source?.name || "GNews" },
              author: a.author,
              title: a.title,
              description: a.description || "",
              url: a.url,
              urlToImage: a.image,
              publishedAt: a.publishedAt,
              content: a.content,
            })),
            totalResults: data.totalArticles || 0,
          };
        }
      } catch (error) {}
    }
    
    return { articles: [], totalResults: 0 };
  }

  async fetchTrending(page = 1) {
    const categories = ["technology", "business", "entertainment", "sports"];
    const results = await Promise.all(
      categories.map(cat => this.fetchTopHeadlines(cat, "us", page))
    );
    const allArticles = results.flatMap(r => r.articles || []);
    const unique = [];
    const seen = new Set();
    for (const article of allArticles) {
      if (article.url && !seen.has(article.url)) {
        seen.add(article.url);
        unique.push(article);
      }
    }
    return unique.slice(0, 30);
  }
}

export const newsService = new NewsService();