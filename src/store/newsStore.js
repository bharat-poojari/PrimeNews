import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useNewsStore = create(
  persist(
    (set, get) => ({
      currentCategory: "general",
      currentCountry: "in",
      searchQuery: "",
      filters: {
        sortBy: "publishedAt",
        dateFrom: null,
        dateTo: null,
      },
      viewedArticles: [],
      
      setCurrentCategory: (category) => set({ currentCategory: category }),
      
      setCurrentCountry: (country) => set({ currentCountry: country }),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      setFilters: (filters) => set({ filters }),
      
      addViewedArticle: (article) => {
        const { viewedArticles } = get();
        if (viewedArticles.find((a) => a.url === article.url)) return;
        const newArticles = [article, ...viewedArticles].slice(0, 50);
        localStorage.setItem("viewed_articles", JSON.stringify(newArticles));
        set({ viewedArticles: newArticles });
      },
      
      loadViewedArticles: () => {
        const saved = localStorage.getItem("viewed_articles");
        if (saved) {
          set({ viewedArticles: JSON.parse(saved) });
        }
      },
      
      clearFilters: () => set({ 
        filters: { sortBy: "publishedAt", dateFrom: null, dateTo: null } 
      }),
    }),
    {
      name: "news-preferences",
    }
  )
);