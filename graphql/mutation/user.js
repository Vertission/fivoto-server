const { ApolloError, AuthenticationError } = require('apollo-server');
const Sentry = require('@sentry/node');

const chalk = require('chalk');

const User = require('../../database/remote/model/user');
const authUser = require('../../utils/authUser');

module.exports = {
  async updateUser(_, { data }, { headers }) {
    console.log(chalk.blue('Mutation: updateUser'));
    try {
      const authentication = await authUser(headers.authorization);
      if (!authentication) return new AuthenticationError('NotAuthorizedException');

      console.log(data);

      const updatedUser = await User.findByIdAndUpdate(authentication.mongodb, data);

      if (!updatedUser) return new AuthenticationError('NotAuthorizedException');

      return updatedUser.id;
    } catch (error) {
      console.log('updateUser -> error', error);

      const scope = new Sentry.Scope();
      scope.setTag('resolver', 'Mutation:updateUser');
      scope.setContext('data', data);
      scope.setContext('header', headers);

      const code = Sentry.captureException(error, scope);
      return new ApolloError('InternalServerError', code);
    }
  },
};
