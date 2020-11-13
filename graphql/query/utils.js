const { ApolloError } = require("apollo-server");
const Sentry = require("@sentry/node");

const chalk = require("chalk");

const Location = require("../../assets/location.json");
const Category = require("../../assets/category.json");
const Country = require("../../assets/country.json");

module.exports = {
  location() {
    console.log(chalk.blue("Query: Location"), TEST_ENV);
    try {
      return Location;
    } catch (error) {
      console.log("Query:Location", error);

      const scope = new Sentry.Scope();
      scope.setTag("resolver", "Query:location");

      const code = Sentry.captureException(error, scope);
      return new ApolloError("InternalServerError", code, error);
    }
  },
  category() {
    console.log(chalk.blue("Query: Category"));
    try {
      return Category;
    } catch (error) {
      console.log("Query:Category", error);

      const scope = new Sentry.Scope();
      scope.setTag("resolver", "Query:category");

      const code = Sentry.captureException(error, scope);
      return new ApolloError("InternalServerError", code, error);
    }
  },
  country() {
    console.log(chalk.blue("Query: Country"));
    try {
      return Country;
    } catch (error) {
      console.log("Query:Country", error);

      const scope = new Sentry.Scope();
      scope.setTag("resolver", "Query:country");

      const code = Sentry.captureException(error, scope);
      return new ApolloError("InternalServerError", code, error);
    }
  },
};
