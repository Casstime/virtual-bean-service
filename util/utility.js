const crypto = require('crypto');
const moment = require('moment');
const uuidV4 = require('uuid/v4');
const config = require('config');

function createSha1Signature(str) {
  const shasum = crypto.createHash('sha1');
  shasum.update(str);
  return shasum.digest('hex');
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

function encode(cryptKey, ivBuffer, clearData) {
  const encipher = crypto.createCipheriv('aes-128-cbc', cryptKey, ivBuffer);
  let encoded = encipher.update(clearData, 'utf8', 'binary');
  encoded += encipher.final('binary');
  encoded = Buffer.from(encoded, 'binary').toString('base64');
  return encoded;
}

function createSessionid(sessionKey, iv) {
  const uuid = uuidV4();
  const timestamp = moment().valueOf();
  const version = config.version;
  const clearData = JSON.stringify({
    rand: uuid,
    timestamp,
    version
  });
  const cryptKey = Buffer.from(sessionKey, 'base64');
  const ivBuffer = Buffer.from(iv, 'base64');
  return encode(cryptKey, ivBuffer, clearData);
}

module.exports = {
  createSha1Signature, decryptData, createSessionid
};
