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
        const data = await response.json();
        return res.status(200).json({
          articles: data.articles || [],
          totalResults: data.totalResults || 0,
          status: data.status
        });

      case 'everything':
        apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(params.q)}&pageSize=30&page=${params.page || 1}&sortBy=publishedAt&language=en&apiKey=${NEWS_API_KEY}`;
        response = await fetch(apiUrl);
        const searchData = await response.json();
        return res.status(200).json({
          articles: searchData.articles || [],
          totalResults: searchData.totalResults || 0,
          status: searchData.status
        });

      default:
        return res.status(400).json({ error: 'Invalid endpoint' });
    }
  } catch (error) {
    console.error('API proxy error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch news',
      articles: [],
      totalResults: 0
    });
  }
}