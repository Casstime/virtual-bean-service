const expect = require('chai').expect;
const { createSessionid } = require('../../util/utility');

describe('工具utility', () => {
  it('生成sessionid', () => {
    const iv = 'lLXCwDIgb6Ga250mxB3ZsA==';
    const session_key = 'OgT0iKiTsW0x6l+CUeqVJw==';
    const encoded = createSessionid(session_key, iv);
    console.log(encoded);
    console.log(encoded.length);
  });
});