const { gql } = require("apollo-server");

module.exports = gql`
  scalar Date
  scalar JSON

  type Query {
    # user
    me: User!
    # ad
    ad(id: ID!): Ad!
    search(
      offset: Int
      limit: Int
      query: String
      category: categoryInput
      location: locationInput
    ): [Ad]!
    # utils
    location: JSON
    category: JSON
    country: JSON
  }

  # custom directives
  directive @s3Prefix on FIELD_DEFINITION
  directive @currencyFormat on FIELD_DEFINITION

  type Mutation {
    # user
    updateUser(data: updateUserInput!): User!
    # ad
    createAd(data: createAdInput!): ID!
    updateAd(data: updateAdInput!): Ad!
    deleteAd(id: ID!): ID!
  }

  type User {
    id: ID!
    name: String
    email: String
    createdAt: Date
    updatedAt: Date
    publishedAds: [Ad]
  }

  type Ad {
    id: ID!
    type: AdType
    category: Category
    location: Location
    title: String
    price: String @currencyFormat
    description: String
    photos: [String] @s3Prefix
    phone: [String]
    fields: JSON
    createdAt: Date
    updatedAt: Date
    expireAt: Date
    user: User
  }

  type Location {
    district: String
    city: String
  }

  type Category {
    field: String
    item: String
  }

  ## ENUMS
  enum Code {
    SUCCESS
    ERROR
  }

  enum AdType {
    SELL
    BUY
    RENT
  }

  ## INPUT
  input updateUserInput {
    name: String
    email: String
  }

  input createAdInput { # TODO: make those fields required
    type: AdType
    category: categoryInput
    location: locationInput
    title: String
    price: Float
    description: String
    phone: [String!]
    fields: JSON
    createdAt: Date
  }

  input updateAdInput {
    id: ID!
    category: categoryInput
    location: locationInput
    title: String
    price: Float
    description: String
    phone: [String]
    fields: JSON
    photos: [String]
    removePhotos: [String]
    updatedAt: Date # TODO: make those fields required
  }

  input locationInput {
    district: String
    city: String
  }

  input categoryInput {
    field: String
    item: String
  }

  input searchInput {
    query: String
    location: locationInput
    category: categoryInput
    limit: Int
    offset: Int
  }
`;
