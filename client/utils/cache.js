class MemoryCache {
  constructor() {
    this.cache = new Map();
  }

  set(key, value, ttl = 60000) {
    if (this.cache.has(key)) {
      clearTimeout(this.cache.get(key).timeout);
    }
    const timeout = setTimeout(() => {
      this.cache.delete(key);
    }, ttl);
    this.cache.set(key, { value, timeout });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    return item.value;
  }

  delete(key) {
    if (this.cache.has(key)) {
      clearTimeout(this.cache.get(key).timeout);
      this.cache.delete(key);
    }
  }

  clear() {
    for (const item of this.cache.values()) {
      clearTimeout(item.timeout);
    }
    this.cache.clear();
  }

  keys() {
    return Array.from(this.cache.keys());
  }
}

const cache = new MemoryCache();

function getCached(key) {
  return cache.get(key);
}

function setCache(key, value, ttl = 60000) {
  cache.set(key, value, ttl);
}

function clearCache(key = null) {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

const CACHE_KEYS = {
  USERS: "users",
  PROFILE: "profile",
  CHATS: "chats",
  MESSAGES: (id, page) => `message:${id}:page:${page}`,
  MEDIA: (chatId) => `media:${chatId}`,
};

module.exports = {
  getCached,
  setCache,
  clearCache,
  CACHE_KEYS,
};