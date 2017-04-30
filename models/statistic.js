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
  beanCount: {
    type: Number,
    required: true
  }
},{
  timestamps: true
});

const Statistic = mongoose.model('Statistic', statisticSchema);

module.exports = Statistic;
