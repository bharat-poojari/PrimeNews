// api/news.js
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { endpoint, q, category, country, page } = req.query;
  const NEWS_API_KEY = process.env.VITE_NEWS_API_KEY;
  const GNEWS_API_KEY = process.env.VITE_GNEWS_API_KEY;

  try {
    let apiUrl = '';
    let response;

    if (endpoint === 'top-headlines') {
      apiUrl = `https://newsapi.org/v2/top-headlines?country=${country || 'in'}&page=${page || 1}&pageSize=30&apiKey=${NEWS_API_KEY}`;
      if (category && category !== 'general') {
        apiUrl += `&category=${category}`;
      }
      response = await fetch(apiUrl);
      const data = await response.json();
      return res.status(200).json(data);
    }
    
    if (endpoint === 'everything' && q) {
      // Try NewsAPI first
      apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&pageSize=30&page=${page || 1}&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`;
      
      try {
        response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
          return res.status(200).json(data);
        }
      } catch (err) {
        console.log('NewsAPI search failed, trying GNews');
      }
      
      // Fallback to GNews
      apiUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=en&max=30&page=${page || 1}&token=${GNEWS_API_KEY}`;
      response = await fetch(apiUrl);
      const gnewsData = await response.json();
      
      const transformedData = {
        articles: (gnewsData.articles || []).map(article => ({
          source: { id: null, name: article.source?.name || 'GNews' },
          author: article.author,
          title: article.title,
          description: article.description,
          url: article.url,
          urlToImage: article.image,
          publishedAt: article.publishedAt,
          content: article.content
        })),
        totalResults: gnewsData.totalArticles || 0,
        status: 'ok'
      };
      
      return res.status(200).json(transformedData);
    }
    
    return res.status(400).json({ error: 'Invalid endpoint' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Failed to fetch news', message: error.message });
  }
}