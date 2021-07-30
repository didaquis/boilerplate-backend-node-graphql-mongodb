import { Router } from 'express';
const routesManager = Router();

/**
 * Example of route
 */
routesManager.get('/', (req, res) => {
	const status = 200;
	res.status(status).end();
});


export default routesManager;
