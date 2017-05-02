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

//返回新用户数
router.get('/newuser', function(req, res, next){

	res.send('536');
})
//返回浏览量
router.get('/pageview', function(req, res, next){

	res.send('325');
})
//返回模板数量
router.get('/tempnum', function(req, res, next){

	res.send('5369');
})
//返回总用户数
router.get('/totaluser', function(req, res, next){

	res.send('958');
})


module.exports = router;
