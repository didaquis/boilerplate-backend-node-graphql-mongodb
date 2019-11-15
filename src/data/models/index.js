const mongoose = require('mongoose');

const { UsersSchema } = require('./schemas');

module.exports = {
	Users: mongoose.model('users', UsersSchema)
};