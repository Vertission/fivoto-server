const { ApolloError, AuthenticationError } = require("apollo-server");
const Sentry = require("@sentry/node");
const User = require("../../database/remote/schema/user");

const chalk = require("chalk");

module.exports = {
  async user(parent) {
    console.log(chalk.greenBright("Type:ad.user"));
    try {
      const user = await User.findById(parent.user, "name");
      if (!user) return null;

      user.id = user._id;
      return user;
    } catch (error) {
      console.log("user -> error", error);

      const scope = new Sentry.Scope();
      scope.setTag("resolver.type", "ad.user");
      scope.setContext("parent", parent);

      const code = Sentry.captureException(error, scope);
      return new ApolloError("InternalServerError", code, error);
    }
  },
};
