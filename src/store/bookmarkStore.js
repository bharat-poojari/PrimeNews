import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useBookmarkStore = create(
  persist(
    (set, get) => ({
      bookmarks: [],
      
      addBookmark: (article) => {
        const { bookmarks } = get();
        if (!bookmarks.find(b => b.url === article.url)) {
          set({
            bookmarks: [...bookmarks, { ...article, bookmarkedAt: Date.now() }]
          });
        }
      },
      
      removeBookmark: (url) => {
        const { bookmarks } = get();
        set({
          bookmarks: bookmarks.filter(article => article.url !== url)
        });
      },
      
      isBookmarked: (url) => {
        const { bookmarks } = get();
        return bookmarks.some(article => article.url === url);
      },
      
      clearAllBookmarks: () => {
        set({ bookmarks: [] });
      },
      
      getBookmarkCount: () => {
        const { bookmarks } = get();
        return bookmarks.length;
      }
    }),
    {
      name: "news-bookmarks"
    }
  )
);