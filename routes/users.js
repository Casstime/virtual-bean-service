const express = require('express');
const router = express.Router();
const config = require('config');
const rp = require('request-promise');
const co = require('co');
const uuid = require('node-uuid');
const redisStore = require('../services/redis');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', function (req, res, next) {
  const jsCode = req.body.js_code;
  const options = {
    uri: 'https://api.weixin.qq.com/sns/jscode2session',
    qs: {
      appid: config.appId,
      secret: config.appSecret,
      js_code: jsCode,
      grant_type: 'authorization_code'
    },
    json: true
  };
  co(function* () {
    const result = yield rp(options);
    console.log('返回的sessionkey', result);
    const sessionId = uuid.v4();
    redisStore.set(sessionId, `${result.session_key}${result.openid}`, 7200);
    res.json({ sessionId });
  }).catch((err) => {
    console.log('获取session_key失败', err)
  });
});

module.exports = router;
