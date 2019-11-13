const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = new Schema({
	nombre: { 
		type: String,
		required: true
	},
	apellido: String,
	empresa: String,
	email: { 
		type: String,
		required: true
	},
	tipo: { 
		type: String,
		required: true
	},
	pedidos: Array
});
