var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

var app = express();

var multiparty = require('multiparty');

var Card = require('../models/card');
var CardTheme = require('../models/cardTheme');
var CardSize = require('../models/cardSize');

var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  Card
  .find()
  .select('title coverFront theme')
  .sort('-meta.updateAt')
  .exec(function(err, data){
  	const length = 8;
  	var businessArry = [],
  		personalityArry = [];

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
  		title: '心方设计',
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
			title:'心方设计',
			tempCards: cards,
			editCard: editCard
			});
	})

	
})

/*GET tempcenter page.*/
router.get('/tempcenter', function(req, res, next){
	 Card
	  .find()
	  .sort('-meta.updateAt')
	  .exec(function(err, data){
	  	res.render('tempcenter', { 
	  		title: '心方设计',
	  		card: data 
	  	});
	  })
})

/*GET upload page.*/
router.get('/upload', function(req, res, next){
	res.render('upload',{title:'心方设计'});
})

router.get('/personal', function(req, res, next){
	res.render('personal',{title:'个人中心'});
})

// 处理文件上传
router.post('/uploadImages', function(req, res){
	var form = new multiparty.Form();
	form.parse(req, function(err, fields, files){
		var imgDatas = fields.editImg;
		var imgList = [];

		for(let i = 0; i < imgDatas.length; i++){
			elem = imgDatas[i].replace(/^data:image\/\w+;base64,/, '');
			var dataBuffer = new Buffer(elem, 'base64');
			var imgName = 'img' + Date.now() + i + '.png';
			//写入系统文件
			fs.writeFileSync(path.join(__dirname, '../public/tempImg/') + imgName , dataBuffer);
			imgList.push(imgName)
		}
		res.send(imgList);
	})
})

//存储封面信息
router.post('/uploadCovers', function(req, res){
	var form = new multiparty.Form();
	form.parse(req, function(err, fields, files){
		var imgDatas = fields.coverImg;
		var imgList = [];

		for(let i = 0; i < imgDatas.length; i++){
			elem = imgDatas[i].replace(/^data:image\/\w+;base64,/, '');
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
					cardTheme.cards.push(card._id);
					cardTheme.save();
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
						cardTheme.cards.push('2');
						cardTheme.save();
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
	.select('coverFront title')
	.sort('-meta.updateAt')
	.exec(function(err, data){
		if (err) {
			console.log(err);
		}else{
			res.send(data);
		}
	})
})

router.get('/getEditCard', function(req, res, next){
	var cardId = req.query.id;
	console.log(cardId);
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
		user.save();
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

module.exports = router;
