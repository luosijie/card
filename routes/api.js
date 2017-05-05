var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var User = require('../models/user');
var Card = require('../models/card');

// 设置CORS
// router.use(function(req, res, next){
// 	res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     res.header('Access-Control-Allow-Credentials','true');
//     next();
// })

// 删除数据
router.post('/delete', function(req, res, next){
	var type = req.query.type,
		id = req.query.id;

	if (type == 'template') {
		Card
		.findOne({_id: id})
		.exec(function(err, data){

			var coverFront = data.coverFront,
				coverBack = data.coverBack;
			console.log(coverFront);

			//删除封面图片
			fs.unlink(path.join(__dirname,'../public/coverImg/') + coverFront, function(err){
				if (err) {
					console.log(err);
				}else{
					console.log('文件删除成功');
				}
			});
			fs.unlink(path.join(__dirname,'../public/coverImg/') + coverBack, function(err){
				if (err) {
					console.log(err);
				}else{
					console.log('文件删除成功');
				}
			});

			// 删除数据库信息
			data.remove();
			res.send('1');

			console.log('cors测试数据');
			
		})

	}

})

module.exports = router;
