import mongoose from 'mongoose';
import express from 'express';
import helmet from 'helmet';
import favicon from 'serve-favicon';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { ApolloServerPluginLandingPageGraphQLPlayground, ApolloServerPluginLandingPageDisabled } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import { UserInputError } from 'apollo-server-errors';

import { ENVIRONMENT } from './config/environment.js';
import { environmentVariablesConfig } from './config/appConfig.js';
import { logger, endLogger } from './helpers/logger.js';
import { requestDevLogger } from './helpers/requestDevLogger.js';
import { setContext } from './gql/auth/setContext.js';
import { initTypeDefinition } from './gql/types/index.js';
import { resolvers } from './gql/resolvers/index.js';
import { getListOfIPV4Address } from './helpers/getListOfIPV4Address.js';
import routesManager from './routes/routesManager.js';


mongoose.set('strictQuery', true);

if (environmentVariablesConfig.formatConnection === 'DNSseedlist' && environmentVariablesConfig.mongoDNSseedlist !== '') {
	mongoose.connect(environmentVariablesConfig.mongoDNSseedlist);
} else {
	if (environmentVariablesConfig.mongoUser !== '' && environmentVariablesConfig.mongoPass !== '') {
		mongoose.connect(`mongodb://${environmentVariablesConfig.mongoUser}:${environmentVariablesConfig.mongoPass}@${environmentVariablesConfig.dbHost}:${environmentVariablesConfig.dbPort}/${environmentVariablesConfig.database}`);
	} else {
		mongoose.connect(`mongodb://${environmentVariablesConfig.dbHost}:${environmentVariablesConfig.dbPort}/${environmentVariablesConfig.database}`);
	}
}

const db = mongoose.connection;
db.on('error', (err) => {
	logger.error(`Connection error with database. ${err}`);
});

db.once('open', () => {
	if (environmentVariablesConfig.environment !== ENVIRONMENT.DEVELOPMENT) {
		logger.info(`Connected with MongoDB service (${ENVIRONMENT.PRODUCTION} mode)`);
	} else {
		if (environmentVariablesConfig.formatConnection === 'DNSseedlist' && environmentVariablesConfig.mongoDNSseedlist !== '') {
			logger.info(`Connected with MongoDB service at "${environmentVariablesConfig.mongoDNSseedlist}" using database "${environmentVariablesConfig.database}" (${ENVIRONMENT.DEVELOPMENT} mode)`);
		} else {
			logger.info(`Connected with MongoDB service at "${environmentVariablesConfig.dbHost}" in port "${environmentVariablesConfig.dbPort}" using database "${environmentVariablesConfig.database}" (${ENVIRONMENT.DEVELOPMENT} mode)`);
		}
	}

	initApplication();
});

const initApplication = async () => {
	const app = express();
	if (environmentVariablesConfig.environment === ENVIRONMENT.PRODUCTION) {
		app.use(helmet());
	} else {
		// Allow GraphQL Playground on development environments
		app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
	}
	app.use(cors({ credentials: true }));
	const __dirname = path.dirname(fileURLToPath(import.meta.url));
	app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
	app.use('', routesManager);

	const typeDefs = await initTypeDefinition();

	const server = new ApolloServer({ 
		typeDefs,
		resolvers,
		context: setContext,
		introspection: (environmentVariablesConfig.environment === ENVIRONMENT.PRODUCTION) ? false : true, // Set to "true" only in development mode
		plugins: (environmentVariablesConfig.environment === ENVIRONMENT.PRODUCTION) ? [ApolloServerPluginLandingPageDisabled()] : [requestDevLogger, ApolloServerPluginLandingPageGraphQLPlayground()], // Log all querys and their responses. Show playground (do not use in production)
		formatError (error) {
			if ( !(error.originalError instanceof UserInputError) ) {
				logger.error(error.message);
			}

			return error;
		},
	});

	await server.start();

	server.applyMiddleware({ app });

	app.use((req, res) => {
		res.status(404).send('404'); // eslint-disable-line no-magic-numbers
	});

	app.listen(environmentVariablesConfig.port, () => {
		getListOfIPV4Address().forEach(ip => {
			logger.info(`Application running on: http://${ip}:${environmentVariablesConfig.port}`);
			if (environmentVariablesConfig.environment !== ENVIRONMENT.PRODUCTION) {
				logger.info(`GraphQL Playground running on: http://${ip}:${environmentVariablesConfig.port}${server.graphqlPath}`);
			}
		});
	});

	// Manage application shutdown
	process.on('SIGINT', () => {
		logger.info('Stopping application...');
		endLogger();
		process.exit();
	});
};
