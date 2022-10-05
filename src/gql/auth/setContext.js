import { validateAuthToken, createAuthToken } from './jwt.js';
import { environmentVariablesConfig } from '../../config/appConfig.js';
import { authValidations } from '../auth/authValidations.js';
import { ENVIRONMENT } from '../../config/environment.js';
import { logger } from '../../helpers/logger.js';
import { models } from '../../data/models/index.js';

/**
 * Context function from Apollo Server
 */
export const setContext = async ({ req }) => {
	const context = {
		di: {
			model: {
				...models
			},
			authValidation: {
				...authValidations
			},
			jwt: {
				createAuthToken: createAuthToken
			}
		}
	};

	let token = req.headers['authorization'];

	if (token && typeof token === 'string') {
		try {
			const authenticationScheme = 'Bearer ';
			if (token.startsWith(authenticationScheme)) {
				token = token.slice(authenticationScheme.length, token.length);
			}
			const user = await validateAuthToken(token);
			context.user = user; // Add to Apollo Server context the user who is doing the request if auth token is provided and it's a valid token
		} catch (error) {
			if (environmentVariablesConfig.environment !== ENVIRONMENT.PRODUCTION) {
				logger.debug(error.message);
			}
		}
	}

	return context;
};
