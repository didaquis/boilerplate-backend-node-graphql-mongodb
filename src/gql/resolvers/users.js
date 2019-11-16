const { Users } = require('../../data/models/index');
const { crearToken } = require('../../utils/utils');

const bcrypt = require('bcrypt');
require('dotenv').config();

module.exports = {
	Query: {
		obtenerUsuario: async (root, args, context) => {
			if (!context.usuarioActual) {
				return null;
			}
			const usuario = await Users.findOne({ email: context.usuarioActual.usuario });
			return usuario;
		}
	},
	Mutation: {
		registerUser: async (root, { email, password }) => {

			const existeUsuario = await Users.findOne({email});

			if (existeUsuario) {
				throw new Error('Ese nombre de usuario no está disponible');
			}

			await new Users({
				email,
				password
			}).save();

			const user = await Users.findOne({email});

			const secreto = process.env.SECRET;
			const tiempoExpiracion = process.env.DURATION;

			return {
				token: crearToken(user, secreto, tiempoExpiracion)
			};
		},
		authUser: async (root, { email, password }) => {
			const user = await Users.findOne({email});

			if (!user) {
				throw new Error('Usuario no encontrado');
			}

			const passwordCorrecto = await bcrypt.compare(password, user.password);

			if (!passwordCorrecto) {
				throw new Error('Nombre y/o password incorrecto');
			}

			await Users.findOneAndUpdate({email}, { lastLogin: new Date().toISOString() }, { new: true });

			const secreto = process.env.SECRET;
			const tiempoExpiracion = process.env.DURATION;

			return {
				token: crearToken(user, secreto, tiempoExpiracion)
			};
		}
	}
};
