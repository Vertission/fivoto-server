const UtilsQuery = require("./query/utils");
const UserQuery = require("./query/user");
const AdQuery = require("./query/ad");

const UserMutation = require("./mutation/user");
const AdMutation = require("./mutation/ad");

const AdType = require("./types/ad");
const UserType = require("./types/user");

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
};
