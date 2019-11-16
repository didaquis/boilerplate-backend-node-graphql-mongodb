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
	}
};

/* Auth validations repository */
module.exports = { authValidations };