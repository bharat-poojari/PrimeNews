// api/news.js
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
  const NEWS_API_KEY = process.env.VITE_NEWS_API_KEY;

  if (!NEWS_API_KEY) {
    return res.status(200).json({ articles: [], totalResults: 0 });
  }

  try {
    let url = '';
    if (endpoint === 'top-headlines') {
      url = `https://newsapi.org/v2/top-headlines?country=${country || 'us'}&pageSize=30&page=${page || 1}&apiKey=${NEWS_API_KEY}`;
      if (category && category !== 'general') {
        url += `&category=${category}`;
      }
    } else if (endpoint === 'everything' && q) {
      url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&pageSize=30&page=${page || 1}&sortBy=publishedAt&language=en&apiKey=${NEWS_API_KEY}`;
    } else {
      return res.status(200).json({ articles: [], totalResults: 0 });
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'error') {
      return res.status(200).json({ articles: [], totalResults: 0 });
    }

    return res.status(200).json({
      articles: data.articles || [],
      totalResults: data.totalResults || 0,
      status: 'ok',
    });
  } catch (error) {
    console.error('API error:', error);
    return res.status(200).json({ articles: [], totalResults: 0 });
  }
}