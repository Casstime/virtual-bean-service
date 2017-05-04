const express = require('express');
const router = express.Router();
const config = require('config');
const rp = require('request-promise');
const co = require('co');
const User= require('../models/user');

router.get('/', function (req, res, next) {
  res.json({});
});

module.exports = router;
