const { ApolloError } = require('apollo-server');
const Sentry = require('@sentry/node');

const Location = require('../../config/assets/location.json');
const Category = require('../../config/assets/category.json');
const Country = require('../../config/assets/country.json');
const Fields = require('../../config/assets/field.json');

module.exports = {
  location() {
    console.log('Query:location');
    try {
      return Location;
    } catch (error) {
      console.log('Query:location', error);

      const scope = new Sentry.Scope();
      scope.setTag('resolver', 'Query:location');

      const code = Sentry.captureException(error, scope);
      return new ApolloError('InternalServerError', code, error);
    }
  },
  category() {
    console.log('Query:category');
    try {
      return Category;
    } catch (error) {
      console.log('Query:Category', error);

      const scope = new Sentry.Scope();
      scope.setTag('resolver', 'Query:category');

      const code = Sentry.captureException(error, scope);
      return new ApolloError('InternalServerError', code, error);
    }
  },
  country() {
    console.log('Query:country');
    try {
      return Country;
    } catch (error) {
      console.log('Query:Country', error);

      const scope = new Sentry.Scope();
      scope.setTag('resolver', 'Query:country');

      const code = Sentry.captureException(error, scope);
      return new ApolloError('InternalServerError', code, error);
    }
  },
  fields() {
    console.log('Query:fields');
    try {
      return Fields;
    } catch (error) {
      console.log('Query:fields', error);

      const scope = new Sentry.Scope();
      scope.setTag('resolver', 'Query:fields');

      const code = Sentry.captureException(error, scope);
      return new ApolloError('InternalServerError', code, error);
    }
  },
};
