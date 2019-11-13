const { Pedidos } = require('../../data/models/index');

module.exports = {
	Query: {
		topClientes: () => {
			return new Promise((resolve, reject) => {
				Pedidos.aggregate([
					{ 
						$match: { estado: 'COMPLETADO' } 
					},
					{
						$group: {
							_id: '$cliente',
							total: { $sum: '$total' }
						}
					},
					{
						$lookup: {
							from: 'clientes',
							localField: '_id',
							foreignField: '_id',
							as: 'cliente'
						}
					},
					{
						$sort: { total: -1 }
					},
					{
						$limit: 10
					}
				], (error, resultado) => {
					if (error) {
						reject(error);
					} else {
						resolve(resultado);
					}
				});
			});
		}
	}
};
