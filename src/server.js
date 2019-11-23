'use strict';

const mongoose = require('mongoose');

const { enviromentVariablesConfig } = require('./config/appConfig');
const { logger, endLogger } = require('./utils/logger');


const mongooseConnectOptions = { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false };
if (enviromentVariablesConfig.formatConnection === 'DNSseedlist' && enviromentVariablesConfig.mongoDNSseedlist !== '') {
	mongoose.connect(enviromentVariablesConfig.mongoDNSseedlist, mongooseConnectOptions);
} else {
	if (enviromentVariablesConfig.mongoUser !== '' && enviromentVariablesConfig.mongoPass !== '') {
		mongoose.connect(`mongodb://${enviromentVariablesConfig.mongoUser}:${enviromentVariablesConfig.mongoPass}@${enviromentVariablesConfig.dbHost}:${enviromentVariablesConfig.dbPort}/${enviromentVariablesConfig.database}`, mongooseConnectOptions);
	} else {
		mongoose.connect(`mongodb://${enviromentVariablesConfig.dbHost}:${enviromentVariablesConfig.dbPort}/${enviromentVariablesConfig.database}`, mongooseConnectOptions);
	}
}

const db = mongoose.connection;
db.on('error', (err) => {
	logger.error(`Connection error with database. ${err}`);
});

db.once('open', () => {
	if (enviromentVariablesConfig.formatConnection === 'DNSseedlist' && enviromentVariablesConfig.mongoDNSseedlist !== '') {
		logger.info(`Connected with MongoDB service at "${enviromentVariablesConfig.mongoDNSseedlist}" using database "${enviromentVariablesConfig.database}"`);
	} else {
		logger.info(`Connected with MongoDB service at "${enviromentVariablesConfig.dbHost}" in port "${enviromentVariablesConfig.dbPort}" using database "${enviromentVariablesConfig.database}"`);
	}

	initApplication();
});

const initApplication = () => {
	const express = require('express');
	const cors = require('cors');

	const { ApolloServer } = require('apollo-server-express');
	const { setContext } = require('./gql/auth/context');
	const typeDefs = require('./gql/schemas/index');
	const resolvers = require('./gql/resolvers/index');

	const { getListOfIPV4Address } = require('./utils/utils');
	const routesManager = require('./routes/routesManager');

	const app = express();
	app.use(cors({ credentials: true }));
	app.use('', routesManager);

	const server = new ApolloServer({ 
		typeDefs,
		resolvers,
		context: setContext,
		introspection: (enviromentVariablesConfig.enviroment === 'production') ? false : true, // Set to "true" only in development mode
		playground: (enviromentVariablesConfig.enviroment === 'production') ? false : true // Set to "true" only in development mode
	});

	server.applyMiddleware({app});

	app.use((req, res) => {
		res.status(404).send('404'); // eslint-disable-line no-magic-numbers
	});

	app.listen(enviromentVariablesConfig.port, () => {
		getListOfIPV4Address().forEach(ip => {
			logger.info(`Application running on: http://${ip}:${enviromentVariablesConfig.port}`);
			if (enviromentVariablesConfig.enviroment !== 'production') {
				logger.info(`GraphQL Playground running on: http://${ip}:${enviromentVariablesConfig.port}${server.graphqlPath}`);
			}
		});
	});

	// Managing application shutdown
	process.on('SIGINT', () => {
		logger.info('Stopping application...');
		endLogger();
		process.exit();
	});
};
