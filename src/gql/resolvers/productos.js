const { Productos } = require('../../data/models/index');

module.exports = {
	Query: {
		obtenerProductos: (root, { limite, offset, hasStock }) => {
			let filtro;
			if (hasStock) {
				filtro = { stock: { $gt: 0 } };
			}
			return Productos.find(filtro).limit(limite).skip(offset);
		},
		obtenerProducto: (root, { id }) => {
			return new Promise((resolve, reject) => {
				Productos.findById(id, (error, producto) => {
					if (error) {
						reject(error);
					} else {
						resolve(producto);
					}
				});
			});
		},
		totalProductos: () => {
			return new Promise((resolve, reject) => {
				Productos.countDocuments({}, (error, count) => {
					if (error) {
						reject(error);
					} else {
						resolve(count);
					}
				});
			});
		}
	},
	Mutation: {
		nuevoProducto: (root, { input }) => {
			const nuevoProducto = new Productos({
				nombre: input.nombre,
				precio: input.precio,
				stock: input.stock
			});

			nuevoProducto.id = nuevoProducto._id;

			return new Promise((resolve, reject) => {
				nuevoProducto.save((error) => {
					if (error) {
						reject(error);
					} else {
						resolve(nuevoProducto);
					}
				});
			});
		},
		actualizarProducto: (root, { input }) => {
			return new Promise((resolve, reject) => {
				Productos.findOneAndUpdate({ _id: input.id }, input, { new: true }, (error, producto) => {
					if (error) {
						reject(error);
					} else {
						resolve(producto);
					}
				});
			});
		},
		eliminarProducto: (root, { id }) => {
			return new Promise((resolve, reject) => {
				Productos.findOneAndDelete({ _id: id }, (error) => {
					if (error) {
						reject(error);
					} else {
						resolve('Se ha eliminado el producto');
					}
				});
			});
		}
	}
};
