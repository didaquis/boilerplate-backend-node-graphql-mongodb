import jwt from 'jsonwebtoken';

import { securityVariablesConfig } from '../../config/appConfig.js';

/**
 * Create a new JSON Web Token
 * @param {Object} 		userData 			- Payload object
 * @param {string} 		userData.email 		- Payload data: User email
 * @param {boolean} 	userData.isAdmin 	- Payload data: If user is admin or not
 * @param {boolean} 	userData.isActive 	- Payload data: If user is active or not
 * @param {string} 		userData.uuid 		- Payload data: An uuid token
 * @param {string} 		secret 				- Secret or private key
 * @param {string} 		[expirationTime] 	- Time of token expiration. Default value '2h'
 * @returns	{string}						- Json Web Token
 */
export const createAuthToken = ({ email, isAdmin, isActive, uuid }, secret, expirationTime = '2h') => {
	return jwt.sign({ email, isAdmin, isActive, uuid }, secret, { expiresIn: expirationTime });
};

/**
 * Validate an existing JSON Web Token and retrieve data from payload
 * @param {string} token - A token
 * @returns {Object}       - User data retrieved from payload
 */
export const validateAuthToken = async (token) => {
	const user = await jwt.verify(token, securityVariablesConfig.secret);
	return user;
};
