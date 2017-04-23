const express = require('express');
const router = express.Router();

router.post('/create_group', function(req, res, next) {
  const groupName = req.body.groupName;
  const groupPwd = req.body.groupPwd;
  console.log('群', groupName, groupPwd);
  res.status(200).send('respond with a resource');
});

router.post('/search_group', function(req, res, next) {
  const groupName = req.body.groupName;

  console.log('群', groupName);
  res.status(200).send('respond with a resource');
});

module.exports = router;
