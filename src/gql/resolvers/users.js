import { authValidations } from '../auth/authValidations.js';

/**
 * All resolvers related to users
 * @typedef {Object}
 */
export default {
	Query: {
		/**
		 * It allows to administrators users to list all users registered
		 */
		listAllUsers:  async (parent, args, context) => {
			authValidations.ensureThatUserIsLogged(context);

			authValidations.ensureThatUserIsAdministrator(context);

			return context.di.model.Users.find({});
		}
	},
	Mutation: {
	}
};
