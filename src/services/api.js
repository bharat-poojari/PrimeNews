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
      // Use the Vercel serverless function as proxy
      const response = await this.api.get('/api/news', {
        params: {
          endpoint: 'top-headlines',
          category,
          country,
          page
        }
      });
      
      if (response.data && response.data.articles) {
        console.log(`Fetched ${response.data.articles.length} articles for ${category}`);
        return response.data;
      }
      
      return { articles: [], totalResults: 0 };
    } catch (error) {
      console.error(`API error for ${category}:`, error.message);
      return this.getLocalSampleNews(category);
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
          page
        }
      });
      
      if (response.data && response.data.articles) {
        return response.data;
      }
      
      return { articles: [], totalResults: 0 };
    } catch (error) {
      console.error("Search error:", error.message);
      return this.getLocalSampleSearchResults(query);
    }
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
      return this.getLocalSampleNews("general").slice(0, 12);
    }
  }

  getLocalSampleNews(category) {
    const sampleData = {
      general: [
        {
          source: { name: "Global News Network" },
          title: "World Leaders Gather for Historic Climate Summit",
          description: "Global cooperation takes center stage as nations commit to ambitious environmental goals.",
          url: "#",
          urlToImage: "https://picsum.photos/id/104/800/500",
          publishedAt: new Date().toISOString(),
          content: "In a landmark event, world leaders have come together..."
        },
        {
          source: { name: "Tech Daily" },
          title: "Revolutionary AI Breakthrough Announced",
          description: "New artificial intelligence system achieves human-like reasoning capabilities.",
          url: "#",
          urlToImage: "https://picsum.photos/id/0/800/500",
          publishedAt: new Date().toISOString(),
          content: "Scientists have developed a groundbreaking AI system..."
        },
        {
          source: { name: "Health Weekly" },
          title: "Medical Miracle: New Treatment Shows Promise",
          description: "Breakthrough therapy offers hope for millions worldwide.",
          url: "#",
          urlToImage: "https://picsum.photos/id/116/800/500",
          publishedAt: new Date().toISOString(),
          content: "A revolutionary new treatment is changing the landscape..."
        }
      ],
      technology: [
        {
          source: { name: "Tech Insider" },
          title: "Next-Gen Smartphones Redefine Mobile Experience",
          description: "Latest devices push boundaries with innovative features.",
          url: "#",
          urlToImage: "https://picsum.photos/id/0/800/500",
          publishedAt: new Date().toISOString(),
          content: "The latest generation of smartphones brings unprecedented capabilities..."
        }
      ],
      business: [
        {
          source: { name: "Financial Times" },
          title: "Global Economy Shows Strong Recovery Signs",
          description: "Markets respond positively to improving economic indicators.",
          url: "#",
          urlToImage: "https://picsum.photos/id/20/800/500",
          publishedAt: new Date().toISOString(),
          content: "Economic data points to robust recovery across major sectors..."
        }
      ],
      sports: [
        {
          source: { name: "Sports Network" },
          title: "Underdog Team Makes Historic Championship Run",
          description: "Cinderella story captivates sports world in dramatic fashion.",
          url: "#",
          urlToImage: "https://picsum.photos/id/145/800/500",
          publishedAt: new Date().toISOString(),
          content: "In an unprecedented turn of events, the underdog team has advanced..."
        }
      ],
      entertainment: [
        {
          source: { name: "Hollywood Reporter" },
          title: "Blockbuster Season Breaks All Records",
          description: "Summer movies generate unprecedented box office revenue.",
          url: "#",
          urlToImage: "https://picsum.photos/id/106/800/500",
          publishedAt: new Date().toISOString(),
          content: "The entertainment industry is celebrating historic achievements..."
        }
      ],
      science: [
        {
          source: { name: "Science Daily" },
          title: "Mars Mission Makes Groundbreaking Discovery",
          description: "Evidence of ancient microbial life found on Red Planet.",
          url: "#",
          urlToImage: "https://picsum.photos/id/96/800/500",
          publishedAt: new Date().toISOString(),
          content: "NASA's Perseverance rover has made a historic discovery..."
        }
      ],
      health: [
        {
          source: { name: "Health Weekly" },
          title: "Breakthrough Vaccine Offers Universal Protection",
          description: "New vaccine technology shows promise against multiple diseases.",
          url: "#",
          urlToImage: "https://picsum.photos/id/116/800/500",
          publishedAt: new Date().toISOString(),
          content: "Medical researchers have announced a major breakthrough..."
        }
      ]
    };

    const baseArticles = sampleData[category] || sampleData.general;
    const articles = [];
    
    for (let i = 0; i < 12; i++) {
      const base = baseArticles[i % baseArticles.length];
      articles.push({
        ...base,
        title: `${base.title}${i > 0 ? ` - Edition ${i + 1}` : ''}`,
        publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
        url: `#${i}`,
      });
    }
    
    return articles;
  }

  getLocalSampleSearchResults(query) {
    const results = [];
    for (let i = 0; i < 8; i++) {
      results.push({
        source: { name: "News Network" },
        title: `${query} - Latest Updates and Analysis ${i + 1}`,
        description: `Comprehensive coverage of ${query} including expert analysis and breaking developments.`,
        url: `#search-${i}`,
        urlToImage: `https://picsum.photos/id/${(i * 20) % 100}/800/500`,
        publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
        content: `Detailed coverage of ${query} news and updates...`,
      });
    }
    return results;
  }
}

export const newsService = new NewsService();