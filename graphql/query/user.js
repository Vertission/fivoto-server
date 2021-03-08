const { ApolloError, AuthenticationError } = require('apollo-server');
const Sentry = require('@sentry/node');

const User = require('../../database/remote/schema/user');
const authUser = require('../../utils/authUser');
const cognito = require('../../setup/aws/cognito');

module.exports = {
  async me(_, __, { headers }) {
    console.log('Query:me');
    try {
      const authentication = await authUser(headers.authorization);
      if (!authentication) return new AuthenticationError('NotAuthorizedException');

      const user = await User.findById(authentication.mongodb);

      if (user) {
        user.id = user._id;
        return { ...user, email: authentication.email };
      } else {
        // insert user
        const newUser = new User({
          name: authentication.name,
        });

        await newUser.save();

        const user = await User.findById(newUser._id);

        await cognito
          .adminUpdateUserAttributes(
            {
              UserAttributes: [{ Name: 'custom:mongodb', Value: String(user._id) }],
              UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
              Username: authentication.sub,
            },
            (error) => {
              if (error) throw error;
            }
          )
          .promise();

        await cognito
          .adminDeleteUserAttributes(
            {
              UserAttributeNames: ['name'],
              UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
              Username: authentication.sub,
            },
            (error) => {
              if (error) throw error;
            }
          )
          .promise();

        user.id = user._id;
        return user;
      }
    } catch (error) {
      console.log('Query:Me', error);

      const scope = new Sentry.Scope();
      scope.setTag('resolver', 'Query:me');
      scope.setContext('header', headers);

      const code = Sentry.captureException(error, scope);
      return new ApolloError('InternalServerError', code, error);
    }
  },
};
