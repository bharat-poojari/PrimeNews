// src/services/api.js
import axios from "axios";

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const GNEWS_API_KEY = import.meta.env.VITE_GNEWS_API_KEY;
const MEDIASTACK_API_KEY = import.meta.env.VITE_MEDIASTACK_API_KEY;

console.log("API Keys status:", {
  newsapi: NEWS_API_KEY ? "✓ Configured" : "✗ Missing",
  gnews: GNEWS_API_KEY ? "✓ Configured" : "✗ Missing",
  mediastack: MEDIASTACK_API_KEY ? "✓ Configured" : "✗ Missing"
});

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
    console.log(`Fetching ${category} news...`);
    
    // Try GNews first (most reliable)
    if (GNEWS_API_KEY && GNEWS_API_KEY !== "062379a68af3aea550e5dd82fcf479b3") {
      try {
        let url = `https://gnews.io/api/v4/top-headlines?token=${GNEWS_API_KEY}&country=${country}&max=30&page=${page}&lang=en`;
        if (category && category !== "general") {
          url += `&category=${category}`;
        }
        
        console.log("Calling GNews API...");
        const response = await this.api.get(url);
        const data = response.data;
        
        if (data.articles && data.articles.length > 0) {
          console.log(`✓ GNews returned ${data.articles.length} articles`);
          return {
            articles: data.articles.map(article => ({
              source: { id: null, name: article.source?.name || "GNews" },
              author: article.author,
              title: article.title,
              description: article.description || "",
              url: article.url,
              urlToImage: article.image,
              publishedAt: article.publishedAt,
              content: article.content,
            })),
            totalResults: data.totalArticles || 0,
          };
        }
      } catch (error) {
        console.log("GNews error:", error.message);
      }
    }

    // Try NewsAPI second
    if (NEWS_API_KEY && NEWS_API_KEY !== "53c492dd61354d19acbbee61aaba9de7") {
      try {
        let url = `https://newsapi.org/v2/top-headlines?country=${country}&pageSize=30&page=${page}&apiKey=${NEWS_API_KEY}`;
        if (category && category !== "general") {
          url += `&category=${category}`;
        }
        
        console.log("Calling NewsAPI...");
        const response = await this.api.get(url);
        const data = response.data;
        
        if (data.status === "ok" && data.articles) {
          const validArticles = data.articles.filter(a => a.title && a.title !== "[Removed]" && a.url);
          if (validArticles.length > 0) {
            console.log(`✓ NewsAPI returned ${validArticles.length} articles`);
            return {
              articles: validArticles.map(article => ({
                source: article.source || { id: null, name: article.source?.name || "NewsAPI" },
                author: article.author,
                title: article.title,
                description: article.description || "",
                url: article.url,
                urlToImage: article.urlToImage,
                publishedAt: article.publishedAt,
                content: article.content,
              })),
              totalResults: data.totalResults || 0,
            };
          }
        }
      } catch (error) {
        console.log("NewsAPI error:", error.message);
      }
    }

    // Try MediaStack third
    if (MEDIASTACK_API_KEY && MEDIASTACK_API_KEY !== "2557e8713c3d622145ab692da933d6d2") {
      try {
        let url = `https://api.mediastack.com/v1/news?access_key=${MEDIASTACK_API_KEY}&countries=${country}&limit=30&offset=${(page-1)*30}&sort=published_desc`;
        if (category && category !== "general") {
          url += `&categories=${category}`;
        }
        
        console.log("Calling MediaStack...");
        const response = await this.api.get(url);
        const data = response.data;
        
        if (data.data && data.data.length > 0) {
          console.log(`✓ MediaStack returned ${data.data.length} articles`);
          return {
            articles: data.data.map(article => ({
              source: { id: null, name: article.source || "MediaStack" },
              author: article.author,
              title: article.title,
              description: article.description || "",
              url: article.url,
              urlToImage: article.image,
              publishedAt: article.published_at,
              content: article.content,
            })),
            totalResults: data.pagination?.total || 0,
          };
        }
      } catch (error) {
        console.log("MediaStack error:", error.message);
      }
    }

    console.error("All APIs failed. Please check your API keys.");
    return { articles: [], totalResults: 0 };
  }

  async searchNews(query, page = 1) {
    if (!query || query.trim() === "") {
      return { articles: [], totalResults: 0 };
    }

    console.log(`Searching for: "${query}"`);
    
    // Try GNews search first
    if (GNEWS_API_KEY && GNEWS_API_KEY !== "062379a68af3aea550e5dd82fcf479b3") {
      try {
        const url = `https://gnews.io/api/v4/search?token=${GNEWS_API_KEY}&q=${encodeURIComponent(query)}&max=30&page=${page}&lang=en&sortby=publishedAt`;
        const response = await this.api.get(url);
        const data = response.data;
        
        if (data.articles && data.articles.length > 0) {
          console.log(`✓ GNews search returned ${data.articles.length} results`);
          return {
            articles: data.articles.map(article => ({
              source: { id: null, name: article.source?.name || "GNews" },
              author: article.author,
              title: article.title,
              description: article.description || "",
              url: article.url,
              urlToImage: article.image,
              publishedAt: article.publishedAt,
              content: article.content,
            })),
            totalResults: data.totalArticles || 0,
          };
        }
      } catch (error) {
        console.log("GNews search error:", error.message);
      }
    }

    // Try NewsAPI search
    if (NEWS_API_KEY && NEWS_API_KEY !== "53c492dd61354d19acbbee61aaba9de7") {
      try {
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=30&page=${page}&sortBy=publishedAt&language=en&apiKey=${NEWS_API_KEY}`;
        const response = await this.api.get(url);
        const data = response.data;
        
        if (data.status === "ok" && data.articles) {
          const validArticles = data.articles.filter(a => a.title && a.title !== "[Removed]" && a.url);
          if (validArticles.length > 0) {
            console.log(`✓ NewsAPI search returned ${validArticles.length} results`);
            return {
              articles: validArticles.map(article => ({
                source: article.source || { id: null, name: article.source?.name || "NewsAPI" },
                author: article.author,
                title: article.title,
                description: article.description || "",
                url: article.url,
                urlToImage: article.urlToImage,
                publishedAt: article.publishedAt,
                content: article.content,
              })),
              totalResults: data.totalResults || 0,
            };
          }
        }
      } catch (error) {
        console.log("NewsAPI search error:", error.message);
      }
    }

    return { articles: [], totalResults: 0 };
  }

  async fetchTrending(page = 1) {
    const categories = ["technology", "business", "entertainment", "sports"];
    const allArticles = [];
    
    for (const cat of categories) {
      const result = await this.fetchTopHeadlines(cat, "us", page);
      allArticles.push(...(result.articles || []));
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