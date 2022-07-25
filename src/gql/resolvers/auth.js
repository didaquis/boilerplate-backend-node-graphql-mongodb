import { UserInputError } from 'apollo-server-express';
import bcrypt from 'bcrypt';

import { isValidEmail, isStrongPassword } from '../../helpers/validations.js';

/**
 * All resolvers related to auth
 * @typedef {Object}
 */
export default {
	Query: {
	},
	Mutation: {
		/**
		 * It allows to users to register as long as the limit of allowed users has not been reached
		 */
		registerUser: async (parent, { email, password }, context) => {
			if (!email || !password) {
				throw new UserInputError('Data provided is not valid');
			}

			if (!isValidEmail(email)) {
				throw new UserInputError('The email is not valid');
			}

			if (!isStrongPassword(password)) {
				throw new UserInputError('The password is not secure enough');
			}

			const registeredUsersCount = await context.di.model.Users.find().estimatedDocumentCount();

			context.di.authValidation.ensureLimitOfUsersIsNotReached(registeredUsersCount);

			const isAnEmailAlreadyRegistered = await context.di.model.Users.findOne({ email }).lean();

			if (isAnEmailAlreadyRegistered) {
				throw new UserInputError('Data provided is not valid');
			}

			await new context.di.model.Users({ email, password }).save();

			const user = await context.di.model.Users.findOne({ email }).lean();

			return {
				token: context.di.jwt.createAuthToken(user.email, user.isAdmin, user.isActive, user.uuid)
			};
		},
		/**
		 * It allows users to authenticate. Users with property isActive with value false are not allowed to authenticate. When an user authenticates the value of lastLogin will be updated
		 */
		authUser: async (parent, { email, password }, context) => {
			if (!email || !password) {
				throw new UserInputError('Invalid credentials');
			}

			const user = await context.di.model.Users.findOne({ email, isActive: true }).lean();

			if (!user) {
				throw new UserInputError('User not found or login not allowed');
			}

			const isCorrectPassword = await bcrypt.compare(password, user.password);

			if (!isCorrectPassword) {
				throw new UserInputError('Invalid credentials');
			}

			await context.di.model.Users.findOneAndUpdate({ email }, { lastLogin: new Date().toISOString() }, { new: true }).lean();

			return {
				token: context.di.jwt.createAuthToken(user.email, user.isAdmin, user.isActive, user.uuid)
			};
		},
		/**
		 * It allows to user to delete their account permanently (this action does not delete the records associated with the user, it only deletes their user account)
		 */
		deleteMyUserAccount:  async (parent, args, context) => {
			context.di.authValidation.ensureThatUserIsLogged(context);

			const user = await context.di.authValidation.getUser(context);

			return context.di.model.Users.deleteOne({ uuid: user.uuid });
		}
	}
};
