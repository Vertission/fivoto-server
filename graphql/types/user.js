const { ApolloError, AuthenticationError } = require("apollo-server");
const Sentry = require("@sentry/node");
const MDB = require("../../database/local");

const chalk = require("chalk");

module.exports = {
  async publishedAds(parent) {
    console.log(chalk.greenBright("Type:user.ads"));
    try {
      return await MDB.collection("ads")
        .find({
          user: parent._id,
          status: "APPROVED",
        })
        .toArray();
    } catch (error) {
      console.log("ads -> error", error);

      const scope = new Sentry.Scope();
      scope.setTag("resolver.type", "user.publishedAds");
      scope.setContext("parent", parent);

      const code = Sentry.captureException(error, scope);
      return new ApolloError("InternalServerError", code, error);
    }
  },
};
