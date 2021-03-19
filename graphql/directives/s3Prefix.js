const { SchemaDirectiveVisitor } = require('apollo-server');
const { defaultFieldResolver, GraphQLString, isListType } = require('graphql');

class S3Prefix extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (...args) {
      const result = await resolve.apply(this, args);

      if (field.type === GraphQLString) {
        if (result) {
          return [process.env.AWS_S3_PREFIX, result].join('');
        } else {
          return null;
        }
      }

      if (isListType(field.type)) {
        if (result) {
          return result.map((key) => [process.env.AWS_S3_PREFIX, key].join(''));
        } else {
          return [];
        }
      }
    };
  }
}

module.exports = S3Prefix;
