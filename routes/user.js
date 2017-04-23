const express = require('express');
const router = express.Router();
const config = require('config');
const rp = require('request-promise');
const co = require('co');
const uuid = require('node-uuid');
const LoginService = require('qcloud-weapp-server-sdk').LoginService;

/* GET users listing. */
router.get('/', function(req, res, next) {
  const loginService = new LoginService(req, res);

  loginService.check().then(result => {
    res.json({
      code: 0,
      message: 'ok',
      data: {
        userInfo: result.userInfo
      },
    });
  }).catch(err => {
    console.log(err);
  });
});

module.exports = router;
