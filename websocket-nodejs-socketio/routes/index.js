var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/:roomId/:userName', function(req, res, next) {
  res.render('game', { title: req.params.roomId });
});

module.exports = router;
