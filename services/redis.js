const expressSession = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis')(expressSession);

// 创建Redis客户端
const redisClient = redis.createClient(6379, '127.0.0.1', {auth_pass: '123456'});

moudule.exports = new RedisStore({ client: redisClient });
