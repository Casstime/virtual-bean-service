const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const co = require('co');
const Group = require('../models/group');
const User = require('../models/user');
const Statistic = require('../models/statistic');
const HttpError = require('../utils/HttpError');

router.post('/create', function (req, res, next) {
  const body = req.body;
  let beanCount;
  try {
    beanCount = parseInt(body.beanCount, 10);
  } catch (e) {
    return next(new HttpError(500, e.message));
  }
  const statistic = new Statistic({
    group: mongoose.Types.ObjectId(body.groupId),
    fromUser: mongoose.Types.ObjectId(body.fromUserId),
    toUser: mongoose.Types.ObjectId(body.toUserId),
    beanCount,
    reason: body.reason
  });
  statistic.save(function (err, result) {
    if (err) {
      console.warn('创建统计记录失败', err);
      return next(new HttpError('创建统计记录失败'));
    }
    console.log('创建统计记录成功', result);
    res.json(result);
  });
});

router.get('/:count', function (req, res, next) {
  let count = req.params.count;
  count = parseInt(count, 10) || 10;
  const groupId = req.query.groupId;
  const after = req.query.after;
  const before = req.query.before;
  if (!after && !before) {
    Statistic.find({
      group: mongoose.Types.ObjectId(groupId)
    }).populate('group', ['_id', 'name'])
      .populate('fromUser', ['_id', 'openid', 'nickname'])
      .populate('toUser', ['_id', 'openid', 'nickname'])
      .limit(count).sort('-createdAt').exec(function (err, records) {
      if (err) {
        console.warn(`获取最近${count}条记录出错`, err);
        return next(new HttpError(500, `获取最近${count}条记录出错`));
      }
      console.log(`获取最近${count}条记录成功`, records);
      res.json(records);
    });
  } else if (after) {
    Statistic.find({
      group: mongoose.Types.ObjectId(groupId),
      createdAt: {$gt: after}
    }).populate('group', ['_id', 'name'])
      .populate('fromUser', ['_id', 'openid', 'nickname'])
      .populate('toUser', ['_id', 'openid', 'nickname'])
      .limit(count).sort('-createdAt').exec(function (err, records) {
      if (err) {
        console.warn(`获取最近${count}条记录出错`, err);
        return next(new HttpError(500, `获取最近${count}条记录出错`));
      }
      console.log(`获取最近${count}条记录成功`, records);
      res.json(records);
    });
  } else {
    Statistic.find({
      group: mongoose.Types.ObjectId(groupId),
      createdAt: {$lt: before}
    }).populate('group', ['_id', 'name'])
      .populate('fromUser', ['_id', 'openid', 'nickname'])
      .populate('toUser', ['_id', 'openid', 'nickname'])
      .limit(count).sort('-createdAt').exec(function (err, records) {
      if (err) {
        console.warn(`获取最近${count}条记录出错`, err);
        return next(new HttpError(500, `获取最近${count}条记录出错`));
      }
      console.log(`获取最近${count}条记录成功`, records);
      res.json(records);
    });
  }
});

module.exports = router;
