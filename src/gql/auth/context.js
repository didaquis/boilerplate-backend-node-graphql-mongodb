'use strict';

const { validateAuthToken } = require('./jwt');

const setContext = async ({ req }) => {
	let token = req.headers['authorization'];
	if (token && typeof token === 'string') {
		try {
			const authenticationScheme = 'Bearer ';
			if (token.startsWith(authenticationScheme)) {
				token = token.slice(authenticationScheme.length, token.length);
			}
			const user = await validateAuthToken(token);
			return { user }; // Add to Apollo Server context the user who is doing the request if auth token is provided and it's a valid token
		} catch (error) {
			//console.error(error); // eslint-disable-line no-console
		}
	}
};

module.exports = { setContext };