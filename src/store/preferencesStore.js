import { create } from "zustand";
import { persist } from "zustand/middleware";

export const usePreferencesStore = create(
  persist(
    (set) => ({
      preferredCategories: ["general", "technology"],
      preferredCountry: "in",
      articlesPerPage: 20,
      autoRefresh: false,
      refreshInterval: 300,
      notifications: false,
      
      setPreferredCategories: (categories) => set({ preferredCategories: categories }),
      
      setPreferredCountry: (country) => set({ preferredCountry: country }),
      
      setArticlesPerPage: (count) => set({ articlesPerPage: count }),
      
      toggleAutoRefresh: () => set((state) => ({ autoRefresh: !state.autoRefresh })),
      
      setRefreshInterval: (interval) => set({ refreshInterval: interval }),
      
      toggleNotifications: () => set((state) => ({ notifications: !state.notifications })),
      
      resetPreferences: () => set({
        preferredCategories: ["general", "technology"],
        preferredCountry: "in",
        articlesPerPage: 20,
        autoRefresh: false,
        refreshInterval: 300,
        notifications: false
      }),
    }),
    {
      name: "user-preferences"
    }
  )
);