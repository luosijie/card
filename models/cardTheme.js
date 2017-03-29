var mongoose = require('mongoose');
var Card = require('./card');
var Schema = mongoose.Schema;
var CardThemeSchema = new Schema({
	title: {
		type: String,
		unique: true
	}, //标题
	cards: [{
		type: Schema.Types.ObjectId,
		ref: 'Card'
	}],
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
CardThemeSchema.pre('save', function(next){
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
})

var CardTheme = mongoose.model('CardTheme', CardThemeSchema);

module.exports = CardTheme;