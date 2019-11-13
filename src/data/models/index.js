const mongoose = require('mongoose');

const { ClienteSchema, ProductoSchema, PedidosSchema, UsuariosSchema } = require('./schemas');

module.exports = {
	Clientes: mongoose.model('clientes', ClienteSchema),
	Productos: mongoose.model('productos', ProductoSchema),
	Pedidos: mongoose.model('pedidos', PedidosSchema),
	Usuarios: mongoose.model('usuarios', UsuariosSchema)
};