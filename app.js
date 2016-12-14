const mongodb = require('mongodb')
const redis = require('redis')

const config = require('./config')

const MongoClient = mongodb.MongoClient

let databaseConnection = {}
let redisClient = {}

const listKey = 'simple_logger_queue'
const timeoutMs = 5000

console.log('Just Log Me Baby Consumer running\n\n')

MongoClient.connect(config.mongoUrl, (error, dbCon) => {
  if (error) {
    console.error(`Failed to connect to connect to database with error: ${error}. Killing app.\n\n`)
    process.exit(1)
  }

  console.log(`Connected to MongoDB at ${config.mongoUrl}\n\n`)
  databaseConnection = dbCon
  redisClient = redis.createClient(config.redisUrl)
  redisClient.on('connect', () => {
    console.log(`Connected to redis instance at ${config.redisUrl}\n\n`)
    run()
  })
})

function run () {
  pop()
    .then((item) => {
      if (item == null) {
        console.log(`Queue empty, sleeping for ${timeoutMs}ms\n\n`)
        setTimeout(run, timeoutMs)
        return
      }

      console.log(`Item found in queue:\n${JSON.stringify(item)}\n\n`)
      databaseConnection.collection(item.database).insert(item.content)
      run()
    })
    .catch(error => {
      console.error(error)
      process.exit(1)
    })
}

function pop () {
  return new Promise((resolve, reject) => {
    redisClient.rpop(listKey, (error, response) => {
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
