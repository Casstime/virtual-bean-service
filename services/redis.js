const redis = require('redis');


module.exports = {
  client: null,
  createClient: function (options={}) {
    this.client = redis.createClient(options);
  }
};
