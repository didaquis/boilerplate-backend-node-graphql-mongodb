import merge from 'lodash.merge';

import users from './users.js';
import auth from './auth.js';

export const resolvers = merge(
	users,
	auth
);
