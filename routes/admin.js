var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/index', {
  	title: '心方设计',
  	layout: 'admin/layout_admin'
  });
});

router.get('/template', function(req, res, next){
	res.render('admin/template', {
		title: '心方设计',
		layout: 'admin/layout_admin'
	})
})

router.get('/user', function(req, res, next){
	res.render('admin/user', {
		title: '心方设计',
		layout: 'admin/layout_admin'
	})
})

router.get('/message', function(req, res, next){
	res.render('admin/message',{
		title: '心方设计',
		layout: 'admin/layout_admin'
	})
})


module.exports = router;
