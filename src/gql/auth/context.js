'use strict';

const { validateAuthToken } = require('./jwt');

const setContext = async ({ req }) => {
	const token = req.headers['authorization'];
	if (token !== 'null') { /* Check 'null' as a string! */
		try {
			const user = await validateAuthToken(token);
			return { user }; // Add to Apollo Server context the user who is doing the request if auth token is provided and it's a valid token
		} catch (error) {
			//console.error(error); // eslint-disable-line no-console
		}
	}
};

module.exports = { setContext };