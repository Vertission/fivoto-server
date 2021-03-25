const { gql } = require('apollo-server');

module.exports = gql`
  scalar Date
  scalar JSON

  type Query {
    # user
    me: User!
    # ad
    ad(id: ID!): Ad!
    adPhotos(id: ID!): Ad!
    ads(first: Int, after: String, filter: searchFilterInput): Ads!
    # utils
    config: JSON!
    location: JSON!
    category: JSON!
    country: JSON!
    fields: JSON!
  }

  # custom directives
  directive @s3Prefix on FIELD_DEFINITION
  directive @currencyFormat on FIELD_DEFINITION

  type Mutation {
    # user
    updateUser(data: updateUserInput!): ID!
    # ad
    createAd(data: createAdInput!): ID!
    updateAd(data: updateAdInput!): ID!
    deleteAd(id: ID!): ID!
  }

  type User {
    id: ID!
    name: String
    email: String
    email_verified: Boolean
    profile: String @s3Prefix
    createdAt: Date
    updatedAt: Date

    publishedAds: [Ad] # FIX: relay style fetching
  }

  type Ad {
    id: ID!
    slug: String
    status: AdStatus
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

  type PageInfo {
    endCursor: String
    hasNextPage: Boolean
  }

  type AdsEdge {
    cursor: String
    node: Ad
  }

  type Ads {
    edges: [AdsEdge]
    pageInfo: PageInfo
  }

  ## Queries

  type QuerySearch_relay {
    edges: [AdEdge]
    pageInfo: PageInfo!
  }

  type AdEdge {
    cursor: String
    node: Ad
  }

  type QuerySearch {
    ads: [Ad]
    total: Int
  }

  ## ENUMS
  enum Code {
    SUCCESS
    ERROR
  }

  enum AdStatus {
    APPROVED
    PENDING
    REJECTED
  }

  input createAdInput { # TODO: make those fields required
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

  input updateUserInput {
    name: String
    profile: String
  }

  input searchInput {
    query: String
    location: locationInput
    category: categoryInput
    limit: Int
    offset: Int
  }

  input searchFilterInput {
    query: String
    category: categoryInput
    location: locationInput
  }
`;
