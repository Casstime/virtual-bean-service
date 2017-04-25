const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String
  },
  members: [{
    userId: {
      type: Schema.Types.ObjectId
    },
    nickname: {
      type: String
    },
    role: {
      type: String
    }
  }]
}, {
  timestamps: true
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
