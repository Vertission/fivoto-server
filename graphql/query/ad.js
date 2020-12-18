const MDB = require('../../database/local');
const mongoist = require('../../database/local/mongoist');

const Sentry = require('@sentry/node');
const MongoPaging = require('mongo-cursor-pagination');

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
  async search(_, { query, category, location, offset, limit }) {
    console.log('Query:search');
    try {
      const opts = {};

      if (query) {
        opts['$text'] = { $search: query };
      }

      if (location.district) {
        opts['location.district'] = location.district;
        if (location.city) opts['location.city'] = location.city;
      }

      if (category.field) {
        opts['category.field'] = category.field;
        if (category.item) opts['category.item'] = category.item;
      }

      const cursor = await MDB.collection('ads')
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
      console.log('Query:search', error);

      const scope = new Sentry.Scope();
      scope.setTag('resolver', 'Query:search');
      scope.setContext('data', { query, category, location, offset, limit });

      const code = Sentry.captureException(error, scope);
      return new ApolloError('InternalServerError', code, error);
    }
  },
  async search_relay(_, { first, after, filter }) {
    console.log('🚀 after', after);
    try {
      const findOpts = {};

      const { query, location, category } = filter;

      if (query) {
        findOpts['$text'] = { $search: query };
      }

      if (location.district) {
        findOpts['location.district'] = location.district;
        if (location.city) findOpts['location.city'] = location.city;
      }

      if (category.field) {
        findOpts['category.field'] = category.field;
        if (category.item) findOpts['category.item'] = category.item;
      }

      const {
        results,
        next,
        previous,
        hasNext,
        hasPrevious,
      } = await MongoPaging.find(mongoist.collection('ads'), {
        query: findOpts,
        limit: first,
        next: after,
        fields: {
          id: 1,
          title: 1,
          photos: { $first: '$photos' },
          createdAt: 1,
          location: 1,
          price: 1,
        },
      });

      return {
        edges: { node: results },
        pageInfo: {
          endCursor: next,
          startCursor: previous,
          hasNextPage: hasNext,
          hasPreviousPage: hasPrevious,
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
  async adPhotos(_, { id }) {
    try {
      return await mongoist
        .collection('ads')
        .findOne({ id }, { photos: 1, id: 1 });
    } catch (error) {
      console.log('Query:adPhotos', error);

      const scope = new Sentry.Scope();
      scope.setTag('resolver', 'Query:adPhotos');
      scope.setContext('data', { query, category, location, offset, limit });

      const code = Sentry.captureException(error, scope);
      return new ApolloError('InternalServerError', code, error);
    }
  },
};
