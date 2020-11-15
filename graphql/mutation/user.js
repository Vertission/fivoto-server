const { ApolloError, AuthenticationError } = require("apollo-server");
const Sentry = require("@sentry/node");

const chalk = require("chalk");

const User = require("../../database/remote/schema/user");
const authUser = require("../../utils/authUser");

module.exports = {
  async updateUser(_, { data }, { headers }) {
    console.log(chalk.blue("Mutation: updateUser"));
    try {
      const authentication = await authUser(headers.authorization);
      if (!authentication)
        return new AuthenticationError("NotAuthorizedException");

      const updatedUser = await User.findByIdAndUpdate(
        authentication.mongodb,
        data,
        { new: true }
      );

      if (!updatedUser)
        return new AuthenticationError("NotAuthorizedException");

      updatedUser.id = updatedUser._id;
      return updatedUser;
    } catch (error) {
      console.log("updateUser -> error", error);

      const scope = new Sentry.Scope();
      scope.setTag("resolver", "Mutation:updateUser");
      scope.setContext("data", data);
      scope.setContext("header", headers);

      const code = Sentry.captureException(error, scope);
      return new ApolloError("InternalServerError", code);
    }
  },
};
