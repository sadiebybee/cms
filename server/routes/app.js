var express = require('express');
var path = require('path');
var router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/cms/browser/index.html'));
});

module.exports = router;
