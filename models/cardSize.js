var mongoose = require('mongoose');
var Card = require('./card');
var Schema = mongoose.Schema;
var CardSizeSchema = new Schema({
	title: String, //标题
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
CardSizeSchema.pre('save', function(next){
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
})

var CardSize = mongoose.model('CardSize', CardSizeSchema);

module.exports = CardSize;