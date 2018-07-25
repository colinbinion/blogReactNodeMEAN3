const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');


const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.get = util.promisify(client.get);

// get ref to existing default .exec function defined on a mongoose query.
const exec = mongoose.Query.prototype.exec;

// overwrite and execute additional code when query is executed.
mongoose.Query.prototype.exec = function () {
  // console.log('====================================');
  // console.log('ABOUT TO RUN A QUERY');
  // console.log('====================================');
  // console.log(this.getQuery());
  // console.log('====================================');
  // console.log(this.mongooseCollection.name);
  // console.log('====================================');

  // don't modify this.getQuery directly.  It will modify the underlying code. get object passed in to getQuery and add collection name.
  const key = Object.assign({}, this.getQuery(), {
    collection: this.mongooseCollection.name
  });

  console.log('====================================');
  console.log(key);
  console.log('====================================');

  return exec.apply(this, arguments);
}
