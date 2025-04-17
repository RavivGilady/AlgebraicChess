const logger = require('../utils/logger')
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const io = new Server({
    cors: {
      origin: "*", // customize this for production
      methods: ["GET", "POST"]
    }
  });
const userSockets = new Map();

// Middleware for authentication
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        logger.error("Authentication error")
      return next(new Error("Authentication error"));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        logger.trace(JSON.stringify(user))

      if (err) {
        logger.error("Invalid token")
        return next(new Error("Invalid token"));
      }
      logger.error("User created socket ")
      socket.user = user;
      next();
    });
  });

// Setup connection handlers
io.on("connection", (socket) => {
    logger.info(`New connection:${JSON.stringify(socket.user.username)}` );
    userSockets.set( socket.user.username,socket)

    socket.on("disconnect", () => {
      logger.info("User disconnected:", socket.user.username);
      userSockets.delete(socket.data.username)
    });
  });
  

module.exports = {
    userSockets,
    io
  };