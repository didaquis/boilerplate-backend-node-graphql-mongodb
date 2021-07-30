'use strict';

import mongoose from 'mongoose';

import UsersSchema from './schemas/index.js';

export const Users = mongoose.model('users', UsersSchema);