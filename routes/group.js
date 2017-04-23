const express = require('express');
const router = express.Router();

router.post('/create_group', function(req, res, next) {
  const groupName = req.query.groupName;
  const groupPwd = req.query.groupPwd;
  console.log('群', groupName, groupPwd);
  res.status(200).send('respond with a resource');
});

module.exports = router;
