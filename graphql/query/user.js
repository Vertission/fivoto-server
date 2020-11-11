const { ApolloError, AuthenticationError } = require("apollo-server");
const chalk = require("chalk");
const Sentry = require("@sentry/node");

const User = require("../../database/remote/schema/user");
const authUser = require("../../utils/authUser");

module.exports = {
  async me(_, __, { headers }) {
    console.log(chalk.blue("Query: me"));
    try {
      const authentication = await authUser(headers.authorization);
      if (!authentication)
        return new AuthenticationError("NotAuthorizedException");

      const user = await User.findOne({
        cognito: authentication.Username,
      });

      // insert user
      if (user) {
        user.id = user._id;
        return user;
      } else {
        const emailAttribute = authentication.UserAttributes.filter(
          (attr) => attr.Name === "email"
        )[0];

        const newUser = new User({
          cognito: authentication.Username,
          email: emailAttribute.Value,
          name: emailAttribute.Value.split("@")[0],
        });

        await newUser.save();

        const user = await User.findOne({
          cognito: authentication.Username,
        });

        user.id = user._id;
        return user;
      }
    } catch (error) {
      console.log("Query:Me", error);

      const scope = new Sentry.Scope();
      scope.setTag("resolver", "Query:me");
      scope.setContext("header", headers);

      const code = Sentry.captureException(error, scope);
      return new ApolloError("internalServerError", code);
    }
  },
};
