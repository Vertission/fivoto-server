const { ApolloError } = require('apollo-server');
const slugify = require('slugify');

const MDB = require('../../database/local');
const mongoist = require('../../database/local/mongoist');

const Sentry = require('@sentry/node');
const MongoPaging = require('mongo-cursor-pagination');
const graphqlFields = require('graphql-fields');

const intersection = require('../intersection');

const delay = require('delay');

module.exports = {
  async ad(_, { id }) {
    console.log('Query:ad', id);
    try {
      const document = await MDB.collection('ads').findOne({
        id,
      });

      if (!document) return { id };

      return document;
    } catch (error) {
      console.log('Query:ad', error);

      const scope = new Sentry.Scope();
      scope.setTag('resolver', 'Query:ad');
      scope.setContext('data', { id });

      const code = Sentry.captureException(error, scope);
      return new ApolloError('InternalServerError', code, error);
    }
  },
  async ads(_, { first, after, filter }, {}, info) {
    try {
      const attributes = intersection.ad(graphqlFields(info).edges.node);

      const findOpts = {};

      if (filter) {
        const { query, location, category } = filter;

        if (query) {
          findOpts['$text'] = { $search: query };
        }

        if (location?.district) {
          findOpts['location.district'] = location.district;
          if (location.city) findOpts['location.city'] = location.city;
        }

        if (category?.field) {
          findOpts['category.field'] = category.field;
          if (category.item) findOpts['category.item'] = category.item;
        }
      }

      const { results, next, hasNext } = await MongoPaging.find(mongoist.collection('ads'), {
        query: findOpts,
        limit: first,
        next: after,
        fields: attributes,
      });

      const generateSlug = (data) => {
        return slugify(
          [
            data.title,
            data.location.city,
            data.location.district,
            data.category.item,
            data.category.field,
            data.id,
          ].join(' '),
          {
            lower: true,
          }
        );
      };

      const edges = results.map((node) => ({
        cursor: node.id,
        node: { ...node, slug: generateSlug(node) },
      }));

      return {
        edges,
        pageInfo: {
          endCursor: next,
          hasNextPage: hasNext,
        },
      };
    } catch (error) {
      console.log('Query:search_relay', error);

      const scope = new Sentry.Scope();
      scope.setTag('resolver', 'Query:search_relay');
      scope.setContext('data', { query, category, location, offset, limit });

      const code = Sentry.captureException(error, scope);
      return new ApolloError('InternalServerError', code, error);
    }
  },
  async adPhotos(_, { id }) {},
};
