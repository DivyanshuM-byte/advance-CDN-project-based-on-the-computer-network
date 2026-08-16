class MemoryCache {
  constructor(ttlMillis = 60000) {
    this.cache = new Map();
    this.ttlMillis = ttlMillis;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      expiry: Date.now() + this.ttlMillis
    });
  }

  clear() {
    this.cache.clear();
  }
}

module.exports = new MemoryCache(24 * 60 * 60 * 1000); // 24 hours TTL for demonstration
