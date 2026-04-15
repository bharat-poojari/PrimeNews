import { newsService } from './api';

export const checkApiStatus = async () => {
  const results = [];
  
  // Test each API
  const testCategories = ['technology', 'business', 'entertainment'];
  
  for (const category of testCategories) {
    try {
      const startTime = Date.now();
      const data = await newsService.fetchTopHeadlines(category, 'us', 1);
      const responseTime = Date.now() - startTime;
      
      results.push({
        api: newsService.enabledApis[newsService.currentApiIndex]?.name || 'Mock',
        category,
        success: data.articles && data.articles.length > 0,
        articleCount: data.articles?.length || 0,
        responseTime,
      });
    } catch (error) {
      results.push({
        api: 'Unknown',
        category,
        success: false,
        error: error.message,
      });
    }
  }
  
  return results;
};