'use strict';

const { ValidationError, UserInputError } = require('apollo-server-express');

const { Users } = require('../../data/models/index');
const { createAuthToken } = require('../auth/jwt');
const { authValidations } = require('../auth/validations');
const { securityVariablesConfig, globalVariablesConfig } = require('../../config/appConfig');

const bcrypt = require('bcrypt');

/**
 * All resolvers related to auth
 * @type {Object}
 */
module.exports = {
	Query: {
	},
	Mutation: {
		/**
		 * It allows to users to register as long as the limit of allowed users has not been reached
		 */
		registerUser: async (root, { email, password }) => {
			if (!email || !password) {
				throw new UserInputError('Data provided is not valid');
			}

			if (!authValidations.isValidEmail(email)) {
				throw new UserInputError('The email is not valid');
			}

			if (!authValidations.isStrongPassword(password)) {
				throw new UserInputError('The password is not secure enough');
			}

			const numberOfCurrentlyUsersRegistered = await Users.find().estimatedDocumentCount();

			if (authValidations.isLimitOfUsersReached(numberOfCurrentlyUsersRegistered, globalVariablesConfig.limitOfUsersRegistered)) {
				throw new ValidationError('The maximum number of users allowed has been reached. You must contact the administrator of the service in order to register');
			}

			const isAnEmailAlreadyRegistered = await Users.findOne({email});

			if (isAnEmailAlreadyRegistered) {
				throw new UserInputError('Data provided is not valid');
			}

			await new Users({email, password}).save();

			const user = await Users.findOne({email});

			return {
				token: createAuthToken({ email: user.email, isAdmin: user.isAdmin, isActive: user.isActive, uuid: user.uuid }, securityVariablesConfig.secret, securityVariablesConfig.timeExpiration)
			};
		},
		/**
		 * It allows users to authenticate. Users with property isActive with value false are not allowed to authenticate. When an user authenticates the value of lastLogin will be updated
		 */
		authUser: async (root, { email, password }) => {
			if (!email || !password) {
				throw new UserInputError('Invalid credentials');
			}

			const user = await Users.findOne({email, isActive: true});

			if (!user) {
				throw new UserInputError('User not found or login not allowed');
			}

			const isCorrectPassword = await bcrypt.compare(password, user.password);

			if (!isCorrectPassword) {
				throw new UserInputError('Invalid credentials');
			}

			await Users.findOneAndUpdate({email}, { lastLogin: new Date().toISOString() }, { new: true });

			return {
				token: createAuthToken({ email: user.email, isAdmin: user.isAdmin, isActive: user.isActive, uuid: user.uuid }, securityVariablesConfig.secret, securityVariablesConfig.timeExpiration)
			};
		}
	}
};
