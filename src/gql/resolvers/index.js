const { merge } = require('lodash');

const clientes = require('./clientes');
const productos = require('./productos');
const pedidos = require('./pedidos');
const usuarios = require('./usuarios');
const graficas	 = require('./graficas');

module.exports = merge(
	clientes,
	productos,
	pedidos,
	usuarios,
	graficas
);
