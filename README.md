# blogReactNodeMEAN3

npm run dev

redis used as cacheing server
brew services start redis
brew services restart redis

terminal (redis client):

> node
> const redis = require('redis')
> const redisUrl = 'redis://127.0.0.1:6379'
> const client = redis.createClient(redisUrl)

redis will only store num and letter. use JSON.stringify as workaround. i.e.: client.set('colors', JSON.stringify({ red: 'rojo' }))
result returns a JSON format instead of converting to an object. i.e.: client.get('colors', (err, val) => console.log(JSON.parse(val)))
Result:> { red: 'rojo' }
