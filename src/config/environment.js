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
 * Constant object representing the application environment
 * @readonly
 * @enum {string}
 * @property {string} DEVELOPMENT - Development environment
 * @property {string} PRODUCTION - Production environment
 */
export const ENVIRONMENT = Object.freeze({
	DEVELOPMENT: 'development',
	PRODUCTION: 'production'
});