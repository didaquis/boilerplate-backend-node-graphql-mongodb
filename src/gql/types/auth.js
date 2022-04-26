import { gql } from 'apollo-server-express';

export default /* GraphQL */ gql`
	type Token {
		token: String
	}

	type Mutation {
		""" It allows users to register """
		registerUser(email: String!, password: String!): Token

		""" It allows users to authenticate """
		authUser(email: String!, password: String!): Token

		""" It allows to user to delete their account permanently """
		deleteMyUserAccount: DeleteResult
	}
`;