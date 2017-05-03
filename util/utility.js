const crypto = require('crypto');

function createSha1Signature(str) {
  const sha1 = crypto.createHash('sha1');
  sha1.update(str);
  return sha1.digest('hex');
}

function decryptData(appId, sessionKey, encryptedData, iv) {
    // base64 decode
    sessionKey = Buffer.from(sessionKey, 'base64');
    encryptedData = Buffer.from(encryptedData, 'base64');
    iv = new Buffer(iv, 'base64');

    try {
      // 解密
      const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv);
      // 设置自动 padding 为 true，删除填充补位
      decipher.setAutoPadding(true);
      let decoded = decipher.update(encryptedData, 'binary', 'utf8');
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

module.exports = {
  createSha1Signature, decryptData
};
