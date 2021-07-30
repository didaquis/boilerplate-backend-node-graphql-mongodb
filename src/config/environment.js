'use strict';

/* Home doc */
/**
 * @file Environment options available for the application
 * @see module:environment
 */

/* Module doc */
/**
 * Environment options available for the application
 * @module environment
 */


/**
 *  Environments options
 * @typedef {Object}
 */
const ENVIRONMENT = Object.freeze({
	DEVELOPMENT: 'development',
	PRODUCTION: 'production'
});

module.exports = { ENVIRONMENT };