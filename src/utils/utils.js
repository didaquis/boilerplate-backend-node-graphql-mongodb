'use strict';

/**
 * Get all IP address of the server
 * @param {Object|undefined} [{}] - An object.
 * @param {Boolean} [obj.skipLocalhost=false] - Determines if the localhost address is returned in the result list
 * @return {Array}                          Array of IPs
 */
const getListOfIPV4Address = ({ skipLocalhost = false } = {}) => {
	const os = require('os');
	const ifaces = os.networkInterfaces();

	let result = [];

	Object.keys(ifaces).forEach(function (ifname) {
		ifaces[ifname].forEach(function (iface) {
			// skip non-ipv4 addresses
			if ('IPv4' !== iface.family) {
				return;
			}

			if (skipLocalhost) {
				// skip over internal (i.e. 127.0.0.1)
				if (iface.internal !== false) {
					return;
				}
			}

			result.push(iface.address);
		});
	});

	return result;
};

module.exports = { getListOfIPV4Address };
