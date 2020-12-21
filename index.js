require('dotenv').config();
const { ApolloServer } = require('apollo-server');

require('./setup/sentry');
require('./setup/aws');
require('./database/local');
require('./database/remote');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const directives = require('./graphql/directives');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    return { headers: req.headers };
  },
  schemaDirectives: directives,
  playground: process.env.NODE_ENV === 'development',
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
