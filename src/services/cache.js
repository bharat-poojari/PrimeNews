// PrimeNews/src/services/cache.js
class CacheService {
  set(key, data, durationSeconds = 300) {
    try {
      const cacheItem = {
        data: data,
        expiry: Date.now() + (durationSeconds * 1000)
      };
      localStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem));
    } catch (error) {
      console.error("Cache set error:", error);
    }
  }

  get(key) {
    try {
      const cached = localStorage.getItem(`cache_${key}`);
      if (!cached) return null;
      
      const cacheItem = JSON.parse(cached);
      if (Date.now() > cacheItem.expiry) {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }
      
      return cacheItem.data;
    } catch (error) {
      console.error("Cache get error:", error);
      return null;
    }
  }

  clear() {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith("cache_"))
        .forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error("Cache clear error:", error);
    }
  }
}

export const cacheService = new CacheService();