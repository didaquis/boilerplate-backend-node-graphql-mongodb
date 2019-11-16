const { Users } = require('../../data/models/index');
const { crearToken } = require('../../utils/utils');
const { securityVariablesConfig } = require('../../config/appConfig');

const bcrypt = require('bcrypt');

module.exports = {
	Query: {
		listAllUsers:  async (root, args, context) => {
			if (!context.user) {
				//throw new Error('You must be logged in to perform this action');
				return null;
			}

			if (!context.user.isAdmin) {
				//throw new Error('You must be an administrator to perform this action');
				return null;
			}
			const users = await Users.find({});
			return users;
		}
	},
	Mutation: {
		registerUser: async (root, { email, password }) => {

			const existeUsuario = await Users.findOne({email});

			if (existeUsuario) {
				throw new Error('Data provided is not valid');
			}

			await new Users({
				email,
				password
			}).save();

			const user = await Users.findOne({email});

			// didac TO DO... repensar si quiero mandar el _id del usuario, quizá mejor un UUID ??
			return {
				token: crearToken({ email: user.email, isAdmin: user.isAdmin, isActive: user.isActive }, securityVariablesConfig.secret, securityVariablesConfig.timeExpiration)
			};
		},
		authUser: async (root, { email, password }) => {
			const user = await Users.findOne({email});

			if (!user) {
				throw new Error('User not found');
			}

			const isCorrectPassword = await bcrypt.compare(password, user.password);

			if (!isCorrectPassword) {
				throw new Error('Invalid credentials');
			}

			await Users.findOneAndUpdate({email}, { lastLogin: new Date().toISOString() }, { new: true });

			// didac TO DO... repensar si quiero mandar el _id del usuario, quizá mejor un UUID ??
			return {
				token: crearToken({ email: user.email, isAdmin: user.isAdmin, isActive: user.isActive }, securityVariablesConfig.secret, securityVariablesConfig.timeExpiration)
			};
		}
	}
};
