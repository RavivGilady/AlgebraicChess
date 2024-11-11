const fs = require('fs');
const path = require('path');

const logStream = fs.createWriteStream(path.join(__dirname, '../logs/access.log'), { flags: 'a' });

const logMessage = (level, message) => {
  if (process.env.LOG_LEVEL === level || true) {
    const logEntry = `${new Date().toISOString()} - ${message}\n`;
    logStream.write(logEntry);
  }
};

module.exports = {
  trace: (message) => logMessage('trace', message),
  info: (message) => logMessage('info', message),
  error: (message) => logMessage('error', message),
};
