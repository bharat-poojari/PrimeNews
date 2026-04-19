// src/services/api.js
import axios from "axios";

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const GNEWS_API_KEY = import.meta.env.VITE_GNEWS_API_KEY;
const MEDIASTACK_API_KEY = import.meta.env.VITE_MEDIASTACK_API_KEY;

console.log("API Keys status on Vercel:", {
  newsapi: NEWS_API_KEY ? "✓ Configured" : "✗ Missing",
  gnews: GNEWS_API_KEY ? "✓ Configured" : "✗ Missing",
  mediastack: MEDIASTACK_API_KEY ? "✓ Configured" : "✗ Missing"
});

class NewsService {
  constructor() {
    this.api = axios.create({
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async fetchTopHeadlines(category = "general", country = "us", page = 1) {
    // Try NewsAPI first
    if (NEWS_API_KEY) {
      try {
        const result = await this.fetchFromNewsAPI(category, country, page);
        if (result.articles && result.articles.length > 0) {
          console.log(`✓ NewsAPI returned ${result.articles.length} articles`);
          return result;
        }
      } catch (error) {
        console.error("NewsAPI error:", error.message);
      }
    }

    // Try GNews second
    if (GNEWS_API_KEY) {
      try {
        const result = await this.fetchFromGNews(category, country, page);
        if (result.articles && result.articles.length > 0) {
          console.log(`✓ GNews returned ${result.articles.length} articles`);
          return result;
        }
      } catch (error) {
        console.error("GNews error:", error.message);
      }
    }

    // Try MediaStack third
    if (MEDIASTACK_API_KEY) {
      try {
        const result = await this.fetchFromMediaStack(category, country, page);
        if (result.articles && result.articles.length > 0) {
          console.log(`✓ MediaStack returned ${result.articles.length} articles`);
          return result;
        }
      } catch (error) {
        console.error("MediaStack error:", error.message);
      }
    }

    console.error("All APIs failed. No news available.");
    return { articles: [], totalResults: 0 };
  }

  async fetchFromNewsAPI(category, country, page) {
    let url = `https://newsapi.org/v2/top-headlines?country=${country}&pageSize=20&page=${page}&apiKey=${NEWS_API_KEY}`;
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
    throw new Error("No articles from NewsAPI");
  }

  async fetchFromGNews(category, country, page) {
    let url = `https://gnews.io/api/v4/top-headlines?token=${GNEWS_API_KEY}&country=${country}&max=20&page=${page}&lang=en`;
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
    throw new Error("No articles from GNews");
  }

  async fetchFromMediaStack(category, country, page) {
    let url = `http://api.mediastack.com/v1/news?access_key=${MEDIASTACK_API_KEY}&countries=${country}&limit=20&offset=${(page-1)*20}&sort=published_desc`;
    if (category && category !== "general") {
      url += `&categories=${category}`;
    }

    const response = await this.api.get(url);
    const data = response.data;

    if (data.data && data.data.length > 0) {
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
    throw new Error("No articles from MediaStack");
  }

  async searchNews(query, page = 1) {
    if (!query?.trim()) return { articles: [], totalResults: 0 };

    if (NEWS_API_KEY) {
      try {
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=20&page=${page}&apiKey=${NEWS_API_KEY}`;
        const response = await this.api.get(url);
        if (response.data.status === "ok" && response.data.articles) {
          return {
            articles: response.data.articles.filter(a => a.title && a.title !== "[Removed]").map(a => ({
              source: a.source || { id: null, name: a.source?.name || "NewsAPI" },
              author: a.author,
              title: a.title,
              description: a.description || "",
              url: a.url,
              urlToImage: a.urlToImage,
              publishedAt: a.publishedAt,
              content: a.content,
            })),
            totalResults: response.data.totalResults || 0,
          };
        }
      } catch (e) {}
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