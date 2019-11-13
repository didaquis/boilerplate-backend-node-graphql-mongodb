const { Router } = require('express');
const routesManager = Router();

/*
	Example of routes:
*/

routesManager.get('/', (req, res) => {
	res.send('<h1>Hello World!</h1>');
});


module.exports = routesManager;
