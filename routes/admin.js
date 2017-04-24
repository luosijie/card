var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/index', {
  	title: '心方设计',
  	layout: 'null'
  });
});



module.exports = router;
