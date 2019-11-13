const { Pedidos, Productos } = require('../../data/models/index');

module.exports = {
	Query: {
		obtenerPedidos: (root, { clienteId }) => {
			return new Promise((resolve, reject) => {
				Pedidos.find({ cliente: clienteId }, (error, pedidos) => {
					if (error) {
						reject(error);
					} else {
						resolve(pedidos);
					}
				});
			});
		}
	},
	Mutation: {
		nuevoPedido: (root, { input }) => {
			const nuevoPedido = new Pedidos({
				pedido: input.pedido,
				total: input.total,
				fecha: new Date(),
				cliente: input.cliente, 
				estado: 'PENDIENTE'
			});

			nuevoPedido.id = nuevoPedido._id;

			return new Promise((resolve, reject) => {
				nuevoPedido.save((error) => {
					if (error) {
						reject(error);
					} else {
						resolve(nuevoPedido);
					}
				});
			});
		},
		actualizarEstado: (root, { input } ) => {
			return new Promise((resolve, reject) => {
				Pedidos.findOne({ _id: input.id }, (error, pedido) => {
					if (error) {
						reject(error);
					} else {
						/*
						Actualizamos el stock en base al estado previo y actual del pedido:

						Si de PENDIENTE, pasa a COMPLETADO 	=> restar stock
						Si de CANCELADO pasa a COMPLETADO 	=> restar stock

						Si de COMPLETADO pasa a PENDIENTE 	=> sumar stock
						Si de COMPLETADO pasa a CANCELADO 	=> sumar stock

						Si de PENDIENTE, pasa a CANCELADO 	=> stock no cambia
						Si de CANCELADO pasa a PENDIENTE 	=> stock no cambia
						*/

						const estadoPrevio = pedido.estado;
						const estadoPedido = input.estado;

						let operador;
						switch (estadoPedido) {
							case 'PENDIENTE':
							case 'CANCELADO':
								if (estadoPrevio === 'COMPLETADO') {
									operador = '+';
								}
								break;
							case 'COMPLETADO':
								operador = '-';
								break;
						}

						input.pedido.forEach(pedido => {
							Productos.updateOne({ _id: pedido.id },
								{ '$inc':
									{ 'stock': `${operador}${pedido.cantidad}` }
								}, function (error) {
									if (error) return new Error(error);
								} );
						});

						// Actualizamos el resto de datos del pedido
						Pedidos.findOneAndUpdate({ _id: input.id }, input, {new: true}, (error) => {
							if (error) {
								reject(error);
							} else {
								resolve('Se actualizó correctamente');
							}
						});
					}
				});
			});
		}
	}
};
