"use strict";
var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

var bcrypt = require('bcryptjs');

var multiparty = require('multiparty');

var Card = require('../models/card');
var CardTheme = require('../models/cardTheme');
var CardSize = require('../models/cardSize');
var User = require('../models/user');

/* GET home page. */

router.get('/', function(req, res, next) {

  Card
  .find()
  .lean()
  .select('coverFront theme title collector')
  .sort('-meta.updateAt')
  .exec(function(err, data){
  	const length = 8;
  	var businessArry = [],
  		personalityArry = [];

  	for(let i = 0; i < data.length; i++){
  		var collector = data[i].collector;
  		if (collector) {
  			for(let j = 0; j < collector.length; j++){

  				if (req.session.user) {
  					var _username = req.session.user.username;
  					if (collector[j] == _username) {
		  				data[i].flag = '1';
		  				
		  			}
  				}
	  			
	  		}
  		}
  		
  	}


	for(let i = 0; i<data.length; i++){
			  				
		if (data[i].theme == 'business') {
			if (businessArry.length < length) {
				businessArry.push(data[i]);
			}
		}
		if (data[i].theme == 'personality') {
			if(personalityArry.length < length){
				personalityArry.push(data[i]);
			}
		}
	}

  	res.render('index', { 
  		title: 'Card',
  		business: businessArry,
  		personality: personalityArry
  	});
  })
  
});

/*GET useredit page.*/
router.get('/edituser(/:name)?', function(req, res, next){
	Card
	.find()
	.select('coverFront sideFront sideBack')
	.sort('-meta.updateAt')
	.exec(function(err, cards){
		var editCard
		cards.forEach(function(elem){
			if (elem._id == req.params.name) {
				editCard = elem
			}
		})
		res.render('edituser',{
			title:'Card',
			tempCards: cards,
			editCard: editCard
			});
	})

	
})

/*GET tempcenter page.*/
router.get('/tempcenter', function(req, res, next){
	 Card
	  .find()
	  .select('coverFront title collector')
	  .sort('-meta.updateAt')
	  .exec(function(err, data){

	  	for(let i = 0; i < data.length; i++){
	  		var collector = data[i].collector;
	  		if (collector) {
	  			for(let j = 0; j < collector.length; j++){

	  				if (req.session.user) {
	  					var _username = req.session.user.username;
	  					if (collector[j] == _username) {
			  				data[i].flag = '1';
			  				
			  			}
	  				}
		  			
		  		}
	  		}
	  		
	  	}

	  	res.render('tempcenter', { 
	  		title: 'Card',
	  		card: data 
	  	});
	  })
})

/*GET upload page.*/
router.get('/upload', function(req, res, next){

	if (req.session.user.username && req.session.user.username == 'admin') {
		res.render('upload',{title:'Card'});
	}else{
		res.redirect('/');
	}
})

router.get('/personal', function(req, res, next){
	if (req.session.user) {
		var _username = req.session.user.username;
		Card.find(function(err, cards){
			User.findOne({username: _username})
			.select('collections')
			.populate('collections','coverFront title collector')
			.exec(function(err, user){
				res.render('personal',{
					title:'个人中心',
					collections: user.collections
				});
			})
			
		})	
	}else{
		res.redirect('/');
	}
})

// 处理文件上传
router.post('/uploadImages', function(req, res){
	var form = new multiparty.Form();
	console.log('uploadImgages');
	form.parse(req, function(err, fields, files){
		var imgDatas = fields.editImg;
		var imgList = [];

		for(let i = 0; i < imgDatas.length; i++){
			var elem = imgDatas[i].replace(/^data:image\/\w+;base64,/, '');
			var dataBuffer = new Buffer(elem, 'base64');
			var imgName = 'img' + Date.now() + i + '.png';
			//写入系统文件
			fs.writeFileSync(path.join(__dirname, '../public/tempImg/') + imgName , dataBuffer);
			imgList.push(imgName);
			console.log('uploadTempImg');
		}
		res.send(imgList);
	})
})

//存储封面信息
router.post('/uploadCovers', function(req, res){
	var form = new multiparty.Form();
	console.log('uploadCovers');
	form.parse(req, function(err, fields, files){
		var imgDatas = fields.coverImg;
		var imgList = [];

		for(let i = 0; i < imgDatas.length; i++){
			var elem = imgDatas[i].replace(/^data:image\/\w+;base64,/, '');
			var dataBuffer = new Buffer(elem, 'base64');
			var imgName = 'cover' + Date.now() + i + '.png';
			//写入系统文件
			fs.writeFileSync(path.join(__dirname, '../public/coverImg/') + imgName , dataBuffer);
			imgList.push(imgName)
		}
		res.send(imgList);
	})
})

//上传名片Dom信息
router.post('/uploadDom', function(req, res){
	var form = new multiparty.Form();
	console.log('uploadDom');
	form.parse(req, function(err, fields, files){
		
		CardTheme.findOne({title: fields.theme[0]}, function(err, cardTheme){
			if (cardTheme) {
				var card = new Card({
					title: fields.title[0], //标题
					theme: cardTheme.title,
					// size: {
					// 	type: String,
					// 	ref: 'CardSize'
					// }, 
					sideFront: fields.sideFront[0], //正面DOM
					sideBack: fields.sideBack[0], //反面DOM
					coverFront: fields.coverFront[0], //正面封面
					coverBack: fields.coverBack[0], //反面封面
				})  
				card.save(function(err){
					if (err) {
						console.log(err);
					}else{
					  cardTheme.cards.push(card._id);
						cardTheme.save();
						res.send('1');	
					}
				});
			}else{
				var cardTheme = new CardTheme({
					title: fields.theme[0]
				})
				cardTheme.save(function(err){
					var card = new Card({
						title: fields.title[0], //标题
						theme: cardTheme.title,
						// size: {
						// 	type: String,
						// 	ref: 'CardSize'
						// }, 
						sideFront: fields.sideFront[0], //正面DOM
						sideBack: fields.sideBack[0], //反面DOM
						coverFront: fields.coverFront[0], //正面封面
						coverBack: fields.coverBack[0], //反面封面
					})
					card.save(function(err){
						if (err) {
							console.log(err);
						}else{
							cardTheme.cards.push(card._id);
							cardTheme.save();
							res.send('1');
						}
					});
				})
			}
		})
	})
})

