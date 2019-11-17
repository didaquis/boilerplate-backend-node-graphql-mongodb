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
	}
};

/* Auth validations repository */
module.exports = { authValidations };