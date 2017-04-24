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

const User = mongoose.model('User', userSchema);

module.exports = User;
