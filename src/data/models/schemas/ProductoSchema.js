const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = new Schema({
	nombre: { 
		type: String,
		required: true
	},
	precio: { 
		type: Number,
		required: true
	},
	stock: { 
		type: Number,
		required: true
	}
});
