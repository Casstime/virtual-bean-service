const express = require('express');
const router = express.Router();
const config = require('config');
const LoginService = require('qcloud-weapp-server-sdk').LoginService;

router.get('/', (req, res, next) => {
  console.log('登录');
  const loginService = new LoginService(req, res);

  loginService.login().then(result => {
    console.log('微信用户信息', result.userInfo);
    res.json({userInfo});
  });
});

module.exports = router;