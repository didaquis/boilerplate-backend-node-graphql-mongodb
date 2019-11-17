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

const serverPortByDefault = 4000;
const limitOfUsersRegistered = 0; /* Set the value to 0 to not use the limit. Remember put the same value on the enviroment variables */

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
	enviroment: (process.env.ENVIROMENT === 'development') ? process.env.ENVIROMENT : 'production',
	serverPort: Number(process.env.SERVER_PORT) || serverPortByDefault
});

/**
 * Security variables configuration
 * @type {object}
 */
const securityVariablesConfig = Object.freeze({
	secret: process.env.SECRET || 'yoursecret',
	timeExpiration: process.env.DURATION || '2h'
});

/**
 * Global variables configuration
 * @type {object}
 */
const globalVariablesConfig = Object.freeze({
	limitOfUsersRegistered: Number(process.env.LIMIT_USERS_REGISTERED) || limitOfUsersRegistered
});

/** Variables configuration */
module.exports = { enviromentVariablesConfig, securityVariablesConfig, globalVariablesConfig };
