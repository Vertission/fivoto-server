require("dotenv").config();
const { ApolloServer, gql } = require("apollo-server");
const Sentry = require("@sentry/node");
// const Tracing = require("@sentry/tracing"); // TODO: whats this?

require("./database/local");
require("./database/remote");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const directives = require("./graphql/directives");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    return { headers: req.headers };
  },
  schemaDirectives: directives,
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

Sentry.init({
  dsn:
    "https://a8c2792bc3814cc48bcd15ebb3888c95@o468316.ingest.sentry.io/5510948", // TODO: env it
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
