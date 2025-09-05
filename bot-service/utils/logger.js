const fs = require('fs')
const path = require('path')

const logDir = path.join(__dirname, '../logs')
// Make sure the directory exists
fs.mkdirSync(logDir, { recursive: true })

const logStream = fs.createWriteStream(path.join(logDir, 'main.log'), {
  flags: 'a',
})

// Format date in Israel time (Asia/Jerusalem)
const getIsraelTimestamp = () => {
  return new Intl.DateTimeFormat('en-IL', {
    timeZone: 'Asia/Jerusalem',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date())
}

const logMessage = (level, message) => {
  if (process.env.LOG_LEVEL === level || true) {
    const logEntry = `${getIsraelTimestamp()} - ${message}\n`
    logStream.write(logEntry)
  }
}

module.exports = {
  trace: (message) => logMessage('trace', message),
  info: (message) => logMessage('info', message),
  error: (message) => logMessage('error', message),
  warn: (message) => logMessage('warn', message),
}
