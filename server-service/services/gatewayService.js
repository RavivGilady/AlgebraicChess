// Gateway service to avoid circular dependencies
let io = null

function setIO(socketIO) {
  io = socketIO
}

function room(gameId) {
  return `game:${gameId}`
}

function seatRoom(gameId, color) {
  return `game:${gameId}:seat:${color}`
}

function broadcast(gameId, event, payload) {
  if (!io) {
    console.warn('Gateway not initialized, cannot broadcast')
    return
  }
  io.to(room(gameId)).emit(event, payload)
}

function sendSeat(gameId, color, event, payload) {
  if (!io) {
    console.warn('Gateway not initialized, cannot send to seat')
    return
  }
  io.to(seatRoom(gameId, color)).emit(event, payload)
}

module.exports = {
  setIO,
  broadcast,
  sendSeat,
}
