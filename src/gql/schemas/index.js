'use strict';

const { importSchema } = require('graphql-import');

const typeDefs = importSchema('src/gql/schemas/schema.graphql'); /* Warning: Must be an absolute path */

module.exports = typeDefs;
