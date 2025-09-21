const meta = new WeakMap()
exports.setPlayers = (game, players) => meta.set(game, { players })
exports.getSeat = (game, color) => meta.get(game)?.players?.[color] || null
exports.clear = (game) => meta.delete(game)
