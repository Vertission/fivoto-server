const { SchemaDirectiveVisitor } = require("apollo-server");
const { defaultFieldResolver } = require("graphql");
const Sentry = require("@sentry/node");

class CurrencyFormatDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (...args) {
      const result = await resolve.apply(this, args);
      if (!result) return `${process.env.CURRENCY} 0`;
      return `${process.env.CURRENCY} ${Number(
        result.toFixed(1)
      ).toLocaleString()}`;
    };
  }
}

module.exports = CurrencyFormatDirective;
