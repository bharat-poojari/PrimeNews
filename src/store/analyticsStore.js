import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAnalyticsStore = create(
  persist(
    (set, get) => ({
      articleClicks: {},
      categoryViews: {},
      searchHistory: [],
      sessionStart: Date.now(),
      
      trackArticleClick: (url, title) => {
        const { articleClicks } = get();
        const existing = articleClicks[url] || { count: 0, title, lastClicked: null };
        set({
          articleClicks: {
            ...articleClicks,
            [url]: {
              count: existing.count + 1,
              title,
              lastClicked: Date.now()
            }
          }
        });
      },
      
      trackCategoryView: (category) => {
        const { categoryViews } = get();
        set({
          categoryViews: {
            ...categoryViews,
            [category]: (categoryViews[category] || 0) + 1
          }
        });
      },
      
      trackSearch: (query) => {
        const { searchHistory } = get();
        const newHistory = [query, ...searchHistory.filter(q => q !== query)].slice(0, 20);
        set({ searchHistory: newHistory });
      },
      
      getTrendingArticles: () => {
        const { articleClicks } = get();
        return Object.entries(articleClicks)
          .sort(([, a], [, b]) => b.count - a.count)
          .slice(0, 10)
          .map(([url, data]) => ({ url, ...data }));
      },
      
      getPopularCategories: () => {
        const { categoryViews } = get();
        return Object.entries(categoryViews)
          .sort(([, a], [, b]) => b - a)
          .map(([category, views]) => ({ category, views }));
      },
      
      clearAnalytics: () => {
        set({ articleClicks: {}, categoryViews: {}, searchHistory: [] });
      }
    }),
    {
      name: "analytics-data"
    }
  )
);