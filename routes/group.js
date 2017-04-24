const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Group = require('../models/group');
const User = require('../models/user');
const HttpError = require('../utils/HttpError');

router.post('/create_group', function(req, res, next) {
  const openid = req.body.openid;
  const groupName = req.body.groupName;
  const groupPwd = req.body.groupPwd;
  console.log('群', groupName, groupPwd);
  User.findOne({openid}, function (err, user) {
    if (err) {
      return next(err);
    }
    const group = new Group({
      name: groupName,
      password: groupPwd,
      members: [{_id: user._id}]
    });
    group.save(function (err, result) {
      if (err) {
        return next(err);
      }
      res.json(result);
    });
  });
});

router.post('/search_group', function(req, res, next) {
  const groupName = req.body.groupName || '';
  console.log('群名', req.body, groupName);
  Group.find({name: {$regex: groupName, $options:'i'}}, {members: 0}, function (err, groups) {
    if (err) {
      return next(err);
    }
    console.log('groups', groups);
    res.status(200).json(groups);
  });
});

router.post('/join_group', function(req, res, next) {
  const body = req.body;
  const groupId = body.groupId;
  const password = body.password || '';
  console.log('密码', body, password);
  Group.findOne({_id: mongoose.Types.ObjectId(groupId), password}, function (err, group) {
    if (err) {
      return next(err);
    }
    console.log('groups', group);
    if (!group) {
      return next(new HttpError(403, '密码错误'));
    }
    res.status(200).send('加群成功');
  });
});

module.exports = router;
