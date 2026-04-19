// src/store/newsStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useNewsStore = create(
  persist(
    (set, get) => ({
      currentCategory: "general",
      currentCountry: "us",
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
        if (viewedArticles.find(a => a.url === article.url)) return;
        const newViewed = [article, ...viewedArticles].slice(0, 50);
        set({ viewedArticles: newViewed });
        localStorage.setItem("viewed_articles", JSON.stringify(newViewed));
      },
      
      loadViewedArticles: () => {
        const saved = localStorage.getItem("viewed_articles");
        if (saved) {
          try {
            set({ viewedArticles: JSON.parse(saved) });
          } catch (e) {
            console.error("Failed to load viewed articles:", e);
          }
        }
      },
      
      clearFilters: () => set({
        filters: { sortBy: "publishedAt", dateFrom: null, dateTo: null },
      }),
    }),
    { name: "news-preferences" }
  )
);