'use strict';

import { UserInputError } from 'apollo-server-express';
import bcrypt from 'bcrypt';

import { Users } from '../../data/models/index.js';
import { createAuthToken } from '../auth/jwt.js';
import { authValidations } from '../auth/authValidations.js';
import { isValidEmail, isStrongPassword } from '../../helpers/validations.js';
import { securityVariablesConfig, globalVariablesConfig } from '../../config/appConfig.js';

/**
 * All resolvers related to auth
 * @type {Object}
 */
export default {
	Query: {
	},
	Mutation: {
		/**
		 * It allows to users to register as long as the limit of allowed users has not been reached
		 */
		registerUser: async (parent, { email, password }) => {
			if (!email || !password) {
				throw new UserInputError('Data provided is not valid');
			}

			if (!isValidEmail(email)) {
				throw new UserInputError('The email is not valid');
			}

			if (!isStrongPassword(password)) {
				throw new UserInputError('The password is not secure enough');
			}

			const numberOfCurrentlyUsersRegistered = await Users.find().estimatedDocumentCount();

			authValidations.ensureLimitOfUsersIsNotReached(numberOfCurrentlyUsersRegistered, globalVariablesConfig.limitOfUsersRegistered);

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
		authUser: async (parent, { email, password }) => {
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
