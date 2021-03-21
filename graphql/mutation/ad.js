const { ApolloError, AuthenticationError } = require('apollo-server');
const { ObjectID } = require('mongodb');
const Sentry = require('@sentry/node');

const MDB = require('../../database/local');
const authUser = require('../../utils/authUser');
const S3 = require('../../setup/aws/s3');

module.exports = {
  async createAd(_, { data }, { headers }) {
    console.log('Mutation:createAd');
    try {
      const authentication = await authUser(headers.authorization);
      if (!authentication) return new AuthenticationError('NotAuthorizedException');

      data.user = ObjectID(authentication.mongodb);
      data.expireAt = new Date(new Date().getTime() + 41 * 86400000); // expire after 41 day
      data.status = 'APPROVED';

      const { insertedId } = await MDB.collection('ads').insertOne(data);

      await MDB.collection('ads').updateOne({ _id: insertedId }, { $set: { id: String(insertedId) } });

      MDB.collection('ads').createIndex({ title: 'text', description: 'text' });
      MDB.collection('ads').createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 });

      return insertedId;
    } catch (error) {
      console.log('createAd -> error', error);

      const scope = new Sentry.Scope();
      scope.setTag('resolver', 'Mutation:createAd');
      scope.setContext('data', data);
      scope.setContext('header', headers);

      const code = Sentry.captureException(error, scope);
      return new ApolloError('InternalServerError', code);
    }
  },
  async updateAd(_, { data }, { headers }) {
    console.log('Mutation: updateAd');
    try {
      const authentication = await authUser(headers.authorization);
      if (!authentication) return new AuthenticationError('NotAuthorizedException');

      // authenticate user with document
      const isDocumentExist = await MDB.collection('ads').countDocuments({
        _id: ObjectID(data.id),
        user: ObjectID(authentication.mongodb),
      });
      if (!isDocumentExist) return new AuthenticationError('NotAuthorizedException');

      if (data.removePhotos && data.removePhotos.length) {
        const keys = data.removePhotos.map((key) => ({
          Key: `public/${key.replace(process.env.AWS_S3_PREFIX, '')}`,
        }));
        const params = {
          Bucket: process.env.AWS_S3_BUCKET,
          Delete: { Objects: keys },
        };
        S3.deleteObjects(params, (error, data) => {
          if (error) console.log(error);
          else console.log(data);
        });
      }

      if (data.photos) {
        data.photos = data.photos.map((photo) => photo.replace(process.env.AWS_S3_PREFIX, ''));

        delete data.removePhotos;
      }

      const oldDocument = await MDB.collection('ads').findOne({
        _id: ObjectID(data.id),
      });

      const document = Object.assign({}, oldDocument, data);

      await MDB.collection('ads').replaceOne({ _id: ObjectID(data.id) }, document);
      return document.id;
    } catch (error) {
      console.log('updateAd -> error', error);

      const scope = new Sentry.Scope();
      scope.setTag('resolver', 'Mutation:updateAd');
      scope.setContext('data', data);
      scope.setContext('header', headers);

      const code = Sentry.captureException(error, scope);
      return new ApolloError('InternalServerError', code);
    }
  },
  async deleteAd(_, { id }, { headers }) {
    console.log('Mutation:deleteAd');
    try {
      const authentication = await authUser(headers.authorization);
      if (!authentication) return new AuthenticationError('NotAuthorizedException');

      // authenticate user with document
      const isDocumentExist = await MDB.collection('ads').countDocuments({
        _id: ObjectID(id),
        user: ObjectID(authentication.mongodb),
      });
      if (!isDocumentExist) return new AuthenticationError('NotAuthorizedException');

      await MDB.collection('ads').deleteOne({ _id: ObjectID(id) });

      /**
       * delete advert photos folder
       */

      S3.listObjects({ Bucket: process.env.AWS_S3_BUCKET, Prefix: `public/ads/${id}` }, function (error, data) {
        if (error) return console.log(error);
        if (data.Contents.length == 0) return null;

        let params = { Bucket: process.env.AWS_S3_BUCKET };
        params.Delete = { Objects: [] };

        data.Contents.forEach(function (content) {
          params.Delete.Objects.push({ Key: content.Key });
        });

        S3.deleteObjects(params, function (error, data) {
          if (error) return callback(error);
          else return null;
        });
      });

      return id;
    } catch (error) {
      console.log('deleteAd -> error', error);

      const scope = new Sentry.Scope();
      scope.setTag('resolver', 'Mutation:deleteAd');
      scope.setContext('data', { id });
      scope.setContext('header', headers);

      const code = Sentry.captureException(error, scope);
      return new ApolloError('InternalServerError', code);
    }
  },
};
