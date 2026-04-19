// PrimeNews/src/services/api.js
import axios from "axios";

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;

class NewsService {
  constructor() {
    this.api = axios.create({
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  async fetchTopHeadlines(category = "general", country = "us", page = 1) {
    try {
      // Use NewsAPI directly
      let url = `https://newsapi.org/v2/top-headlines?country=${country}&pageSize=30&page=${page}&apiKey=${NEWS_API_KEY}`;
      
      if (category && category !== 'general') {
        url += `&category=${category}`;
      }
      
      const response = await this.api.get(url);
      const data = response.data;
      
      if (data.status === 'ok') {
        return {
          articles: data.articles || [],
          totalResults: data.totalResults || 0
        };
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

    try {
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=30&page=${page}&sortBy=publishedAt&language=en&apiKey=${NEWS_API_KEY}`;
      const response = await this.api.get(url);
      const data = response.data;
      
      if (data.status === 'ok') {
        return {
          articles: data.articles || [],
          totalResults: data.totalResults || 0
        };
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

  async fetchVideos(query = "news", page = 1) {
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