const jwt = require('jsonwebtoken');

const { securityVariablesConfig } = require('../../config/appConfig');

const setContext = async ({ req }) => {
// didac: To DO!
	//console.log(req.headers)
	// console.log(req.body)
	// console.log(req.query)
	// console.log('**************************')
	const token = req.headers['authorization'];
	if (token !== 'null') { /* Check 'null' as a string! */
		try {
			const user = await jwt.verify(token, securityVariablesConfig.secret);
			return { user }; // Add to context the user who is doing request if auth token is provided and it's a valid token
		} catch (error) {
			//console.error(error); // eslint-disable-line no-console
		}
	}
};

module.exports = { setContext };