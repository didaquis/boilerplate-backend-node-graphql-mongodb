'use strict';

const jwt = require('jsonwebtoken');

const { securityVariablesConfig } = require('../../config/appConfig');

/**
 * Create a new JSON Web Token
 * @param {Object} 		userData 			- Payload object
 * @param {String} 		userData.email 		- Payload data: User email
 * @param {Boolean} 	userData.isAdmin 	- Payload data: If user is admin or not
 * @param {Boolean} 	userData.isActive 	- Payload data: If user is active or not
 * @param {String} 		userData.uuid 		- Payload data: An uuid token
 * @param {String} 		secreto 			- Secret or private key
 * @param {String} 		[tiempoExpiracion] 	- Time of token expiration. Default value '2h'
 * @returns	{String}						- Json Web Token
 */
const createAuthToken = ({ email, isAdmin, isActive, uuid }, secreto, tiempoExpiracion = '2h') => {
	return jwt.sign({ email, isAdmin, isActive, uuid }, secreto, { expiresIn: tiempoExpiracion });
};

/**
 * Validate an existing JSON Web Token and retrieve data from payload
 * @param  {String} token - A token
 * @return {Object}       - User data retrieved from payload
 */
const validateAuthToken = async (token) => {
	const user = await jwt.verify(token, securityVariablesConfig.secret);
	return user;
};

module.exports = { createAuthToken, validateAuthToken };
