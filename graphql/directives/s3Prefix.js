const { SchemaDirectiveVisitor } = require('apollo-server');
const { defaultFieldResolver } = require('graphql');

class S3Prefix extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (...args) {
      const result = await resolve.apply(this, args);
      if (!result) return [];
      else if (typeof result === 'string') return [process.env.AWS_S3_PREFIX, result].join('');
      else return result.map((key) => [process.env.AWS_S3_PREFIX, key].join(''));
    };
  }
}

module.exports = S3Prefix;
