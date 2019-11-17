const { merge } = require('lodash');

const users = require('./users');
const auth = require('./auth');

module.exports = merge(
	users,
	auth
);
