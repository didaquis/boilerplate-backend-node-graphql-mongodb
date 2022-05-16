import jwt from 'jsonwebtoken';

import { securityVariablesConfig } from '../../config/appConfig.js';

/**
 * Create a new JSON Web Token
 * @param {string}	email		- User email
 * @param {boolean}	isAdmin		- If user is admin or not
 * @param {boolean}	isActive	- If user is active or not
 * @param {string}	uuid		- An uuid token
 * @returns	{string}			- Json Web Token
 */
export const createAuthToken = (email, isAdmin, isActive, uuid) => {
	return jwt.sign({ email, isAdmin, isActive, uuid }, securityVariablesConfig.secret, { expiresIn: securityVariablesConfig.timeExpiration });
};

/**
 * Validate an existing JSON Web Token and retrieve data from payload
 * @param {string}	token	- A token
 * @returns {Object}		- User data retrieved from payload
 */
export const validateAuthToken = async (token) => {
	const user = await jwt.verify(token, securityVariablesConfig.secret);
	return user;
};
