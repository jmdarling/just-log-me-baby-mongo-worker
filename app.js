const mongodb = require('mongodb')
const redis = require('redis')
const SdhpLogger = require('sdhp-logger')

const config = require('./config')

const logger = new SdhpLogger({
  logToConsole: config.logFileDestination == null,
  logToFile: config.logFileDestination != null,
  logFilePath: config.logFileDestination,
  minimumSeverity: config.logSeverity
})

const MongoClient = mongodb.MongoClient

let databaseConnection = {}
let redisClient = {}

const timeoutMs = 5000

logger.info('Just Log Me Baby Mongo Consumer starting.')

MongoClient.connect(config.mongoUrl, (error, dbCon) => {
  if (error) {
    logger.error(`Failed to connect to connect to database with error: ${error}. Killing app.`)
    process.exit(1)
  }

  logger.info(`Connected to MongoDB at ${config.mongoUrl}.`)
  databaseConnection = dbCon
  redisClient = redis.createClient(config.redisUrl)
  redisClient.on('connect', () => {
    logger.info(`Connected to redis instance at ${config.redisUrl}.`)
    run()
  })
})

function run () {
  pop()
    .then((item) => {
      if (item == null) {
        logger.debug(`Queue empty, sleeping for ${timeoutMs}ms.`)
        setTimeout(run, timeoutMs)
        return
      }

      logger.debug(`Item found in queue:\n${JSON.stringify(item)}`)
      databaseConnection.collection(item.database).insert(item.content)
      run()
    })
    .catch(error => {
      logger.error(error)
      process.exit(1)
    })
}

function pop () {
  return new Promise((resolve, reject) => {
    redisClient.rpop(config.redisListKey, (error, response) => {
      if (error != null) {
        return reject(error)
      }

      try {
        return resolve(JSON.parse(response))
      } catch (error) {
        return reject(error)
      }
    })
  })
}
