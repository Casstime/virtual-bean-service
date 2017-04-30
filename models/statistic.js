const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const statisticSchema = new Schema({
  groupId: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  fromUserId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUserId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  count: {
    type: Number,
    required: true
  },
  reason: {
    type: String
  }
},{
  timestamps: true
});

const Statistic = mongoose.model('Statistic', statisticSchema);

module.exports = Statistic;
