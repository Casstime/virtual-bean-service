const express = require('express');
const router = express.Router();
const config = require('config');
const rp = require('request-promise');
const co = require('co');
const uuid = require('node-uuid');
const LoginService = require('qcloud-weapp-server-sdk').LoginService;
const User= require('../models/user');

function findOrCreateUser(openid) {
  return new Promise((reject, resolve) => {
    User.findOrCreateByOpenid(openid, function (err, user) {
      if (err) return reject(err);
      resolve(user);
    });
  });
}

/* GET users listing. */
router.get('/', function(req, res, next) {
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
      const user = yield findOrCreateUser(result.openid);
      res.json({ sessionKey: result.session_key, openid: result.openid, userId: user._id });
    }).catch((err) => {
      console.log('获取session_key失败', err)
    });
});

module.exports = router;
