import mongoose from 'mongoose';

import { UsersSchema } from './schemas/index.js';

export default {
	Users: mongoose.model('users', UsersSchema),
};