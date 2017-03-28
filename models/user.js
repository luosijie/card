var mongoose = require('mongoose');
var Schema = mongoose.Schema; 
var bcrypt = require('bcryptjs');

var UserSchema = new Schema({
	username: {
		type: String,
		unique: true
	},
	email: String,
	password: String,
	collections: {
		type: Schema.ObjectId,
		ref: 'card'

	},
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

UserSchema.pre('save', function(next){
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}


	var self = this;
	//密码加密存储
	bcrypt.genSalt(10, function(err, salt){
		bcrypt.hash(self.password, salt, function(err, hash){
			self.password = hash;
			console.log(self.password);
			next(); 
		})
	})

})

UserSchema.methods.comparePassword = function(candidatePassword, cb){
	var self = this;
	bcrypt.compare(candidatePassword, self.password, function(err, isMatch){
			cb(null, isMatch);
	});
};

var User = mongoose.model('User', UserSchema);

module.exports = User;