'use strict';

const { Router } = require('express');
const routesManager = Router();

/**
 * Example of route
 */
routesManager.get('/', (req, res) => {
	const status = 200;
	res.status(status).end();
});


module.exports = routesManager;
