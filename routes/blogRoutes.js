const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');

const Blog = mongoose.model('Blog');

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    res.send(blog);
  });

  // writing test for redis/req handler
  app.get('/api/blogs', requireLogin, async (req, res) => {
    const redis = require('redis');
    const redisUrl = 'redis://127.0.0.1:6379';
    const client = redis.createClient(redisUrl);
    const util = require('util');
    // creates promise/extends function
    client.get = util.promisify(client.get);

    // any cached data in redis related to this query?
    const cachedBlogs = await client.get(req.user.id);

    // yes, responds immediately and return
    if (cachedBlogs) {
      // parse back to user
      console.log('====================================');
      console.log('SERVING FROM CACHE');
      console.log('====================================');
      return res.send(JSON.parse(cachedBlogs));
    }

    // no, respond to req and update cache to store data.  else statement not needed bc the return statement will not continue on. make sure to stringify and parse for redis

    const blogs = await Blog.find({
      _user: req.user.id
    });

    console.log('====================================');
    console.log('SERVING FROM MONGODB');
    console.log('====================================');
    res.send(blogs);

    client.set(req.user.id, JSON.stringify(blogs));
  });

  app.post('/api/blogs', requireLogin, async (req, res) => {
    const {
      title,
      content
    } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
};
