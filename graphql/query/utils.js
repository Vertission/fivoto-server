const {
  ApolloError,
  AuthenticationError,
  UserInputError,
  ValidationError,
  ForbiddenError,
} = require("apollo-server");
const chalk = require("chalk");

const Location = require("../../assets/location.json");
const Category = require("../../assets/category.json");
const Country = require("../../assets/country.json");

module.exports = {
  location() {
    console.log(chalk.blue("Query: Location"));
    try {
      return Location;
    } catch (err) {
      console.log(err);
    }
  },
  category() {
    console.log(chalk.blue("Query: Category"));
    try {
      return Category;
    } catch (err) {
      console.log(err);
    }
  },
  country() {
    console.log(chalk.blue("Query: Country"));
    try {
      return Country;
    } catch (err) {
      console.log(err);
    }
  },
};
