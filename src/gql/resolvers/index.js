'use strict';

const merge = require('lodash.merge');

const users = require('./users');
const auth = require('./auth');

module.exports = merge(
	users,
	auth
);
