require('dotenv').config({ silent: true })

module.exports = {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/justlogmebaby',
  port: process.env.PORT || 8080,
  redisUrl: process.env.REDIS_URL || '//localhost:6379',
  stdoutFileDestination: process.env.JLMB_MONGO_WORKER_STDOUT_FILE_DESTINATION || null,
  stderrFileDestination: process.env.JLMB_MONGO_WORKER_STDERR_FILE_DESTINATION || null
}
