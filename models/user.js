const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  openid: {
    type: String
  },
  nickname: {
    type: String
  },
  gainBeans: {
    type: Number,
    default: 0
  },
  remainBeans: {
    type: Number,
    default: 0
  },
  groups: [{
    type: Schema.Types.ObjectId,
    ref: 'Group'
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
        gainBeans: 0,
        remainBeans: 0,
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
