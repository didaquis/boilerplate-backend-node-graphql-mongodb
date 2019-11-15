const mongoose = require('mongoose');

const { UsuariosSchema } = require('./schemas');

module.exports = {
	Usuarios: mongoose.model('usuarios', UsuariosSchema)
};