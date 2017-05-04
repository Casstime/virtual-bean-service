const express = require('express');
const router = express.Router();
const config = require('config');
const co = require('co');
const rp = require('request-promise');
const User = require('../models/user');
const HttpError = require('../util/HttpError');
const { createSha1Signature, decryptData } = require('../util/utility');

function findOrCreateUser(openid) {
  return new Promise((resolve, reject) => {
    User.findOrCreateByOpenid(openid, function (err, user) {
      if (err) return reject(err);
      resolve(user);
    });
  });
}

/**
 * 用户登录，凭jscode向微信取session_key，openid
 */
router.post('/', (req, res, next) => {
  const body = req.body;
  const jsCode = body.code;
  const rawData = body.rawData;
  const encryptedData = body.encryptedData;
  const iv = body.iv;
  const signature = body.signature;
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
    const sessionKey = result.session_key;
    console.log('返回的sessionkey', sessionKey);

    const signature2 = createSha1Signature(`${rawData}${result.session_key}`);
    console.log('===前后签名===', signature, signature2);
    if (signature2 !== signature) {
      return next(new HttpError(400, '签名不一致'));
    }

    const decoded = decryptData(config.appId, sessionKey, encryptedData, iv);
    console.log('===解密结果====', decoded);
    let rawDataEqual = true;
    for (const key of Object.keys(rawData)) {
      if (rawData[key] !== decoded[key]) {
        rawDataEqual = false;
        break;
      }
    }
    if (!rawDataEqual) {
      return next(new HttpError(400, 'rawData与encryptedData不一致'));
    }
    if (decoded.openid !== result.openid) {
      return next(new HttpError(400, 'openid与微信接口获取不一致'));
    }

    // todo:生成3rd_session，redis储存，过期校验

    const user = yield findOrCreateUser(result.openid);
    res.json({ sessionKey, openid: result.openid, userId: user._id });
  }).catch((err) => {
    console.warn('获取session_key失败', err);
    // 网络请求错误，数据库查询错误
    // 解密错误，向客户端返回500错误
    next(err);
  });
});

module.exports = router;