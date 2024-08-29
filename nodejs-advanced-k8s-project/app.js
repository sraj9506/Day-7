const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Redis
const redisClient = redis.createClient({
  host:process.env.REDIS_HOST,
  port:process.env.REDIS_PORT
});

async function startServer() {
  try {
    // Connect to Redis
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Redis Client Connection Error', err);
    process.exit(1); // Exit process if Redis connection fails
  }
}

async function closeServer(){ 
 await redisClient.quit();
console.log("connection closed");
}


redisClient.on('error', (err) => console.error('Redis Client Error', err));

app.use(bodyParser.json());

app.get('/', async (req, res) => {
  await startServer();
  const visits = await redisClient.get('visits');
  if (visits) {
    await redisClient.set('visits', parseInt(visits) + 1);
  } else {
    await redisClient.set('visits', 1);
  }
  res.send(`Hello, World! You are visitor number ${visits || 1}`);
 await closeServer();
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} and Redis Host is ${process.env.REDIS_HOST}`);
});



