// PrimeNews/src/services/api.js
import axios from "axios";

const GNEWS_API_KEY = import.meta.env.VITE_GNEWS_API_KEY;

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
    try {
      let url = `https://gnews.io/api/v4/top-headlines?token=${GNEWS_API_KEY}&country=${country}&max=30&page=${page}&lang=en`;
      
      if (category && category !== 'general') {
        url += `&category=${category}`;
      }
      
      const response = await this.api.get(url);
      const data = response.data;
      
      if (data.articles) {
        const articles = data.articles.map(article => ({
          source: { id: null, name: article.source?.name || 'GNews' },
          author: article.author,
          title: article.title,
          description: article.description,
          url: article.url,
          urlToImage: article.image,
          publishedAt: article.publishedAt,
          content: article.content
        }));
        
        return {
          articles: articles,
          totalResults: data.totalArticles || 0
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
      const url = `https://gnews.io/api/v4/search?token=${GNEWS_API_KEY}&q=${encodeURIComponent(query)}&max=30&page=${page}&lang=en&sortby=publishedAt`;
      const response = await this.api.get(url);
      const data = response.data;
      
      if (data.articles) {
        const articles = data.articles.map(article => ({
          source: { id: null, name: article.source?.name || 'GNews' },
          author: article.author,
          title: article.title,
          description: article.description,
          url: article.url,
          urlToImage: article.image,
          publishedAt: article.publishedAt,
          content: article.content
        }));
        
        return {
          articles: articles,
          totalResults: data.totalArticles || 0
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
}

export const newsService = new NewsService();