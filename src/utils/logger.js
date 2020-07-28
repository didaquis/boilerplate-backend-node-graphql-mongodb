'use strict';

/* Home doc */
/**
 * @file Configuration settings for logger module
 * @see module:logger
 */

/* Module doc */
/**
 * Configuration settings for logger module
 * @module logger
 */

const log4js = require('log4js');

/**
 * log4js configuration data
 */
log4js.configure({
	appenders: {
		out:{ type: 'stdout' },
		trace: { type: 'file', filename: 'logs/application_trace.log', maxLogSize: 204800, backups: 3, keepFileExt: true },
		debug: { type: 'file', filename: 'logs/application_debug.log', maxLogSize: 204800, backups: 3, keepFileExt: true },
		info: { type: 'file', filename: 'logs/application.log', maxLogSize: 204800, backups: 3, keepFileExt: true },
		error: { type: 'file', filename: 'logs/application_error.log', maxLogSize: 204800, backups: 3, keepFileExt: true },
		trace_filter: { type: 'logLevelFilter', appender: 'trace', level: 'trace', maxLevel: 'trace' },
		debug_filter: { type: 'logLevelFilter', appender: 'debug', level: 'debug', maxLevel: 'debug' },
		info_filter: { type:'logLevelFilter', appender: 'info', level: 'info' },
		error_filter: { type:'logLevelFilter', appender: 'error', level: 'error' }
	},
	categories: {
		default: { appenders: [ 'trace_filter', 'debug_filter', 'info_filter', 'error_filter', 'out'], level: 'all' },
	}
});

/**
 * Logger object that provides the methods to logger data (all logs are printed in console and in logs file).
 * @async
 * @example <caption>Usage of logger:</caption>
 *          logger.trace('trace'); 	// Log file: application_trace.log
 *          logger.debug('debug'); 	// Log file: application_debug.log
 *          logger.info('info'); 	// Log file: application.log
 *          logger.warn('warn'); 	// Log file: application.log
 *          logger.error('error'); 	// Log file: application_error.log and application.log
 *          logger.fatal('fatal'); 	// Log file: application_error.log and application.log
 */
const logger = log4js.getLogger();

const endLogger = log4js.shutdown;

module.exports = { logger, endLogger };
