// PrimeNews/api/news.js
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { endpoint, category, country, page, q } = req.query;

  // Get API key from environment
  const NEWS_API_KEY = process.env.VITE_NEWS_API_KEY;

  if (!NEWS_API_KEY) {
    console.error('NewsAPI key is missing');
    return res.status(200).json({ articles: [], totalResults: 0 });
  }

  try {
    let apiUrl = '';
    
    if (endpoint === 'top-headlines') {
      // Build top headlines URL
      apiUrl = `https://newsapi.org/v2/top-headlines?country=${country || 'us'}&pageSize=30&page=${page || 1}&apiKey=${NEWS_API_KEY}`;
      
      if (category && category !== 'general' && category !== 'undefined') {
        apiUrl += `&category=${category}`;
      }
    } 
    else if (endpoint === 'everything') {
      // Build search URL
      if (!q || q.trim() === '') {
        return res.status(200).json({ articles: [], totalResults: 0 });
      }
      apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&pageSize=30&page=${page || 1}&sortBy=publishedAt&language=en&apiKey=${NEWS_API_KEY}`;
    }
    else {
      return res.status(200).json({ articles: [], totalResults: 0 });
    }

    console.log(`Fetching: ${apiUrl.replace(NEWS_API_KEY, 'HIDDEN')}`);
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (data.status === 'error') {
      console.error('NewsAPI error:', data.message);
      return res.status(200).json({ articles: [], totalResults: 0 });
    }
    
    return res.status(200).json({
      articles: data.articles || [],
      totalResults: data.totalResults || 0,
      status: 'ok'
    });
    
  } catch (error) {
    console.error('API error:', error.message);
    return res.status(200).json({ articles: [], totalResults: 0 });
  }
}