const logger = require("../utils/logger");
const { Server } = require("socket.io");
const { registerAsPlayer } = require("../services/playersManager");
const jwt = require("jsonwebtoken");

const io = new Server({
  cors: {
    origin: "https://algebric-chess.vercel.app||http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware for authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  const gameId = socket.handshake.auth.gameId;
  if (!token) {
    logger.error("Authentication error");
    return next(new Error("Authentication error"));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (!gameId) {
      logger.error("No game id provided to socket");
      return next(new Error("Non existing game id property"));
    }
    if (err) {
      logger.error(`Invalid token, error: ${err.message}`);
      return next(new Error("Invalid token"));
    }
    logger.error(
      `User ${JSON.stringify(user)} created socket for game id ${gameId} `
    );
    socket.user = user;
    socket.gameId = gameId;
    next();
  });
});

// Setup connection handlers
io.on("connection", (socket) => {
  registerAsPlayer(
    socket.user.username,
    socket.user.elo,
    socket,
    socket.gameId
  );

  socket.on("disconnect", () => {
    logger.info("User disconnected:", socket.user.username);
  });
});

module.exports = {
  io,
};
