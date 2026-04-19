// PrimeNews/api/news.js
export default async function handler(req, res) {
  // Enable CORS for responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { endpoint, ...params } = req.query;

  // Get API keys from environment variables
  const NEWS_API_KEY = process.env.VITE_NEWS_API_KEY;
  const GNEWS_API_KEY = process.env.VITE_GNEWS_API_KEY;
  const MEDIASTACK_API_KEY = process.env.VITE_MEDIASTACK_API_KEY;

  try {
    let apiUrl = '';
    let response = null;

    // Route to appropriate API based on endpoint parameter
    switch (endpoint) {
      case 'top-headlines':
        apiUrl = `https://newsapi.org/v2/top-headlines?country=${params.country || 'us'}&pageSize=30&page=${params.page || 1}&apiKey=${NEWS_API_KEY}`;
        if (params.category && params.category !== 'general') {
          apiUrl += `&category=${params.category}`;
        }
        response = await fetch(apiUrl);
        break;

      case 'everything':
        apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(params.q)}&pageSize=30&page=${params.page || 1}&sortBy=publishedAt&language=en&apiKey=${NEWS_API_KEY}`;
        response = await fetch(apiUrl);
        break;

      case 'gnews':
        apiUrl = `https://gnews.io/api/v4/top-headlines?token=${GNEWS_API_KEY}&country=${params.country || 'us'}&max=30&page=${params.page || 1}&lang=en`;
        if (params.category && params.category !== 'general') {
          apiUrl += `&category=${params.category}`;
        }
        response = await fetch(apiUrl);
        break;

      case 'gnews-search':
        apiUrl = `https://gnews.io/api/v4/search?token=${GNEWS_API_KEY}&q=${encodeURIComponent(params.q)}&max=30&page=${params.page || 1}&lang=en&sortby=publishedAt`;
        response = await fetch(apiUrl);
        break;

      case 'mediastack':
        apiUrl = `http://api.mediastack.com/v1/news?access_key=${MEDIASTACK_API_KEY}&countries=${params.country || 'us'}&limit=30&offset=${30 * ((params.page || 1) - 1)}&languages=en`;
        if (params.category && params.category !== 'general') {
          const categoryMap = {
            general: 'general',
            technology: 'technology',
            business: 'business',
            entertainment: 'entertainment',
            sports: 'sports',
            science: 'science',
            health: 'health'
          };
          apiUrl += `&categories=${categoryMap[params.category] || 'general'}`;
        }
        response = await fetch(apiUrl);
        break;

      case 'mediastack-search':
        apiUrl = `http://api.mediastack.com/v1/news?access_key=${MEDIASTACK_API_KEY}&keywords=${encodeURIComponent(params.q)}&limit=30&offset=${30 * ((params.page || 1) - 1)}&languages=en&sort=published_desc`;
        response = await fetch(apiUrl);
        break;

      default:
        return res.status(400).json({ error: 'Invalid endpoint' });
    }

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    
    // Standardize the response format
    let standardizedData = { articles: [], totalResults: 0 };
    
    if (endpoint === 'gnews' || endpoint === 'gnews-search') {
      standardizedData = {
        articles: (data.articles || []).map(article => ({
          source: { id: null, name: article.source?.name || 'GNews' },
          author: article.author,
          title: article.title,
          description: article.description,
          url: article.url,
          urlToImage: article.image,
          publishedAt: article.publishedAt,
          content: article.content
        })),
        totalResults: data.totalArticles || 0
      };
    } else if (endpoint === 'mediastack' || endpoint === 'mediastack-search') {
      standardizedData = {
        articles: (data.data || []).map(article => ({
          source: { id: null, name: article.source || 'MediaStack' },
          author: article.author,
          title: article.title,
          description: article.description,
          url: article.url,
          urlToImage: article.image,
          publishedAt: article.published_at,
          content: article.content
        })),
        totalResults: data.pagination?.total || 0
      };
    } else {
      standardizedData = {
        articles: data.articles || [],
        totalResults: data.totalResults || 0
      };
    }

    return res.status(200).json(standardizedData);
    
  } catch (error) {
    console.error('API proxy error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch news',
      details: error.message 
    });
  }
}