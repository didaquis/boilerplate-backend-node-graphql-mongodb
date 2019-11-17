const { Users } = require('../../data/models/index');
const { createAuthToken } = require('../auth/jwt');
const { authValidations } = require('../auth/validations');
const { securityVariablesConfig, globalVariablesConfig } = require('../../config/appConfig');

const bcrypt = require('bcrypt');

module.exports = {
	Query: {
		/**
		 * It allows to administrators users to list all users registered
		 */
		listAllUsers:  async (root, args, context) => {
			if (!authValidations.isLogged(context)) {
				//throw new Error('You must be logged in to perform this action');
				return null;
			}

			if (!authValidations.isAdmin(context)) {
				//throw new Error('You must be an administrator to perform this action');
				return null;
			}

			const users = await Users.find({});
			return users;
		}
	},
	/**
	 * It allows to users to register as long as the limit of allowed users has not been reached
	 */
	Mutation: {
		registerUser: async (root, { email, password }) => {

			const numberOfCurrentlyUsersRegistered = await Users.find().estimatedDocumentCount();

			if (authValidations.isLimitOfUsersReached(numberOfCurrentlyUsersRegistered, globalVariablesConfig.limitOfUsersRegistered)) {
				throw new Error('The maximum number of users allowed has been reached. You must contact the administrator of the service in order to register');
			}

			const isAnEmailAlreadyRegistered = await Users.findOne({email});

			if (isAnEmailAlreadyRegistered) {
				throw new Error('Data provided is not valid');
			}

			await new Users({email, password}).save();

			const user = await Users.findOne({email});

			return {
				token: createAuthToken({ email: user.email, isAdmin: user.isAdmin, isActive: user.isActive, uuid: user.uuid }, securityVariablesConfig.secret, securityVariablesConfig.timeExpiration)
			};
		},
		/**
		 * It allows users to authenticate. Users with property isActive with value false are not allowed to authenticate. When a user authenticates the value of lastLogin will be updated
		 */
		authUser: async (root, { email, password }) => {
			const user = await Users.findOne({email, isActive: true});

			if (!user) {
				throw new Error('User not found or login not allowed');
			}

			const isCorrectPassword = await bcrypt.compare(password, user.password);

			if (!isCorrectPassword) {
				throw new Error('Invalid credentials');
			}

			await Users.findOneAndUpdate({email}, { lastLogin: new Date().toISOString() }, { new: true });

			return {
				token: createAuthToken({ email: user.email, isAdmin: user.isAdmin, isActive: user.isActive, uuid: user.uuid }, securityVariablesConfig.secret, securityVariablesConfig.timeExpiration)
			};
		}
	}
};