//通过分类获取名片模板列表
router.get('/getcards', function(req, res, next){
	var type = req.query.type;

	var themeFilter = {}; //定义一个主题过滤器
	themeFilter.theme = type;
	if (type == 'all') {
		themeFilter = ''
	}

	Card
	.find(themeFilter)
	.lean()
	.select('coverFront title collector')
	.sort('-meta.updateAt')
	.exec(function(err, data){

		for(let i = 0; i < data.length; i++){
	  		var collector = data[i].collector;
	  		if (collector) {
	  			for(let j = 0; j < collector.length; j++){

	  				if (req.session.user) {
	  					var _username = req.session.user.username;
	  					if (collector[j] == _username) {
			  				data[i].flag = '1';
			  			}
	  				}
		  			
		  		}
	  		}
	  	}
		if (err) {
			console.log(err);
		}else{
			res.send(data);
		}
	})
})

router.get('/getEditCard', function(req, res, next){
	var cardId = req.query.id;
	
	Card
	.findOne({_id: cardId})
	.select('sideFront sideBack')
	.exec(function(err, data){
		if (err) {
			console.log(err);
		}else{
			res.send(data);
		}
	})
})

router.post('/regist', function(req, res, next){
	var form = new multiparty.Form();
	form.parse(req, function(err, fields, files){
		var user = new User({
			username: fields.regname[0],
			email: fields.mailaddress[0],
			password: fields.password[0]
		})
		user.save(function(err){
			if (err) {
				console.log(err)
			}else{
				console.log('注册成功');
			}
		});
		res.send('1');//注册成功
	})
})

//用户登录
router.post('/login', function(req, res, next){
	var form = new multiparty.Form();
	form.parse(req, function(err, fields, files){
		
		User.findOne({username: fields.loginname[0]})
		.exec(function(err, user){
			if (user) {
				user.comparePassword(fields.loginpassword[0],function(err, isMatch){
					if (err) {
						console.log(err)
					}else if (isMatch) {
						req.session.user =  user;
						res.send('1');//登录成功
					}else{
						res.send('0');//密码不匹配
					}
				})	
			}else{
				res.send('-1');//用户名不存在
			}
			
		})
	})
})

router.get('/logout', function(req, res){
	delete req.session.user;
	res.redirect('/');
})

//注册检测用户名是否可用
router.post('/checkusername', function(req,res, next){
	User.findOne({username: req.body.username})
	.select('username')
	.exec(function(err, user){
		if (user) {
			res.send('0');
		}else{
			res.send('1');
		}
	})
})

router.post('/addcollection', function(req, res, next){
	var cardId = req.body.cardId;
	
	if (req.session.user) {
		var username = req.session.user.username;

		var promise = new Promise(function(resolve, reject){
		
			Card.findOne({_id: cardId})
			.exec(function(err, card){
				if (card) {
					card.collector.push(username);
					card.save();
					resolve();
				}else{
					reject();
					res.send('0');
				}
			});

		})

		promise.then(function(){
			User.findOne({username: username})
			.exec(function(err, user){
				if (user) {
					user.collections.push(cardId);
					user.save();
					res.send('1');
				}else{
					res.send('0');
				}
			});
		})
	}else{
		res.send('-1');
	}

	
})

router.post('/deletecollection', function(req, res, next){
	var cardId = req.body.cardId;
	var username = req.session.user.username;

	var promise = new Promise(function(resolve, reject){

		Card.findOne({_id: cardId})
		.exec(function(err, card){
			if (card) {
				card.collector.remove(username);
				card.save();
				resolve();
			}else{
				reject(err);
				res.send('0');
			}
		});

	})

	promise.then(function(){
		User.findOne({username: username})
		.exec(function(err, user){
			if (user) {
				user.collections.remove(cardId);
				user.save();
				res.send('1');
			}else{
				res.send('0');
				console.log(err);
			}
		});
	})

})

router.post('/checkemail', function(req, res){
	var email = req.body.email;
	if (req.session.user) {
		var username = req.session.user.username;
		User.findOne({username: username})
		.exec(function(err, user){
			user.email = email;
			user.save(function(err){
				if (err) {
					res.send('0');
				}else{
					res.send('1');
					req.session.user = user;
				}
			});
		})
	}
})

router.post('/checkpassword', function(req, res){
	var originpassword = req.body.originpassword;
	var newpassword = req.body.newpassword;

	if (req.session.user) {
		var username = req.session.user.username;
		User.findOne({username: username})
		.exec(function(err, user){

			bcrypt.compare(originpassword, user.password, function(err, isMatch){
				if (isMatch) {
					var hash = bcrypt.hashSync(newpassword, 10);
					user.password = hash;
					user.save();
					res.send('1');
				}else if (!isMatch){
					res.send('0');
				}else{
					res.send('-1');
				}
			});

		})
	}
})

module.exports = router;
