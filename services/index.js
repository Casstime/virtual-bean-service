const mongoose = require('mongoose');
const User = require('../models/user');
const Group = require('../models/group');

function findGroupById(groupStrId) {
  return new Promise((resolve, reject) => {
    Group.findOne({_id: mongoose.Types.ObjectId(groupStrId)}, function (err, group) {
      if (err) return reject(err);
      resolve(group);
    });
  });
}

function findUserByOpenid(openid) {
  return new Promise((resolve, reject) => {
    User.findOne({openid}, function (err, user) {
      if (err) return reject(err);
      resolve(user);
    });
  });
}

function groupInsertUser(groupObjectId, groupMembers, user, nickname) {
  return new Promise((resolve, reject) => {
    const u = {
      userId: user._id,
      nickname,
      gainBeans: 0,
      remainBeans: 50,
      role: 'MEMBER'
    };
    groupMembers.push(u);
    Group.update({_id: groupObjectId}, {$set: {members: groupMembers}}, function (err, result) {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

function userInsertGroup(userObjectId, userGroups, groupObjectId) {
  return new Promise((resolve, reject) => {
    userGroups.push(groupObjectId);
    User.update({_id: userObjectId}, {$set: {groups: userGroups}}, function (err, result) {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

function updateGroupMembers(groupObjectId, members) {
  return new Promise((resolve, reject) => {
    Group.update({_id: groupObjectId}, {$set: {members}}, function (err, result) {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

function saveStatistic(statistic) {
  return new Promise((resolve, reject) => {
    statistic.save((err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

function getGroupMembersById(groupObjId) {
  return new Promise((resolve, reject) => {
    Group.findOne({_id: groupObjId}, function (err, result) {
      if (err) return reject(err);
      resolve(result.members);
    });
  });
}


module.exports = {
  findGroupById, findUserByOpenid, groupInsertUser, userInsertGroup, updateGroupMembers,
  saveStatistic, getGroupMembersById
};
