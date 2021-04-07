const { SchemaDirectiveVisitor } = require('apollo-server');
const { defaultFieldResolver } = require('graphql');

class CurrencyFormatDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (...args) {
      const result = await resolve.apply(this, args);
      if (!result) return [process.env.CURRENCY, '0'].join(' ');
      return [process.env.CURRENCY, Number(result.toFixed(1)).toLocaleString()].join(' ');
    };
  }
}

module.exports = CurrencyFormatDirective;
