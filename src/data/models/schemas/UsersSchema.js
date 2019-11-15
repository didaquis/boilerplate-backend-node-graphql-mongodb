const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt');

const UsersSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true
	},
	password: {
		type: String,
		required: true
	},
	isAdmin: {
		type: Boolean,
		default: false
	},
	isActive: {
		type: Boolean,
		default: true
	},
	registrationDate: {
		type: Date,
		default: Date.now
	},
	lastLogin: {
		type: Date,
		default: Date.now
	}
});

// Hash the password of user before save on database
UsersSchema.pre('save', function (next) {
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

module.exports = UsersSchema;
