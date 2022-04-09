import { gql } from 'apollo-server-express';

export default /* GraphQL */ gql`
	type DeleteResult {
		deletedCount: Int!
	}
`;