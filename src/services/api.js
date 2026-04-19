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
  }

  async fetchTopHeadlines(category = "general", country = "us", page = 1) {
    try {
      // Always use the serverless function for consistency
      const response = await this.api.get('/api/news', {
        params: {
          endpoint: 'top-headlines',
          category,
          country,
          page,
        },
      });
      
      if (response.data && response.data.articles) {
        return response.data;
      }
      
      return { articles: [], totalResults: 0 };
    } catch (error) {
      console.error('API error:', error.message);
      return { articles: [], totalResults: 0 };
    }
  }

  async searchNews(query, page = 1) {
    if (!query || query.trim() === "") {
      return { articles: [], totalResults: 0 };
    }

    try {
      const response = await this.api.get('/api/news', {
        params: {
          endpoint: 'search',
          q: query,
          page,
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Search error:', error.message);
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
      
      return uniqueArticles.slice(0, 30);
    } catch (error) {
      console.error("Failed to fetch trending:", error);
      return [];
    }
  }
}

export const newsService = new NewsService();