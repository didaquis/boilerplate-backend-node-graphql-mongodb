require('dotenv').config();

/* Home doc */
/**
 * @file Enviroment variables configuration for the application
 * @see module:appConfig
 */

/* Module doc */
/**
 * Enviroment variables configuration for the application
 * @module appConfig
 */


/**
 * Enviroment variables configuration
 * @type {object}
 */
const enviromentVariablesConfig = Object.freeze({
	formatConnection: process.env.MONGO_FORMAT_CONNECTION || 'standard',
	mongoDNSseedlist: process.env.MONGO_DNS_SEEDLIST_CONNECTION || '',
	host: process.env.MONGO_HOST || 'localhost',
	port: process.env.MONGO_PORT || '27017',
	database: process.env.MONGO_DB || 'boilerplate_database',
	mongoUser: process.env.MONGO_USER || '',
	mongoPass: process.env.MONGO_PASS || '',
	enviroment: (process.env.ENVIROMENT === 'development') ? process.env.ENVIROMENT : 'production'
});

/**
 * Security variables configuration
 * @type {object}
 */
const securityVariablesConfig = Object.freeze({
	secret: process.env.SECRET || 'yoursecret',
	timeExpiration: process.env.DURATION || '2h'
});

/** Variables configuration */
module.exports = { enviromentVariablesConfig, securityVariablesConfig };
