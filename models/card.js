var mongoose = require('mongoose');
var CardTheme = require('./cardTheme');
var CardTheme = require('./cardSize');
var Schema = mongoose.Schema;
var CardSchema = new Schema({
	title: String, //标题
	theme: {
		type: String,
		ref: 'CardTheme'
	}, 
	size: {
		type: String,
		ref: 'CardSize'
	}, 
	sideFront: String, //正面DOM
	sideBack: String, //反面DOM
	coverFront: String, //正面封面
	coverBack: String, //反面封面
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
})

//更新文档的最新时间
CardSchema.pre('save', function(next){
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
})

var Card = mongoose.model('Card', CardSchema);

module.exports = Card;