const config = require("../../config/index.json");
const { SchemaDirectiveVisitor } = require("apollo-server");
const { defaultFieldResolver } = require("graphql");

class CurrencyFormatDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (...args) {
      const result = await resolve.apply(this, args);
      if (!result) return [config.currency, "0"].join(" ");
      return [config.currency, Number(result.toFixed(1)).toLocaleString()].join(
        " "
      );
    };
  }
}

module.exports = CurrencyFormatDirective;
