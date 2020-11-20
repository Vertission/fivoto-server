const {
  ApolloError,
  AuthenticationError,
  UserInputError,
  ValidationError,
  ForbiddenError,
} = require("apollo-server");
const chalk = require("chalk");
const { ObjectID } = require("mongodb");

const MDB = require("../../database/local");

module.exports = {
  async ad(_, { id }) {
    console.log(chalk.blue("Query: ad"), id);

    try {
      const document = await MDB.collection("ads").findOne({
        id,
      });

      if (!document) return { id };

      return document;
    } catch (error) {
      console.log("ad -> error", error);
    }
  },
  async search(_, { query, category, location, offset, limit }) {
    console.log(chalk.blue("Query: search"));
    try {
      console.log("search -> limit", limit);
      console.log("search -> offset", offset);
      console.log("search -> location", location);
      console.log("search -> category", category);
      console.log("search -> query", query);

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

      console.log("search -> opts", opts);

      const cursor = MDB.collection("ads")
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
      console.log("search -> error", error);
    }
  },
};
