const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const co = require('co');
const Group = require('../models/group');
const User = require('../models/user');
const HttpError = require('../util/HttpError');
const {
  findGroupById,
  findUserByOpenid,
  groupInsertUser,
  userInsertGroup,
  updateGroupMembers
} = require('../services/db');

router.get('/list', function (req, res, next) {
  const openid = req.query.openid;
  User.findOne({openid}).populate('groups', ['_id', 'name']).exec(function (err, user) {
    if (err) return next(err);
    console.log('获取用户的群列表', user);
    const groups = user ? user.groups : [];
    res.json(groups);
  })
});

router.get('/:groupId', function (req, res, next) {
  const groupId = req.params.groupId;
  Group.findOne({_id: mongoose.Types.ObjectId(groupId)}, function (err, group) {
    if (err) return next(err);
    console.log('获取群信息', group);
    res.json(group);
  });
});

router.post('/create_group', function(req, res, next) {
  const openid = req.body.openid;
  const nickname = req.body.nickname;
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
      members: [{
        userId: user._id,
        nickname,
        gainBeans: 0,
        remainBeans: 50,
        role: 'MASTER'
      }]
    });
    group.save(function (err, result) {
      if (err) return next(err);
      const groups = user.groups;
      groups.push(result._id);
      User.update({_id: user._id}, {$set: {groups: groups}}, function (err, updateResult) {
        if (err) return next(err);
        res.json(updateResult);
      });
    });
  });
});

router.post('/search_group', function(req, res, next) {
  const groupName = req.body.groupName || '';
  console.log('群名', req.body, groupName);
  Group.find({name: {$regex: groupName, $options:'i'}}, {password: 0}, function (err, groups) {
    if (err) {
      return next(err);
    }
    console.log('groups', groups);
    res.status(200).json(groups);
  });
});

router.post('/join_group', function(req, res, next) {
  const body = req.body;
  const openid = body.openid;
  const nickname = body.nickname;
  const groupId = body.groupId;
  const password = body.password || '';
  console.log('密码', body, password);
  co(function* () {
    const group = yield findGroupById(groupId);
    if (password !== group.password) {
      throw new Error('加群密码错误！');
    }
    const user = yield findUserByOpenid(openid);
    yield groupInsertUser(group._id, group.members, user, nickname);
    yield userInsertGroup(user._id, user.groups, group._id);
    res.status(200).send('加群成功');
  }).catch((err) => {
    console.log(`加入群${groupId}失败`, err);
    next(new HttpError(500, err));
  });
});

router.post('/reset/gain_beans', function (req, res, next) {
  const body = req.body;
  const count = body.count || 0;
  const groupId = body.groupId;
  co(function* () {
    const group = yield findGroupById(groupId);
    const members = group.members;
    const resetedMembers = members.map((member) => {
      member.gainBeans = count;
      return member;
    });
    const result = yield updateGroupMembers(group._id, resetedMembers);
    res.json(result);
  }).catch((err) => {
    console.warn('重置获得豆子数失败', err);
    next(new HttpError(500, '重置获得豆子数失败'));
  });
});

router.post('/reset/remain_beans', function (req, res, next) {
  const body = req.body;
  const count = body.count || 50;
  const groupId = body.groupId;
  co(function* () {
    const group = yield findGroupById(groupId);
    const members = group.members;
    const resetedMembers = members.map((member) => {
      member.remainBeans = count;
      return member;
    });
    const result = yield updateGroupMembers(group._id, resetedMembers);
    res.json(result);
  }).catch((err) => {
    console.warn('重置剩余豆子数失败', err);
    next(new HttpError(500, '重置剩余豆子数失败'));
  });
});

module.exports = router;
