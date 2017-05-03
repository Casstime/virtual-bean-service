const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const co = require('co');
const Group = require('../models/group');
const User = require('../models/user');
const Statistic = require('../models/statistic');
const HttpError = require('../utils/HttpError');
const {
  saveStatistic,
  getGroupMembersById,
  updateGroupMembers
} = require('../services');

router.post('/create', function (req, res, next) {
  const body = req.body;
  const groupId= mongoose.Types.ObjectId(body.groupId);
  const fromUserId = mongoose.Types.ObjectId(body.fromUserId);
  const toUserId = mongoose.Types.ObjectId(body.toUserId);
  let beanCount;
  try {
    beanCount = parseInt(body.beanCount, 10);
  } catch (e) {
    return next(new HttpError(500, e.message));
  }
  const statistic = new Statistic({
    group: groupId,
    fromUser: fromUserId,
    toUser: toUserId,
    beanCount,
    reason: body.reason
  });
  co(function* () {
    const result = yield saveStatistic(statistic);
    let members = yield getGroupMembersById(groupId);
    console.log(`获取群组${body.groupId}的成员列表`, members)
    members = members.map((item) => {
      if (item.userId === body.fromUserId) {
        item.remainBeans -= beanCount;
      }
      if (item.userId === body.toUserId) {
        item.gainBeans += beanCount;
      }
      return item;
    });
    yield updateGroupMembers(groupId, members);
    console.log('创建统计记录成功', result, members);
    res.json(result);
  }).catch(err => {
    console.warn('创建统计记录失败', err);
    next(new HttpError('创建统计记录失败'));
  });
});

router.get('/', function (req, res, next) {
  let count = req.query.count;
  let pager = req.query.pager;
  count = parseInt(count, 10) || 10;
  pager = parseInt(pager, 10) || 1;
  const skipCount = (pager - 1) * count;
  const groupId = req.query.groupId;
  Statistic.find({group: mongoose.Types.ObjectId(groupId)}).count(function (err, c) {
    if (err) {
      console.warn(`获取最近${count}条记录出错`, err);
      return next(new HttpError(500, `获取最近${count}条记录出错`));
    }
    if (skipCount >= c) {
      res.json([]);
    } else {
      Statistic.find({
        group: mongoose.Types.ObjectId(groupId)
      }).populate('group', ['_id', 'name'])
        .populate('fromUser', ['_id', 'openid', 'nickname'])
        .populate('toUser', ['_id', 'openid', 'nickname'])
        .sort('-createdAt').skip(skipCount).limit(count).exec(function (err, records) {
        if (err) {
          console.warn(`获取最近${count}条记录出错`, err);
          return next(new HttpError(500, `获取最近${count}条记录出错`));
        }
        console.log(`获取最近${count}条记录成功`, records);
        res.json(records);
      });
    }
  });
});

module.exports = router;
