import dotenv from 'dotenv';
dotenv.config();

import { ENVIRONMENT } from './environment.js';


/* Home doc */
/**
 * @file Environment variables configuration for the application
 * @see module:appConfig
 */

/* Module doc */
/**
 * Environment variables configuration for the application
 * @module appConfig
 */

const serverPortByDefault = 4000;
const limitOfUsersRegistered = 0; /* Set the value to 0 to not use the limit. Remember put the same value on the environment variables */

/**
 * Environment variables configuration
 * @readonly
 * @type {Object}
 * @property {string} formatConnection - The format of connection with MongoDB service
 * @property {string} mongoDNSseedlist - The DNSseedlist connection format
 * @property {string} dbHost - Host of the database
 * @property {string} dbPort - Port of the database
 * @property {string} database - Name of the database
 * @property {string} mongoUser - Username of MongoDB
 * @property {string} mongoPass - Password of MongoDB
 * @property {string} environment - Application execution environment
 * @property {number} port - The port for running this application
 */
export const environmentVariablesConfig = Object.freeze({
	formatConnection: process.env.MONGO_FORMAT_CONNECTION || 'standard',
	mongoDNSseedlist: process.env.MONGO_DNS_SEEDLIST_CONNECTION || '',
	dbHost: process.env.MONGO_HOST || '127.0.0.1',
	dbPort: process.env.MONGO_PORT || '27017',
	database: process.env.MONGO_DB || 'boilerplate_database',
	mongoUser: process.env.MONGO_USER || '',
	mongoPass: process.env.MONGO_PASS || '',
	environment: (process.env.ENVIRONMENT === ENVIRONMENT.DEVELOPMENT) ? ENVIRONMENT.DEVELOPMENT : ENVIRONMENT.PRODUCTION,
	port: Number(process.env.PORT) || serverPortByDefault
});

/**
 * Security variables configuration
 * @readonly
 * @type {Object}
 * @property {string} secret - Secret key for authentication
 * @property {string} timeExpiration - Expiration time for authentication tokens
 */
export const securityVariablesConfig = Object.freeze({
	secret: process.env.SECRET || 'yoursecret',
	timeExpiration: process.env.DURATION || '2h'
});

/**
 * Global variables configuration
 * @readonly
 * @type {Object}
 * @property {number} limitOfUsersRegistered - The maximum number of users that can register
 */
export const globalVariablesConfig = Object.freeze({
	limitOfUsersRegistered: Number(process.env.LIMIT_USERS_REGISTERED) || limitOfUsersRegistered
});
