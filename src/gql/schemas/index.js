import { importSchema } from 'graphql-import';

export const typeDefs = importSchema('src/gql/schemas/schema.graphql'); /* Warning: Must be an absolute path */
