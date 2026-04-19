// api/news.js
export default async function handler(req, res) {
  // Enable CORS for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { endpoint, category, country, page, q } = req.query;
  
  // Get API keys from environment variables
  const NEWS_API_KEY = process.env.VITE_NEWS_API_KEY;
  const GNEWS_API_KEY = process.env.VITE_GNEWS_API_KEY;
  const MEDIASTACK_API_KEY = process.env.VITE_MEDIASTACK_API_KEY;

  console.log('Environment check:', {
    hasNewsAPI: !!NEWS_API_KEY,
    hasGNews: !!GNEWS_API_KEY,
    hasMediaStack: !!MEDIASTACK_API_KEY,
    endpoint,
    category
  });

  // Handle top headlines
  if (endpoint === 'top-headlines') {
    // Try GNews first (most reliable)
    if (GNEWS_API_KEY) {
      try {
        let url = `https://gnews.io/api/v4/top-headlines?token=${GNEWS_API_KEY}&country=${country || 'us'}&max=30&page=${page || 1}&lang=en`;
        if (category && category !== 'general' && category !== 'undefined') {
          url += `&category=${category}`;
        }
        
        console.log('Fetching from GNews:', url.replace(GNEWS_API_KEY, 'HIDDEN'));
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
          console.log(`GNews success: ${data.articles.length} articles`);
          return res.status(200).json({
            articles: data.articles.map(a => ({
              source: { id: null, name: a.source?.name || 'GNews' },
              author: a.author,
              title: a.title,
              description: a.description || '',
              url: a.url,
              urlToImage: a.image,
              publishedAt: a.publishedAt,
              content: a.content,
            })),
            totalResults: data.totalArticles || 0,
          });
        } else {
          console.log('GNews returned no articles:', data);
        }
      } catch (error) {
        console.error('GNews error:', error.message);
      }
    }

    // Try NewsAPI second
    if (NEWS_API_KEY) {
      try {
        let url = `https://newsapi.org/v2/top-headlines?country=${country || 'us'}&pageSize=30&page=${page || 1}&apiKey=${NEWS_API_KEY}`;
        if (category && category !== 'general' && category !== 'undefined') {
          url += `&category=${category}`;
        }
        
        console.log('Fetching from NewsAPI:', url.replace(NEWS_API_KEY, 'HIDDEN'));
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.status === 'ok' && data.articles) {
          const validArticles = data.articles.filter(a => a.title && a.title !== '[Removed]' && a.url);
          if (validArticles.length > 0) {
            console.log(`NewsAPI success: ${validArticles.length} articles`);
            return res.status(200).json({
              articles: validArticles.map(a => ({
                source: a.source || { id: null, name: a.source?.name || 'NewsAPI' },
                author: a.author,
                title: a.title,
                description: a.description || '',
                url: a.url,
                urlToImage: a.urlToImage,
                publishedAt: a.publishedAt,
                content: a.content,
              })),
              totalResults: data.totalResults || 0,
            });
          }
        }
      } catch (error) {
        console.error('NewsAPI error:', error.message);
      }
    }
  }

  // Handle search
  if (endpoint === 'search' && q) {
    if (GNEWS_API_KEY) {
      try {
        const url = `https://gnews.io/api/v4/search?token=${GNEWS_API_KEY}&q=${encodeURIComponent(q)}&max=30&page=${page || 1}&lang=en`;
        console.log('Searching GNews:', url.replace(GNEWS_API_KEY, 'HIDDEN'));
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
          console.log(`Search success: ${data.articles.length} results`);
          return res.status(200).json({
            articles: data.articles.map(a => ({
              source: { id: null, name: a.source?.name || 'GNews' },
              author: a.author,
              title: a.title,
              description: a.description || '',
              url: a.url,
              urlToImage: a.image,
              publishedAt: a.publishedAt,
              content: a.content,
            })),
            totalResults: data.totalArticles || 0,
          });
        }
      } catch (error) {
        console.error('Search error:', error.message);
      }
    }
  }

  // Return empty array if all sources fail
  console.log('No articles found from any source');
  return res.status(200).json({ articles: [], totalResults: 0 });
}