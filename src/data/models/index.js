import mongoose from 'mongoose';

import { UsersSchema } from './schemas/index.js';

export const models = {
	Users: mongoose.model('users', UsersSchema),
};
