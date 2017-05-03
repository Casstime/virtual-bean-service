const crypto = require('crypto');

function createSha1Signature(str) {
  const sha1 = crypto.createHash('sha1');
  sha1.update(str);
  return sha1.digest('hex');
}

/**
 * 解密微信encryptedData
 * @param key 解密的key
 * @param iv 向量
 * @param cipher
 * @returns {*|Progress|Query}
 */
function decrypt(key, iv, cipher) {
  cipher = Buffer.from(cipher, 'base64').toString('binary');
  const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
  let decoded = decipher.update(cipher, 'binary', 'utf8');
  decoded += decipher.final('utf8');
  return decoded;
}

function decodeBase64(encoded) {
  return Buffer.from(encoded, 'base64').toString();
}

module.exports = {
  createSha1Signature, decrypt, decodeBase64
};
