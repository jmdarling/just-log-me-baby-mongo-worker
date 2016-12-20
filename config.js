require('dotenv').config({ silent: true })

module.exports = {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/justlogmebaby',
  port: process.env.PORT || 8080,
  redisUrl: process.env.REDIS_URL || '//localhost:6379',
  logFileDestination: process.env.JLMB_MONGO_WORKER_LOG_FILE_DESTINATION || null,
  logSeverity: process.env.JLMB_LOG_SEVERITY || 'INFO'
}
