const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const statisticSchema = new Schema({
  group: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  fromUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  beanCount: {
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
