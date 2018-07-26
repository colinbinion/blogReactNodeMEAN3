const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');


const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.get = util.promisify(client.get);

// get ref to existing default .exec function defined on a mongoose query.
const exec = mongoose.Query.prototype.exec;

// overwrite and execute additional code when query is executed.
mongoose.Query.prototype.exec = async function () {
  // console.log('====================================');
  // console.log('ABOUT TO RUN A QUERY');
  // console.log('====================================');
  // console.log(this.getQuery());
  // console.log('====================================');
  // console.log(this.mongooseCollection.name);
  // console.log('====================================');

  // don't modify this.getQuery directly.  It will modify the underlying code. get object passed in to getQuery and add collection name.
  const key = JSON.stringify(Object.assign({}, this.getQuery(), {
    collection: this.mongooseCollection.name
  }));
  // console.log('====================================');
  // console.log(key);
  // console.log('====================================');

  // verify we have value for 'key' in redis
  const cacheValue = await client.get(key);
  // if yes, return key
  if (cacheValue) {
    // patches model instance and parses to document for mongoDB

    const doc = JSON.parse(cacheValue);
    // const doc = new this.model(JSON.parse(cacheValue));
    // same as:
    // new blog({
    //   title: 'Hi',
    //   content: 'There'
    // })

    // console.log('====================================');
    // console.log(this);
    // console.log('====================================');

    //returning parsed cache from redis
    // return JSON.parse(cacheValue);
    // return doc;

    // using terenary expression as +- checker
    Array.isArray(doc) ? its an array : its an object;
  }
  //otherwise issue query and store result in redis
  const result = await exec.apply(this, arguments);

  //sets stringified results to redis client key...
  client.set(key, JSON.stringify(result));

  return result;
  // console.log('====================================');
  // console.log(result.validate);
  // console.log('====================================');
}
