const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt');

const UsuariosSchema = new Schema({
	usuario: { 
		type: String,
		required: true,
		unique: true
	},
	password: { 
		type: String,
		required: true
	}
});

// Hash the password of user before save on database
UsuariosSchema.pre('save', function (next) {
	if (!this.isModified('password')) {
		return next();
	}
	bcrypt.genSalt((err, salt) => {
		if (err) {
			return next(err);
		}
		bcrypt.hash(this.password, salt, (err, hash) => {
			if (err) {
				return next(err);
			}
			this.password = hash;
			next();
		});
	});
});

module.exports = UsuariosSchema;