const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  openid: {
    type: String
  },
  nickname: {
    type: String
  },
  groups: [{
    id: {
      type: Schema.Types.ObjectId,
      ref: 'Group'
    },
    nickname: {
      type: String
    },
    role: {
      type: String
    }
  }]
},{
  timestamps: true
});

userSchema.statics.findOrCreateByOpenid = function (openid, callback) {
  const User = mongoose.model('User');
  User.findOne({openid}, function (err, user) {
    if (err) {
      return callback(err);
    }
    if (!user) {
      const userObj = new User({
        openid,
        nickname: '',
        groups: []
      });
      userObj.save(function (err, result) {
        if (err) return callback(err);
        callback(null, result);
      });
    }
    callback(null, user);
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
