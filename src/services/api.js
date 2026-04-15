import axios from "axios";
import { cacheService } from "./cache";

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const GNEWS_API_KEY = import.meta.env.VITE_GNEWS_API_KEY;
const MEDIASTACK_API_KEY = import.meta.env.VITE_MEDIASTACK_API_KEY;

class NewsService {
  constructor() {
    this.api = axios.create({
      timeout: 15000,
    });
    this.currentApiIndex = 0;
    this.apis = [
      {
        name: 'NewsAPI',
        enabled: !!NEWS_API_KEY,
        fetchHeadlines: async (category, country, page) => {
          const baseUrl = import.meta.env.DEV ? '/api' : 'https://newsapi.org/v2';
          const response = await this.api.get(`${baseUrl}/top-headlines`, {
            params: {
              country: country,
              category: category !== "general" ? category : undefined,
              page: page,
              pageSize: 30,
              apiKey: NEWS_API_KEY,
            },
          });
          return response.data;
        },
        fetchSearch: async (query, page) => {
          const baseUrl = import.meta.env.DEV ? '/api' : 'https://newsapi.org/v2';
          const response = await this.api.get(`${baseUrl}/everything`, {
            params: {
              q: query,
              pageSize: 30,
              page: page,
              sortBy: "publishedAt",
              apiKey: NEWS_API_KEY,
            },
          });
          return response.data;
        }
      },
      {
        name: 'GNews',
        enabled: !!GNEWS_API_KEY,
        fetchHeadlines: async (category, country, page) => {
          const categoryMap = {
            general: 'general',
            technology: 'technology',
            business: 'business',
            entertainment: 'entertainment',
            sports: 'sports',
            science: 'science',
            health: 'health'
          };
          const response = await this.api.get('https://gnews.io/api/v4/top-headlines', {
            params: {
              token: GNEWS_API_KEY,
              country: country,
              category: categoryMap[category] || 'general',
              lang: 'en',
              max: 30,
              page: page,
            },
          });
          return {
            articles: (response.data.articles || []).map(article => ({
              source: { id: null, name: article.source?.name || 'GNews' },
              author: article.author,
              title: article.title,
              description: article.description,
              url: article.url,
              urlToImage: article.image,
              publishedAt: article.publishedAt,
              content: article.content
            })),
            totalResults: response.data.totalArticles || 0,
            status: 'ok'
          };
        },
        fetchSearch: async (query, page) => {
          const response = await this.api.get('https://gnews.io/api/v4/search', {
            params: {
              token: GNEWS_API_KEY,
              q: query,
              lang: 'en',
              max: 30,
              page: page,
              sortby: 'publishedAt',
            },
          });
          return {
            articles: (response.data.articles || []).map(article => ({
              source: { id: null, name: article.source?.name || 'GNews' },
              author: article.author,
              title: article.title,
              description: article.description,
              url: article.url,
              urlToImage: article.image,
              publishedAt: article.publishedAt,
              content: article.content
            })),
            totalResults: response.data.totalArticles || 0,
            status: 'ok'
          };
        }
      },
      {
        name: 'MediaStack',
        enabled: !!MEDIASTACK_API_KEY,
        fetchHeadlines: async (category, country, page) => {
          const categoryMap = {
            general: 'general',
            technology: 'technology',
            business: 'business',
            entertainment: 'entertainment',
            sports: 'sports',
            science: 'science',
            health: 'health'
          };
          const response = await this.api.get('http://api.mediastack.com/v1/news', {
            params: {
              access_key: MEDIASTACK_API_KEY,
              countries: country,
              categories: categoryMap[category] || 'general',
              languages: 'en',
              limit: 30,
              offset: (page - 1) * 30,
            },
          });
          return {
            articles: (response.data.data || []).map(article => ({
              source: { id: null, name: article.source || 'MediaStack' },
              author: article.author,
              title: article.title,
              description: article.description,
              url: article.url,
              urlToImage: article.image || `https://picsum.photos/id/${Math.floor(Math.random() * 100) + 1}/800/600`,
              publishedAt: article.published_at,
              content: article.content
            })),
            totalResults: response.data.pagination?.total || 0,
            status: 'ok'
          };
        },
        fetchSearch: async (query, page) => {
          const response = await this.api.get('http://api.mediastack.com/v1/news', {
            params: {
              access_key: MEDIASTACK_API_KEY,
              keywords: query,
              languages: 'en',
              limit: 30,
              offset: (page - 1) * 30,
              sort: 'published_desc',
            },
          });
          return {
            articles: (response.data.data || []).map(article => ({
              source: { id: null, name: article.source || 'MediaStack' },
              author: article.author,
              title: article.title,
              description: article.description,
              url: article.url,
              urlToImage: article.image || `https://picsum.photos/id/${Math.floor(Math.random() * 100) + 1}/800/600`,
              publishedAt: article.published_at,
              content: article.content
            })),
            totalResults: response.data.pagination?.total || 0,
            status: 'ok'
          };
        }
      }
    ];
    
    this.enabledApis = this.apis.filter(api => api.enabled);
    
    if (this.enabledApis.length === 0) {
      console.warn('No API keys found. Using mock data only.');
    }
  }

