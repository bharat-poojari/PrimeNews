import { create } from "zustand";

export const useNewsStore = create((set, get) => ({
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
    if (viewedArticles.find(a => a.url === article.url)) return;
    
    const newViewed = [article, ...viewedArticles].slice(0, 50);
    localStorage.setItem("viewed_articles", JSON.stringify(newViewed));
    set({ viewedArticles: newViewed });
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
}));