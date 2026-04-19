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

  // Check if API key is available
  if (!NEWS_API_KEY) {
    console.error('NewsAPI key is missing');
    return res.status(500).json({ 
      articles: [], 
      totalResults: 0, 
      error: 'API key not configured' 
    });
  }

  try {
    let apiUrl = '';
    let response = null;

    // Route to appropriate API based on endpoint parameter
    switch (endpoint) {
      case 'top-headlines':
        // Build URL for top headlines
        apiUrl = `https://newsapi.org/v2/top-headlines?country=${params.country || 'us'}&pageSize=30&page=${params.page || 1}&apiKey=${NEWS_API_KEY}`;
        
        // Add category if specified and not 'general'
        if (params.category && params.category !== 'general' && params.category !== 'undefined') {
          apiUrl += `&category=${params.category}`;
        }
        
        console.log(`Fetching top headlines from: ${apiUrl.replace(NEWS_API_KEY, 'HIDDEN')}`);
        response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`NewsAPI returned ${response.status}`);
        }
        
        const data = await response.json();
        
        return res.status(200).json({
          articles: data.articles || [],
          totalResults: data.totalResults || 0,
          status: data.status || 'ok'
        });

      case 'everything':
        // Decode and clean the search query
        const searchQuery = decodeURIComponent(params.q || '').trim();
        
        if (!searchQuery) {
          return res.status(200).json({ articles: [], totalResults: 0 });
        }
        
        // Build URL for search
        apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&pageSize=30&page=${params.page || 1}&sortBy=publishedAt&language=en&apiKey=${NEWS_API_KEY}`;
        
        console.log(`Searching for: "${searchQuery}" from: ${apiUrl.replace(NEWS_API_KEY, 'HIDDEN')}`);
        response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`NewsAPI returned ${response.status}`);
        }
        
        const searchData = await response.json();
        
        return res.status(200).json({
          articles: searchData.articles || [],
          totalResults: searchData.totalResults || 0,
          status: searchData.status || 'ok'
        });

      default:
        return res.status(400).json({ 
          articles: [], 
          totalResults: 0, 
          error: 'Invalid endpoint' 
        });
    }
  } catch (error) {
    console.error('API proxy error:', error.message);
    return res.status(500).json({ 
      articles: [], 
      totalResults: 0, 
      error: error.message 
    });
  }
}