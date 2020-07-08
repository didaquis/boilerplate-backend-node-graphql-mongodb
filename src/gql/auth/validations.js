'use strict';

/**
 * Auth validations repository
 * @type {Object}
 */
const authValidations = {
	/**
	 * Check if in Apollo Server context contain a logged user 
	 * @param  {Object} context 		- The context object of Apollo Server
	 * @param  {Object} [context.user]  - The context object data: user data
	 * @return {Boolean}
	 */
	isLogged: (context) => {
		return (!context.user) ? false : true;
	},

	/**
	 * Check if in Apollo Server context contain a logged user 
	 * @param  {Object} context 				- The context object of Apollo Server
	 * @param  {Object} [context.user]  		- The context object data: user data
	 * @param  {Boolean} [context.user.isAdmin] - The context object data: user data role information
	 * @return {Boolean}
	 */
	isAdmin: (context) => {
		return (!context.user || !context.user.isAdmin) ? false : true;
	},

	/**
	 * Check if the maximum limit of users has been reached
	 * @param  {Integer} numberOfCurrentlyUsersRegistered 	- The number of users currently registered in the service
	 * @param  {Integer} limitOfUsers 						- Represents the maximum number of users allowed in the service. Zero represents no limit
	 * @return {Boolean}
	 */
	isLimitOfUsersReached: (numberOfCurrentlyUsersRegistered = 0, limitOfUsers = 0) => {
		if (limitOfUsers === 0) return false;

		if (numberOfCurrentlyUsersRegistered >= limitOfUsers) return true;

		return false;
	},

	/**
	 * Check if email is valid.
	 * @param  {String} email
	 * @return {Boolean}
	 */
	isValidEmail: (email) => {
		if (!email) {
			return false;
		}
		const emailValidPattern = new RegExp(/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/);
		return emailValidPattern.test(email);
	},

	/**
	 * Check if password is secure. Rules: At least 8 characters. It must contain numbers, lowercase letters and uppercase letters. The spaces are not allowed. Only english characters are allowed. This characters are not allowed: { } ( ) | ~ € ¿ ¬
	 * @param  {String} password
	 * @return {Boolean}
	 */
	isStrongPassword: (password) => {
		if (!password) {
			return false;
		}
		const passwordValidPattern = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!*^?+-_@#$%&]{8,}$/);
		return passwordValidPattern.test(password);
	}
};

/* Auth validations repository */
module.exports = { authValidations };