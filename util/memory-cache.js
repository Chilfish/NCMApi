class MemoryCache {
  constructor() {
    this.cache = {}
    this.size = 0
  }

  add(key, value, time, timeoutCallback) {
    const old = this.cache[key]
    const instance = this

    const entry = {
      value,
      expire: time + Date.now(),
      timeout: setTimeout(() => {
        instance.delete(key)
        return (
          timeoutCallback
          && typeof timeoutCallback === 'function'
          && timeoutCallback(value, key)
        )
      }, time),
    }

    this.cache[key] = entry
    this.size = Object.keys(this.cache).length

    return entry
  }

  delete(key) {
    const entry = this.cache[key]

    if (entry)
      clearTimeout(entry.timeout)

    delete this.cache[key]

    this.size = Object.keys(this.cache).length

    return null
  }

  get(key) {
    const entry = this.cache[key]

    return entry
  }

  getValue(key) {
    const entry = this.get(key)

    return entry && entry.value
  }

  clear() {
    Object.keys(this.cache).forEach(function (key) {
      this.delete(key)
    }, this)

    return true
  }
}

module.exports = MemoryCache
