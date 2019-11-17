const { Users } = require('../../data/models/index');
const { authValidations } = require('../auth/validations');

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
	}
};
