'use strict';

const { logger, endLogger } = require('./utils/logger');

const cors = require('cors');
const mongoose = require('mongoose');

const { enviromentVariablesConfig } = require('./config/appConfig');
const { setContext } = require('./gql/auth/context');

if (enviromentVariablesConfig.formatConnection === 'DNSseedlist' && enviromentVariablesConfig.mongoDNSseedlist !== '') {
	mongoose.connect(enviromentVariablesConfig.mongoDNSseedlist, { useNewUrlParser: true });
} else {
	if (enviromentVariablesConfig.mongoUser !== '' && enviromentVariablesConfig.mongoPass !== '') {
		mongoose.connect(`mongodb://${enviromentVariablesConfig.mongoUser}:${enviromentVariablesConfig.mongoPass}@${enviromentVariablesConfig.host}:${enviromentVariablesConfig.port}/${enviromentVariablesConfig.database}`, { useNewUrlParser: true });
	} else {
		mongoose.connect(`mongodb://${enviromentVariablesConfig.host}:${enviromentVariablesConfig.port}/${enviromentVariablesConfig.database}`, { useNewUrlParser: true });
	}
}

// mongoose.set('setFindAndModify', false); // Prevent DeprecationWarning: collection.findAndModify is deprecated

const db = mongoose.connection;
db.on('error', (err) => {
	logger.error(`Connection error with database. ${err}`);
});

db.once('open', () => {
	if (enviromentVariablesConfig.formatConnection === 'DNSseedlist' && enviromentVariablesConfig.mongoDNSseedlist !== '') {
		logger.info(`Connected with mongodb at "${enviromentVariablesConfig.mongoDNSseedlist}" using database "${enviromentVariablesConfig.database}"`);
	} else {
		logger.info(`Connected with mongodb at "${enviromentVariablesConfig.host}" in port "${enviromentVariablesConfig.port}" using database "${enviromentVariablesConfig.database}"`);
	}

	initApplication();
});

const initApplication = () => {
	const express = require('express');
	const app = express();
	app.use(cors({ credentials: true }));

	const { getListOfIPV4Address } = require('./utils/utils');

	const { ApolloServer } = require('apollo-server-express');

	const typeDefs = require('./gql/schemas/index');
	const resolvers = require('./gql/resolvers/index');

	const routesManager = require('./routes/routesManager');
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

	app.listen(enviromentVariablesConfig.serverPort, () => {
		getListOfIPV4Address().forEach(ip => {
			logger.info(`Application running on: http://${ip}:${enviromentVariablesConfig.serverPort}`);
			if (enviromentVariablesConfig.enviroment !== 'production') {
				logger.info(`GraphQL Playground running on: http://${ip}:${enviromentVariablesConfig.serverPort}${server.graphqlPath}`);
			}
		});
	});

	// Managing application shutdown
	process.on('SIGINT', () => {
		logger.info('\nStopping application...');
		endLogger();
		process.exit();
	});
};
