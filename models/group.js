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
    gainBeans: {
      type: Number,
      default: 0
    },
    remainBeans: {
      type: Number,
      default: 0
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
