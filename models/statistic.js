const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

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
  timestamps: true,
  toJSON: {virtuals: true}
});

statisticSchema.virtual('formatCreatedAt')
  .get(function () {
    return moment(this.createdAt).format('M月D日 HH:mm');
  });

const Statistic = mongoose.model('Statistic', statisticSchema);

module.exports = Statistic;
