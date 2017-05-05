var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var User = require('../models/user');
var Card = require('../models/card');

/* GET users listing. */
router.get('/', function(req, res, next) {
	  res.render('admin/index', {
	  	title: '心方设计',
	  	layout: 'admin/layout_admin'
	  });
});

// 模板管理
router.get('/template', function(req, res, next){
	Card
	.find()
	.exec(function (err, data) {
		res.render('admin/template', {
			cards: data,
			title: '心方设计',
			layout: 'admin/layout_admin'
		})
	})
	
})


// 用户管理
router.get('/user', function(req, res, next){

	User
	.find()
	.exec(function(err, data){
		res.render('admin/user', {
			users: data,
			title: '心方设计',
			layout: 'admin/layout_admin'
		})
	})
})

//消息中心
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
