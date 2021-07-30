import { validateAuthToken } from './jwt.js';
import { environmentVariablesConfig } from '../../config/appConfig.js';
import { ENVIRONMENT } from '../../config/environment.js';
import { logger } from '../../helpers/logger.js';

/**
 * Context function from Apollo Server
 */
export const setContext = async ({ req }) => {
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
			if (environmentVariablesConfig.enviroment !== ENVIRONMENT.PRODUCTION) {
				logger.debug(error.message);
			}
		}
	}
};
