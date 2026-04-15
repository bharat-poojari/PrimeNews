class CacheService {
  set(key, data, ttlSeconds = 300) {
    const item = {
      data,
      expiry: Date.now() + (ttlSeconds * 1000),
    };
    localStorage.setItem(`cache_${key}`, JSON.stringify(item));
  }

  get(key) {
    const cached = localStorage.getItem(`cache_${key}`);
    if (!cached) return null;

    const item = JSON.parse(cached);
    if (Date.now() > item.expiry) {
      localStorage.removeItem(`cache_${key}`);
      return null;
    }

    return item.data;
  }

  clear() {
    Object.keys(localStorage)
      .filter(key => key.startsWith('cache_'))
      .forEach(key => localStorage.removeItem(key));
  }
}

export const cacheService = new CacheService();