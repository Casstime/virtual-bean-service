const expect = require('chai').expect;
const co = require('co');
const rp = require('request-promise');
const config = require('config');

describe('users', () => {
  it('/login', (done) => {
    co(function* () {
      const options = {
        uri: 'https://api.weixin.qq.com/sns/jscode2session',
        qs: {
          appid: config.appId,
          secret: config.appSecret,
          js_code: '0135HpAu1KxtKa0cZlBu1dZgAu15HpAV',
          grant_type: 'authorization_code'
        },
        json: true
      };
      const result = yield rp(options);
      console.log('返回的sessionkey', result);
      expect(result).to.have.property('session_key');
      done();
    }).catch((err) => {
      done(err);
    });
  });
});