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
  
  // Your API keys
  const NEWS_API_KEY = '83e4e21631f747069da9a0be3b153a32';
  const GNEWS_API_KEY = '062379a68af3aea550e5dd82fcf479b3';

  console.log('Request received:', { endpoint, q, category, country, page });

  try {
    // Handle search
    if (endpoint === 'search' && q) {
      let apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&pageSize=30&page=${page || 1}&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`;
      
      console.log('Fetching from NewsAPI:', apiUrl);
      let response = await fetch(apiUrl);
      let data = await response.json();
      
      // If NewsAPI fails or returns no results, try GNews
      if (!data.articles || data.articles.length === 0) {
        console.log('NewsAPI returned no results, trying GNews');
        apiUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=en&max=30&page=${page || 1}&token=${GNEWS_API_KEY}`;
        response = await fetch(apiUrl);
        const gnewsData = await response.json();
        
        data = {
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
      }
      
      console.log(`Returning ${data.articles?.length || 0} results`);
      return res.status(200).json(data);
    }
    
    // Handle headlines
    if (endpoint === 'headlines') {
      let apiUrl = `https://newsapi.org/v2/top-headlines?country=${country || 'in'}&page=${page || 1}&pageSize=30&apiKey=${NEWS_API_KEY}`;
      if (category && category !== 'general') {
        apiUrl += `&category=${category}`;
      }
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      return res.status(200).json(data);
    }
    
    return res.status(400).json({ error: 'Invalid endpoint', received: { endpoint, q } });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Failed to fetch news', message: error.message });
  }
}