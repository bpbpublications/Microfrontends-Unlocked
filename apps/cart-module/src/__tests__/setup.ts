// jsdom 22+ dropped localStorage — provide a simple in-memory mock
const storage: Record<string, string> = {}
const localStorageMock: Storage = {
  getItem:    (key)        => storage[key] ?? null,
  setItem:    (key, value) => { storage[key] = String(value) },
  removeItem: (key)        => { delete storage[key] },
  clear:      ()           => { Object.keys(storage).forEach(k => delete storage[k]) },
  key:        (index)      => Object.keys(storage)[index] ?? null,
  get length()             { return Object.keys(storage).length },
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: false })
