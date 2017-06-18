var mongoose = require('mongoose');
var Schema = mongoose.Schema; 
var bcrypt = require('bcryptjs');

var Card = require('./card');

var UserSchema = new Schema({
	username: {
		type: String,
		unique: true
	},
	email: String,
	password: String,

	collections: [{
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

UserSchema.pre('save', function(next){

	if (this.isNew) {

		this.meta.createAt = this.meta.updateAt = Date.now();

		var self = this;
		//密码加密存储
		bcrypt.genSalt(10, function(err, salt){
			bcrypt.hash(self.password, salt, function(err, hash){
				self.password = hash;
				console.log(self.password);
				next(); 
			})
		})

	}else{
		this.meta.updateAt = Date.now();
		next(); 
	}

	

})

UserSchema.methods.comparePassword = function(candidatePassword, cb){
	var self = this;
	bcrypt.compare(candidatePassword, self.password, function(err, isMatch){
			console.log(candidatePassword);
			console.log('原始密码:54luoluo\n' + self.password);

			var salt = self.password.substring(0, 29);

			console.log(bcrypt.hashSync(candidatePassword, salt));

			cb(null, isMatch);
	});
};

var User = mongoose.model('User', UserSchema);

module.exports = User;