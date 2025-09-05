const fs = require('fs')
const path = require('path')
const logDir = path.join(__dirname, '../logs')

fs.mkdirSync(logDir, { recursive: true })

const logStream = fs.createWriteStream(path.join(logDir, 'main.log'), {
  flags: 'a',
})

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
    const logEntry = `${getIsraelTimestamp()} - ${getCallerInfo()} - ${message}\n`
    logStream.write(logEntry)
  }
}
function getCallerInfo() {
  const stack = new Error().stack.split('\n')[4] // [4] is the caller
  const match = stack.match(/\(([^)]+)\)/) // extract content inside parentheses
  const fullPath = match ? match[1] : stack.trim()

  // Use regex to extract file, line, and column
  const parts = fullPath.match(/(.*[\\/])?([^\\/]+:\d+:\d+)/)
  return parts ? parts[2] : fullPath
}

module.exports = {
  trace: (message) => logMessage('trace', message),
  info: (message) => logMessage('info', message),
  error: (message) => logMessage('error', message),
  warn: (message) => logMessage('warn', message),
}
