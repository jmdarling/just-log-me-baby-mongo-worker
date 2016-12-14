# Just Log Me Baby

[![Just Log Me Baby](http://img.youtube.com/vi/M2WB5yD7FfY/0.jpg)](http://www.youtube.com/watch?v=M2WB5yD7FfY "Just Love Me Baby")

[Just Love Me Baby - Rosco Gordon](https://www.youtube.com/watch?v=M2WB5yD7FfY)

## What is it?
A mongo consumer for [Just Log Me Baby](https://github.com/jmdarling/just-log-me-baby). Takes stuff out of redis, puts
it in mongo.

## How do I use it?
Set the PORT, MONGO_URL, and REDIS_URL environment variables (also supports [dotenv](https://www.npmjs.com/package/dotenv)).
The app will default to run on port ```8080```, attach to mongo at ```mongodb://localhost:27017/justlogmebaby``` and
attach to redis at ```//localhost:6379``` if environment variables are not set.

```
$npm i
$npm start
```