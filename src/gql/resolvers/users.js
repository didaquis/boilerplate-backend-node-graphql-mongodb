'use strict';

import { Users } from '../../data/models/index.js';
import { authValidations } from '../auth/authValidations.js';

/**
 * All resolvers related to users
 * @type {Object}
 */
export default {
	Query: {
		/**
		 * It allows to administrators users to list all users registered
		 */
		listAllUsers:  async (parent, args, context) => {
			authValidations.ensureThatUserIsLogged(context);

			authValidations.ensureThatUserIsAdministrator(context);

			const users = await Users.find({});
			return users;
		}
	},
	Mutation: {
	}
};
