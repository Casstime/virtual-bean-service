const crypto = require('crypto');
const moment = require('moment');
const uuidV4 = require('uuid/v4');
const config = require('config');

function createSha1Signature(str) {
  const sha1 = crypto.createHash('sha1');
  sha1.update(str);
  return sha1.digest('hex');
}

function decryptData(appId, sessionKey, encryptedData, iv) {
  // base64 decode
  sessionKey = Buffer.from(sessionKey, 'base64');
  encryptedData = Buffer.from(encryptedData, 'base64');
  iv = Buffer.from(iv, 'base64');

  let decoded;
  try {
    // 解密
    const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv);
    // 设置自动 padding 为 true，删除填充补位
    decipher.setAutoPadding(true);

    decoded = decipher.update(encryptedData, 'binary', 'utf8');
    decoded += decipher.final('utf8');
    decoded = JSON.parse(decoded);

  } catch (err) {
    throw new Error('Illegal Buffer');
  }

  if (decoded.watermark.appid !== appId) {
    throw new Error('Illegal Buffer');
  }

  return decoded;
}

function createSessionid(openid, sessionKey) {
  const uuid = uuidV4();
  const timestamp = moment().valueOf();
  const version = config.version;
  return '';
}

module.exports = {
  createSha1Signature, decryptData, createSessionid
};
