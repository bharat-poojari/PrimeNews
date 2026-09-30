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
      const response = await this.api.get("/api/news", {
        params: { endpoint: "top-headlines", category, country, page },
      });
      if (response.data.articles?.length) return response.data;
    } catch (error) {
      console.error(`API error for ${category}:`, error.message);
    }
    console.info(`Using sample data for ${category}`);
    return this.getSampleNews(category);
  }

  getSampleNews(category) {
    const sampleData = {
      general: [
        {
          source: { name: "Global News Network" },
          title: "Global Leaders Summit: World Leaders Gather for Climate Action",
          description: "World leaders convene to discuss urgent climate measures and sustainable development goals.",
          url: "#",
          urlToImage: "https://picsum.photos/id/104/800/500",
          publishedAt: new Date().toISOString(),
          content: "Global leaders from over 100 countries have gathered for the annual climate summit..."
        },
        {
          source: { name: "Tech Daily" },
          title: "Breakthrough in Quantum Computing Announced",
          description: "Scientists achieve major milestone in quantum computing technology.",
          url: "#",
          urlToImage: "https://picsum.photos/id/0/800/500",
          publishedAt: new Date().toISOString(),
          content: "Researchers have successfully developed a new quantum processor..."
        }
      ],
      technology: [
        {
          source: { name: "Tech Insider" },
          title: "AI Revolution: New Breakthrough in Machine Learning",
          description: "Latest advancements in artificial intelligence are reshaping industries worldwide.",
          url: "#",
          urlToImage: "https://picsum.photos/id/0/800/500",
          publishedAt: new Date().toISOString(),
          content: "The field of artificial intelligence continues to advance at an unprecedented pace..."
        }
      ],
      business: [
        {
          source: { name: "Financial Times" },
          title: "Global Markets Show Strong Recovery Signs",
          description: "Economic indicators point to robust growth across major economies.",
          url: "#",
          urlToImage: "https://picsum.photos/id/20/800/500",
          publishedAt: new Date().toISOString(),
          content: "Stock markets around the world have shown remarkable resilience..."
        }
      ],
      sports: [
        {
          source: { name: "Sports Network" },
          title: "Historic Victory: Underdogs Claim Championship Title",
          description: "In an unexpected turn, the underdog team secures victory in final match.",
          url: "#",
          urlToImage: "https://picsum.photos/id/145/800/500",
          publishedAt: new Date().toISOString(),
          content: "The championship final delivered one of the most exciting matches in recent history..."
        }
      ],
      entertainment: [
        {
          source: { name: "Hollywood Reporter" },
          title: "Summer Blockbusters Shatter Box Office Records",
          description: "Multiple films break records in historic summer movie season.",
          url: "#",
          urlToImage: "https://picsum.photos/id/106/800/500",
          publishedAt: new Date().toISOString(),
          content: "The entertainment industry is celebrating a record-breaking summer..."
        }
      ],
      science: [
        {
          source: { name: "Science Daily" },
          title: "NASA Announces New Mars Discovery",
          description: "Perseverance rover finds compelling evidence of ancient microbial life.",
          url: "#",
          urlToImage: "https://picsum.photos/id/96/800/500",
          publishedAt: new Date().toISOString(),
          content: "NASA's Perseverance rover has made a groundbreaking discovery on Mars..."
        }
      ],
      health: [
        {
          source: { name: "Health Weekly" },
          title: "New Vaccine Shows Promise Against Multiple Strains",
          description: "Revolutionary vaccine technology could change disease prevention.",
          url: "#",
          urlToImage: "https://picsum.photos/id/116/800/500",
          publishedAt: new Date().toISOString(),
          content: "Medical researchers have announced a breakthrough in vaccine development..."
        }
      ]
    };

    const articles = sampleData[category] || sampleData.general;
    // Generate multiple articles by varying the sample
    const generated = [];
    for (let i = 0; i < 12; i++) {
      const base = articles[i % articles.length];
      generated.push({
        ...base,
        title: `${base.title} - ${i + 1}`,
        publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
        url: `#${i}`,
      });
    }
    
    return { articles: generated, totalResults: generated.length };
  }

  async searchNews(query, page = 1) {
    if (!query || query.trim() === "") {
      return { articles: [], totalResults: 0 };
    }

    try {
      const response = await this.api.get("/api/news", {
        params: { endpoint: "search", q: query, page },
      });
      if (response.data.articles?.length) return response.data;
    } catch (error) {
      console.error("Search error:", error.message);
    }
    return this.getSampleSearchResults(query);
  }

  getSampleSearchResults(query) {
    const results = [];
    for (let i = 0; i < 8; i++) {
      results.push({
        source: { name: "News Source" },
        title: `${query} - Latest News Update ${i + 1}`,
        description: `Latest developments and breaking news about ${query}. Stay informed with our comprehensive coverage.`,
        url: "#",
        urlToImage: `https://picsum.photos/id/${(i * 20) % 100}/800/500`,
        publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
        content: `Full coverage of ${query} news and updates...`,
      });
    }
    return { articles: results, totalResults: results.length };
  }

  async fetchTrending(page = 1) {
    const categories = ["technology", "business", "entertainment", "sports", "science", "health"];
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
      return this.getSampleNews("general").articles.slice(0, 12);
    }
  }
}

export const newsService = new NewsService();