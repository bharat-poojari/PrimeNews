// src/services/api.js
import axios from "axios";

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const GNEWS_API_KEY = import.meta.env.VITE_GNEWS_API_KEY;
const MEDIASTACK_API_KEY = import.meta.env.VITE_MEDIASTACK_API_KEY;

// Check if running on Vercel
const isVercel = typeof window !== 'undefined' && window.location?.hostname !== 'localhost';

class NewsService {
  constructor() {
    this.api = axios.create({
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async fetchTopHeadlines(category = "general", country = "us", page = 1) {
    try {
      let url;
      
      if (isVercel) {
        // Use serverless function on Vercel
        url = `/api/news?endpoint=top-headlines&category=${category}&country=${country}&page=${page}`;
        const response = await this.api.get(url);
        return response.data;
      } else {
        // Direct API calls in development
        return await this.fetchDirectFromAPI(category, country, page);
      }
    } catch (error) {
      console.error("API error:", error.message);
      return { articles: [], totalResults: 0 };
    }
  }

  async fetchDirectFromAPI(category, country, page) {
    // Try GNews first
    if (GNEWS_API_KEY && GNEWS_API_KEY !== "062379a68af3aea550e5dd82fcf479b3") {
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
    if (NEWS_API_KEY && NEWS_API_KEY !== "53c492dd61354d19acbbee61aaba9de7") {
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
      
      if (isVercel) {
        url = `/api/news?endpoint=search&q=${encodeURIComponent(query)}&page=${page}`;
        const response = await this.api.get(url);
        return response.data;
      } else {
        return await this.searchDirectFromAPI(query, page);
      }
    } catch (error) {
      console.error("Search error:", error.message);
      return { articles: [], totalResults: 0 };
    }
  }

  async searchDirectFromAPI(query, page) {
    if (GNEWS_API_KEY && GNEWS_API_KEY !== "062379a68af3aea550e5dd82fcf479b3") {
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
    try {
      const promises = categories.map(cat => this.fetchTopHeadlines(cat, "us", page));
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
      
      return uniqueArticles.slice(0, 30);
    } catch (error) {
      console.error("Failed to fetch trending:", error);
      return [];
    }
  }
}

export const newsService = new NewsService();