const { Usuarios } = require('../../data/models/index');
const { crearToken } = require('../../utils/utils');

const bcrypt = require('bcrypt');
require('dotenv').config();

module.exports = {
	Query: {
		obtenerUsuario: async (root, args, context) => {
			if (!context.usuarioActual) {
				return null;
			}
			const usuario = await Usuarios.findOne({ usuario: context.usuarioActual.usuario });
			return usuario;
		}
	},
	Mutation: {
		crearUsuario: async (root, { usuario, password }) => {

			const existeUsuario = await Usuarios.findOne({usuario});

			if (existeUsuario) {
				throw new Error('Ese nombre de usuario no está disponible');
			}

			await new Usuarios({
				usuario,
				password
			}).save();

			return 'El usuario se ha creado correctamente';
		},
		autenticarUsuario: async (root, { usuario, password }) => {
			const nombreUsuario = await Usuarios.findOne({usuario});

			if (!nombreUsuario) {
				throw new Error('Usuario no encontrado');
			}

			const passwordCorrecto = await bcrypt.compare(password, nombreUsuario.password);

			if (!passwordCorrecto) {
				throw new Error('Nombre y/o password incorrecto');
			}

			const secreto = process.env.SECRET;
			const tiempoExpiracion = process.env.DURATION;

			return {
				token: crearToken(nombreUsuario, secreto, tiempoExpiracion)
			};
		}
	}
};
