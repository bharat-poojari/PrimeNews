// src/store/bookmarkStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";

export const useBookmarkStore = create(
  persist(
    (set, get) => ({
      bookmarks: [],
      
      addBookmark: (article) => {
        const { bookmarks } = get();
        if (bookmarks.find(b => b.url === article.url)) {
          toast.error("Article already bookmarked");
          return;
        }
        set({
          bookmarks: [{ ...article, bookmarkedAt: Date.now() }, ...bookmarks],
        });
        toast.success("Article bookmarked!");
      },
      
      removeBookmark: (url) => {
        const { bookmarks } = get();
        set({ bookmarks: bookmarks.filter(b => b.url !== url) });
        toast.success("Bookmark removed");
      },
      
      isBookmarked: (url) => {
        const { bookmarks } = get();
        return bookmarks.some(b => b.url === url);
      },
      
      clearAllBookmarks: () => {
        set({ bookmarks: [] });
        toast.success("All bookmarks cleared");
      },
      
      getBookmarkCount: () => {
        const { bookmarks } = get();
        return bookmarks.length;
      },
    }),
    { name: "news-bookmarks" }
  )
);