  async fetchWithFallback(method, ...args) {
    if (this.enabledApis.length === 0) {
      return this.getMockData(args[0], args[2]);
    }

    for (let i = 0; i < this.enabledApis.length; i++) {
      const api = this.enabledApis[(this.currentApiIndex + i) % this.enabledApis.length];
      try {
        console.log(`Trying ${api.name} for ${method}...`);
        const result = await api[method](...args);
        
        if (result.articles && result.articles.length > 0) {
          console.log(`Successfully fetched from ${api.name}`);
          this.currentApiIndex = (this.currentApiIndex + i) % this.enabledApis.length;
          return result;
        }
      } catch (error) {
        console.error(`${api.name} failed:`, error.message);
      }
    }
    
    console.log('All APIs failed, using mock data');
    return this.getMockData(args[0], args[2] || 1);
  }

  async fetchTopHeadlines(category = "general", country = "in", page = 1) {
    const cacheKey = `headlines-${category}-${country}-${page}`;
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.fetchWithFallback('fetchHeadlines', category, country, page);
      if (data.articles && data.articles.length > 0) {
        cacheService.set(cacheKey, data, 300);
      }
      return data;
    } catch (error) {
      console.error("All APIs failed:", error);
      return this.getMockData(category, page);
    }
  }

  async searchNews(query, page = 1) {
    if (!query) {
      return { articles: [], totalResults: 0 };
    }

    const cacheKey = `search-${query}-${page}`;
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.fetchWithFallback('fetchSearch', query, page);
      if (data.articles && data.articles.length > 0) {
        cacheService.set(cacheKey, data, 300);
      }
      return data;
    } catch (error) {
      console.error("Search failed:", error);
      return { articles: this.getMockData().articles.slice(0, 30), totalResults: 100 };
    }
  }

  async fetchTrending(page = 1) {
    const categories = ["technology", "business", "entertainment", "sports", "science", "health"];
    const promises = categories.map(cat => this.fetchTopHeadlines(cat, "in", page));
    
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
  }

  getMockData(category = "general", page = 1) {
    const allMockArticles = {
      general: Array(50).fill().map((_, i) => ({
        source: { id: "1", name: "Global News" },
        author: "News Desk",
        title: `Top Story ${i + 1}: Breaking News Update - Major developments in global affairs`,
        description: `This is a comprehensive news story about current events and important developments happening around the world. Story number ${i + 1} brings you the latest updates.`,
        url: `https://example.com/news/${i + 1}`,
        urlToImage: `https://picsum.photos/id/${(i % 100) + 1}/800/600`,
        publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
        content: `Full content of the news story would appear here. This is a detailed report about current events and their impact on global affairs. Story ${i + 1} provides in-depth analysis and expert opinions.`
      })),
      business: Array(50).fill().map((_, i) => ({
        source: { id: "biz", name: "Business Times" },
        author: "Finance Expert",
        title: `Market Update ${i + 1}: Stock markets show volatility amid economic uncertainty`,
        description: `Latest business and financial news covering market trends, corporate earnings, and economic indicators. Update ${i + 1} brings comprehensive coverage.`,
        url: `https://example.com/business/${i + 1}`,
        urlToImage: `https://picsum.photos/id/${(i % 100) + 20}/800/600`,
        publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
        content: `Detailed business analysis and market commentary. This report covers key financial metrics and future projections.`
      })),
      technology: Array(50).fill().map((_, i) => ({
        source: { id: "tech", name: "Tech Daily" },
        author: "Tech Reporter",
        title: `Tech Innovation ${i + 1}: Breakthrough developments in artificial intelligence`,
        description: `Latest technology news covering AI, robotics, software updates, and digital transformation. Story ${i + 1} explores cutting-edge innovations.`,
        url: `https://example.com/tech/${i + 1}`,
        urlToImage: `https://picsum.photos/id/${(i % 100) + 0}/800/600`,
        publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
        content: `In-depth technology coverage and analysis of the latest trends and innovations shaping our digital future.`
      })),
      entertainment: Array(50).fill().map((_, i) => ({
        source: { id: "ent", name: "Entertainment Weekly" },
        author: "Entertainment Editor",
        title: `Entertainment News ${i + 1}: Movie releases and celebrity updates`,
        description: `Latest from Hollywood, Bollywood, and global entertainment industry. Update ${i + 1} brings you exclusive coverage.`,
        url: `https://example.com/entertainment/${i + 1}`,
        urlToImage: `https://picsum.photos/id/${(i % 100) + 106}/800/600`,
        publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
        content: `Comprehensive entertainment coverage including film reviews, celebrity interviews, and industry analysis.`
      })),
      sports: Array(50).fill().map((_, i) => ({
        source: { id: "sports", name: "Sports Central" },
        author: "Sports Analyst",
        title: `Sports Update ${i + 1}: Championship highlights and player performances`,
        description: `Latest sports news covering football, cricket, basketball, tennis, and more. Story ${i + 1} brings match analysis.`,
        url: `https://example.com/sports/${i + 1}`,
        urlToImage: `https://picsum.photos/id/${(i % 100) + 128}/800/600`,
        publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
        content: `Detailed sports coverage with match reports, player statistics, and expert commentary on recent games.`
      })),
      science: Array(50).fill().map((_, i) => ({
        source: { id: "science", name: "Science Today" },
        author: "Science Correspondent",
        title: `Scientific Discovery ${i + 1}: Breakthrough research and space exploration`,
        description: `Latest scientific discoveries, research findings, and technological advancements. Update ${i + 1} covers major breakthroughs.`,
        url: `https://example.com/science/${i + 1}`,
        urlToImage: `https://picsum.photos/id/${(i % 100) + 96}/800/600`,
        publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
        content: `In-depth scientific analysis covering recent discoveries, research papers, and expert insights.`
      })),
      health: Array(50).fill().map((_, i) => ({
        source: { id: "health", name: "Health News" },
        author: "Medical Expert",
        title: `Health Update ${i + 1}: Medical breakthroughs and wellness tips`,
        description: `Latest health news covering medical research, wellness trends, and healthcare policy. Story ${i + 1} brings important updates.`,
        url: `https://example.com/health/${i + 1}`,
        urlToImage: `https://picsum.photos/id/${(i % 100) + 116}/800/600`,
        publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
        content: `Comprehensive health coverage including medical breakthroughs, expert advice, and wellness recommendations.`
      }))
    };

    const startIdx = (page - 1) * 30;
    const endIdx = startIdx + 30;
    const articles = allMockArticles[category] || allMockArticles.general;
    
    return {
      articles: articles.slice(startIdx, endIdx),
      totalResults: articles.length,
      status: "ok"
    };
  }
}

export const newsService = new NewsService();