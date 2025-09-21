const m = new Map()
module.exports = {
  get: (id) => m.get(id) || null,
  set: (id, game) => (m.set(id, game), game),
  del: (id) => m.delete(id),
  list: () => Array.from(m.keys()),
}
