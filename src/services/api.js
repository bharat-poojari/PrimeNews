// PrimeNews/src/services/api.js
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

  async fetchTopHeadlines(category = "general", country = "us", page = 1) {
    // Try NewsAPI first
    if (NEWS_API_KEY && NEWS_API_KEY !== "83e4e21631f747069da9a0be3b153a32") {
      try {
        let url = `https://newsapi.org/v2/top-headlines?country=${country}&pageSize=30&page=${page}&apiKey=${NEWS_API_KEY}`;
        if (category && category !== "general" && category !== "undefined") {
          url += `&category=${category}`;
        }
        
        const response = await this.api.get(url);
        if (response.data.articles && response.data.articles.length > 0) {
          return {
            articles: response.data.articles,
            totalResults: response.data.totalResults || 0,
          };
        }
      } catch (error) {
        console.error("NewsAPI error:", error.message);
      }
    }

    // Fallback to GNews
    if (GNEWS_API_KEY && GNEWS_API_KEY !== "062379a68af3aea550e5dd82fcf479b3") {
      try {
        let url = `https://gnews.io/api/v4/top-headlines?token=${GNEWS_API_KEY}&country=${country}&max=30&page=${page}&lang=en`;
        if (category && category !== "general" && category !== "undefined") {
          url += `&category=${category}`;
        }
        
        const response = await this.api.get(url);
        if (response.data.articles && response.data.articles.length > 0) {
          return {
            articles: response.data.articles.map(article => ({
              source: { id: null, name: article.source?.name || "GNews" },
              author: article.author,
              title: article.title,
              description: article.description,
              url: article.url,
              urlToImage: article.image,
              publishedAt: article.publishedAt,
              content: article.content,
            })),
            totalResults: response.data.totalArticles || 0,
          };
        }
      } catch (error) {
        console.error("GNews error:", error.message);
      }
    }

    // Final fallback to MediaStack
    if (MEDIASTACK_API_KEY && MEDIASTACK_API_KEY !== "2557e8713c3d622145ab692da933d6d2") {
      try {
        let url = `http://api.mediastack.com/v1/news?access_key=${MEDIASTACK_API_KEY}&countries=${country}&limit=30&offset=${(page - 1) * 30}&languages=en`;
        if (category && category !== "general" && category !== "undefined") {
          url += `&categories=${category}`;
        }
        
        const response = await this.api.get(url);
        if (response.data.data && response.data.data.length > 0) {
          return {
            articles: response.data.data.map(article => ({
              source: { id: null, name: article.source },
              author: null,
              title: article.title,
              description: article.description,
              url: article.url,
              urlToImage: article.image || null,
              publishedAt: article.published_at,
              content: article.content,
            })),
            totalResults: response.data.total || 0,
          };
        }
      } catch (error) {
        console.error("MediaStack error:", error.message);
      }
    }

    // Return empty if all APIs fail
    return { articles: [], totalResults: 0 };
  }

  async searchNews(query, page = 1) {
    if (!query || query.trim() === "") {
      return { articles: [], totalResults: 0 };
    }

    // Try NewsAPI first
    if (NEWS_API_KEY && NEWS_API_KEY !== "83e4e21631f747069da9a0be3b153a32") {
      try {
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=30&page=${page}&sortBy=publishedAt&language=en&apiKey=${NEWS_API_KEY}`;
        const response = await this.api.get(url);
        if (response.data.articles && response.data.articles.length > 0) {
          return {
            articles: response.data.articles,
            totalResults: response.data.totalResults || 0,
          };
        }
      } catch (error) {
        console.error("NewsAPI search error:", error.message);
      }
    }

    // Fallback to GNews
    if (GNEWS_API_KEY && GNEWS_API_KEY !== "062379a68af3aea550e5dd82fcf479b3") {
      try {
        const url = `https://gnews.io/api/v4/search?token=${GNEWS_API_KEY}&q=${encodeURIComponent(query)}&max=30&page=${page}&lang=en&sortby=publishedAt`;
        const response = await this.api.get(url);
        if (response.data.articles && response.data.articles.length > 0) {
          return {
            articles: response.data.articles.map(article => ({
              source: { id: null, name: article.source?.name || "GNews" },
              author: article.author,
              title: article.title,
              description: article.description,
              url: article.url,
              urlToImage: article.image,
              publishedAt: article.publishedAt,
              content: article.content,
            })),
            totalResults: response.data.totalArticles || 0,
          };
        }
      } catch (error) {
        console.error("GNews search error:", error.message);
      }
    }

    return { articles: [], totalResults: 0 };
  }

  async fetchTrending(page = 1) {
    const categories = ["technology", "business", "entertainment", "sports"];
    try {
      const promises = categories.map(category => 
        this.fetchTopHeadlines(category, "us", page)
      );
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
}

export const newsService = new NewsService();