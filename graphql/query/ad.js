const MDB = require("../../database/local");
const Sentry = require("@sentry/node");

module.exports = {
  async ad(_, { id }) {
    console.log("Query:ad", id);
    try {
      const document = await MDB.collection("ads").findOne({
        id,
      });

      if (!document) return { id };

      return document;
    } catch (error) {
      console.log("Query:ad", error);

      const scope = new Sentry.Scope();
      scope.setTag("resolver", "Query:ad");
      scope.setContext("data", { id });

      const code = Sentry.captureException(error, scope);
      return new ApolloError("InternalServerError", code, error);
    }
  },
  async search(_, { query, category, location, offset, limit }) {
    console.log("Query:search");
    try {
      const opts = {};

      if (query) {
        opts["$text"] = { $search: query };
      }

      if (location.district) {
        opts["location.district"] = location.district;
        if (location.city) opts["location.city"] = location.city;
      }

      if (category.field) {
        opts["category.field"] = category.field;
        if (category.item) opts["category.item"] = category.item;
      }

      console.log("opts >", opts);

      const cursor = await MDB.collection("ads")
        .find(opts)
        .limit(limit)
        .skip(offset)
        .sort({ createdAt: query ? 1 : -1 })
        .project({
          id: 1,
          title: 1,
          photos: 1,
          createdAt: 1,
          location: 1,
          price: 1,
        });

      return {
        ads: cursor.toArray(),
        total: cursor.count(),
      };
    } catch (error) {
      console.log("Query:search", error);

      const scope = new Sentry.Scope();
      scope.setTag("resolver", "Query:search");
      scope.setContext("data", { query, category, location, offset, limit });

      const code = Sentry.captureException(error, scope);
      return new ApolloError("InternalServerError", code, error);
    }
  },
};
