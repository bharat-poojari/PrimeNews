// src/services/api.js
import axios from "axios";
import { sampleNews } from "../data/sampleNews";

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const GNEWS_API_KEY = import.meta.env.VITE_GNEWS_API_KEY;
const MEDIASTACK_API_KEY = import.meta.env.VITE_MEDIASTACK_API_KEY;

// Check if we have any working API keys
const hasWorkingApiKey = NEWS_API_KEY || GNEWS_API_KEY || MEDIASTACK_API_KEY;

class NewsService {
  constructor() {
    this.api = axios.create({
      timeout: 10000,
    });
    this.useLocalData = !hasWorkingApiKey;
  }

  async fetchTopHeadlines(category = "general", country = "us", page = 1) {
    // Use local data if no API keys or if we prefer local for now
    if (this.useLocalData) {
      return this.getLocalNews(category);
    }

    // Try real APIs
    if (NEWS_API_KEY) {
      try {
        const result = await this.fetchFromNewsAPI(category, country, page);
        if (result.articles?.length > 0) return result;
      } catch (e) {}
    }

    if (GNEWS_API_KEY) {
      try {
        const result = await this.fetchFromGNews(category, country, page);
        if (result.articles?.length > 0) return result;
      } catch (e) {}
    }

    if (MEDIASTACK_API_KEY) {
      try {
        const result = await this.fetchFromMediaStack(category, country, page);
        if (result.articles?.length > 0) return result;
      } catch (e) {}
    }

    // Fallback to local data if all APIs fail
    return this.getLocalNews(category);
  }

  getLocalNews(category) {
    if (category === "general") {
      const allNews = Object.values(sampleNews).flat();
      return {
        articles: allNews.sort(() => Math.random() - 0.5),
        totalResults: allNews.length,
      };
    }
    
    const articles = sampleNews[category] || sampleNews.general;
    return {
      articles: articles,
      totalResults: articles.length,
    };
  }

  async searchVideoNews(query, page = 1) {
  if (!query || query.trim() === "") {
    return { articles: [], totalResults: 0 };
  }

  try {
    // Search for news with video keywords
    const videoQueries = [
      `${query} video`,
      `${query} footage`,
      `${query} interview`,
      `${query} highlights`,
      `${query} press conference`
    ];
    
    const randomQuery = videoQueries[Math.floor(Math.random() * videoQueries.length)];
    
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(randomQuery)}&pageSize=30&page=${page}&sortBy=publishedAt&language=en&apiKey=${NEWS_API_KEY}`;
    const response = await this.api.get(url);
    const data = response.data;

    if (data.status === "ok" && data.articles) {
      const validArticles = data.articles.filter(
        article => article.title && article.title !== "[Removed]" && article.url
      );
      
      return {
        articles: validArticles.map(article => ({
          source: article.source || { id: null, name: article.source?.name || "NewsAPI" },
          author: article.author,
          title: article.title,
          description: article.description || "Watch the video for full coverage",
          url: article.url,
          urlToImage: article.urlToImage,
          publishedAt: article.publishedAt,
          content: article.content,
        })),
        totalResults: data.totalResults || 0,
      };
    }
  } catch (error) {
    console.error("Video search error:", error.message);
  }

  return { articles: [], totalResults: 0 };
}

  async fetchFromNewsAPI(category, country, page) {
    let url = `https://newsapi.org/v2/top-headlines?country=${country}&pageSize=30&page=${page}&apiKey=${NEWS_API_KEY}`;
    if (category && category !== "general") url += `&category=${category}`;

    const response = await this.api.get(url);
    const data = response.data;

    if (data.status === "ok" && data.articles) {
      const validArticles = data.articles.filter(a => a.title && a.title !== "[Removed]" && a.url);
      return {
        articles: validArticles.map(a => ({
          source: a.source || { id: null, name: "NewsAPI" },
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
    throw new Error("No articles");
  }

  async fetchFromGNews(category, country, page) {
    let url = `https://gnews.io/api/v4/top-headlines?token=${GNEWS_API_KEY}&country=${country}&max=30&page=${page}&lang=en`;
    if (category && category !== "general") url += `&category=${category}`;

    const response = await this.api.get(url);
    const data = response.data;

    if (data.articles?.length > 0) {
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
    throw new Error("No articles");
  }

  async fetchFromMediaStack(category, country, page) {
    let url = `http://api.mediastack.com/v1/news?access_key=${MEDIASTACK_API_KEY}&countries=${country}&limit=30&offset=${(page-1)*30}&sort=published_desc`;
    if (category && category !== "general") url += `&categories=${category}`;

    const response = await this.api.get(url);
    const data = response.data;

    if (data.data?.length > 0) {
      return {
        articles: data.data.map(a => ({
          source: { id: null, name: a.source || "MediaStack" },
          author: a.author,
          title: a.title,
          description: a.description || "",
          url: a.url,
          urlToImage: a.image,
          publishedAt: a.published_at,
          content: a.content,
        })),
        totalResults: data.pagination?.total || 0,
      };
    }
    throw new Error("No articles");
  }

 async searchNews(query, page = 1) {
  if (!query || query.trim() === "") {
    return { articles: [], totalResults: 0 };
  }

  try {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=30&page=${page}&sortBy=publishedAt&language=en&apiKey=${NEWS_API_KEY}`;
    const response = await this.api.get(url);
    const data = response.data;

    if (data.status === "ok" && data.articles) {
      const validArticles = data.articles.filter(
        article => article.title && article.title !== "[Removed]" && article.url
      );
      
      return {
        articles: validArticles.map(article => ({
          source: article.source || { id: null, name: article.source?.name || "NewsAPI" },
          author: article.author,
          title: article.title,
          description: article.description || "Click to read the full article",
          url: article.url,
          urlToImage: article.urlToImage,
          publishedAt: article.publishedAt,
          content: article.content,
        })),
        totalResults: data.totalResults || 0,
      };
    }
  } catch (error) {
    console.error("Search error:", error.message);
  }

  return { articles: [], totalResults: 0 };
}

  async fetchTrending(page = 1) {
    if (this.useLocalData) {
      const allArticles = Object.values(sampleNews).flat();
      return allArticles.slice(0, 30);
    }

    const categories = ["technology", "business", "entertainment", "sports"];
    const allArticles = [];
    
    for (const cat of categories) {
      try {
        const result = await this.fetchTopHeadlines(cat, "us", page);
        allArticles.push(...(result.articles || []));
      } catch (e) {}
    }
    
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