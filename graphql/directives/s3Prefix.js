const config = require("../../config/index.json");
const { SchemaDirectiveVisitor } = require("apollo-server");
const { defaultFieldResolver } = require("graphql");

class S3Prefix extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (...args) {
      const result = await resolve.apply(this, args);
      if (!result) return [];
      else if (typeof result === "string")
        return [config.s3_prefix, result].join("");
      else return result.map((key) => [config.s3_prefix, key].join(""));
    };
  }
}

module.exports = S3Prefix;
