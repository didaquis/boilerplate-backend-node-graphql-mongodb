'use strict';

const { validateAuthToken } = require('./jwt');
const { enviromentVariablesConfig } = require('../../config/appConfig');
const { ENVIRONMENT } = require('../../config/environment');
const { logger } = require('../../helpers/logger');

/**
 * Context function from Apollo Server
 */
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
			if (enviromentVariablesConfig.enviroment !== ENVIRONMENT.PRODUCTION) {
				logger.debug(error.message);
			}
		}
	}
};

module.exports = { setContext };