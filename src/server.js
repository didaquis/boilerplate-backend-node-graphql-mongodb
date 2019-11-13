'use strict';

require('dotenv').config();
const cors = require('cors');

const host = process.env.MONGO_HOST;
const port = process.env.MONGO_PORT;
const database = process.env.MONGO_DB;
const mongoUser = process.env.MONGO_USER;
const mongoPass = process.env.MONGO_PASS;

const mongoose = require('mongoose');
if (mongoUser !== '' && mongoPass !== '') {
	mongoose.connect(`mongodb://${mongoUser}:${mongoPass}@${host}:${port}/${database}`, { useNewUrlParser: true });
} else {
	mongoose.connect(`mongodb://${host}:${port}/${database}`, { useNewUrlParser: true });
}

// mongoose.set('setFindAndModify', false); // Prevent DeprecationWarning: collection.findAndModify is deprecated

const db = mongoose.connection;
db.on('error', (err) => {
	console.error(`\nConnection error with database. ${err}`); // eslint-disable-line no-console
});

db.once('open', () => {
	console.log(`\nConnected with mongodb at "${host}" in port "${port}" using database "${database}"`); // eslint-disable-line no-console

	initApplication();
});

const initApplication = () => {
	const express = require('express');
	const app = express();
	app.use(cors());

	const jwt = require('jsonwebtoken');
	const secreto = process.env.SECRET;

	const { getListOfIPV4Address } = require('./utils/utils');

	const { ApolloServer } = require('apollo-server-express');

	const typeDefs = require('./gql/schemas/index');
	const resolvers = require('./gql/resolvers/index');

	const routesManager = require('./routes/routesManager');
	app.use('', routesManager);

	const server = new ApolloServer({ typeDefs, resolvers, context: async ({ req }) => {
		const token = req.headers['authorization'];
		if (token !== 'null') { /* Check 'null' as a string! */
			try {
				const usuarioActual = await jwt.verify(token, secreto);
				req.usuarioActual = usuarioActual;

				return { usuarioActual };
			} catch (error) {
				console.error(error); // eslint-disable-line no-console
			}
		}
	}});

	server.applyMiddleware({app});

	app.use((req, res) => {
		res.status(404).send('404'); // eslint-disable-line no-magic-numbers
	});

	const portByDefault = 4000;
	const port = process.env.PORT || portByDefault;
	app.listen(port, () => {
		getListOfIPV4Address().forEach(ip => {
			console.log(`Application running on: http://${ip}:${port}${server.graphqlPath}`); // eslint-disable-line no-console
		});
	});

	// managing stop shutdown
	process.on('SIGINT', () => {
		console.log('\nStopping application...'); // eslint-disable-line no-console
		process.exit();
	});
};
