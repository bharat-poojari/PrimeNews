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
      // Call our serverless function instead of direct API
      const response = await this.api.get('/api/news', {
        params: {
          endpoint: 'top-headlines',
          category,
          country,
          page,
        },
      });
      
      const data = response.data;
      if (data.articles && data.articles.length > 0) {
        console.log(`✓ API returned ${data.articles.length} articles`);
        return data;
      }
      
      return { articles: [], totalResults: 0 };
    } catch (error) {
      console.error('API error:', error.message);
      return { articles: [], totalResults: 0 };
    }
  }

  async searchNews(query, page = 1) {
    if (!query || query.trim() === '') {
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