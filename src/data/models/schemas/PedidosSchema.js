const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = new Schema({
	pedido: { 
		type: Array,
		required: true
	},
	total: { 
		type: Number,
		required: true
	},
	fecha: { 
		type: Date,
		required: true
	},
	cliente: { 
		type: mongoose.Types.ObjectId,
		required: true
	},
	estado: { 
		type: String,
		required: true
	}
});
