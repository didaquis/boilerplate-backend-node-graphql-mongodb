const { ForbiddenError } = require('apollo-server-express');

const { Users } = require('../../data/models/index');
const { authValidations } = require('../auth/validations');

/**
 * All resolvers related to users
 * @type {Object}
 */
module.exports = {
	Query: {
		/**
		 * It allows to administrators users to list all users registered
		 */
		listAllUsers:  async (root, args, context) => {
			if (!authValidations.isLogged(context)) {
				throw new ForbiddenError('You must be logged in to perform this action');
			}

			if (!authValidations.isAdmin(context)) {
				throw new ForbiddenError('You must be an administrator to perform this action');
			}

			const users = await Users.find({});
			return users;
		}
	},
	Mutation: {
	}
};
