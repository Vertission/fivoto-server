const UtilsQuery = require("./query/utils");
const UserQuery = require("./query/user");
const AdQuery = require("./query/ad");

const UserMutation = require("./mutation/user");
const AdMutation = require("./mutation/ad");

const AdType = require("./types/ad");
const UserType = require("./types/user");

const { GraphQLScalarType } = require("graphql");
const { Kind } = require("graphql/language");

module.exports = {
  Query: {
    ...UtilsQuery,
    ...UserQuery,
    ...AdQuery,
  },
  Mutation: {
    ...UserMutation,
    ...AdMutation,
  },
  Ad: AdType,
  User: UserType,
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      return new Date(value); // value from the client
    },
  }),
};
