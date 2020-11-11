const {
  ApolloError,
  AuthenticationError,
  UserInputError,
  ValidationError,
  ForbiddenError,
} = require("apollo-server");
const { ObjectID } = require("mongodb");
const delay = require("delay");

// const slugify = require("slugify");

const chalk = require("chalk");

const User = require("../../database/remote/schema/user");
const MDB = require("../../database/local");
const authUser = require("../../utils/authUser");
const S3 = require("../../setup/s3");

const CB = {};

module.exports = {
  async createAd(_, { data }, { headers }) {
    console.log(chalk.yellow("Mutation: createAd"));
    try {
      const authentication = await authUser(headers.authorization);
      if (!authentication)
        return new AuthenticationError("NotAuthorizedException");

      data.user = ObjectID(data.user);
      data.expireAt = new Date(new Date().getTime() + 10 * 86400000);

      const { insertedId } = await MDB.collection("ads").insertOne(data);
      MDB.collection("ads").createIndex({ title: "text", description: "text" });

      return insertedId;
    } catch (error) {
      console.log("createAd -> error", error);
      return new ApolloError(error);
    }
  },
  async updateAd(_, { data }, { headers }) {
    console.log(chalk.yellow("Mutation: updateAd"));
    try {
      const authentication = await authUser(headers.authorization);
      if (!authentication)
        return new AuthenticationError("NotAuthorizedException");

      // get user
      const user = await User.findOne(
        { cognito: authentication.Username },
        "id"
      );

      if (!user) return new AuthenticationError("NotAuthorizedException");

      // authenticate user with document
      const isDocumentExist = await MDB.collection("ads").countDocuments({
        _id: ObjectID(data.id),
        user: user._id,
      });
      if (!isDocumentExist)
        return new AuthenticationError("NotAuthorizedException");

      /**
       * remove objects from s3
       */
      if (data.removePhotos && data.removePhotos.length) {
        const keys = data.removePhotos.map((key) => ({
          Key: `public/${key.replace(process.env.S3PREFIX, "")}`,
        }));
        const params = {
          Bucket: process.env.AWS_BUCKET,
          Delete: { Objects: keys },
        };
        S3.deleteObjects(params, (error, data) => {
          if (error) console.log(error);
          else console.log(data);
        });
      }

      if (data.photos) {
        data.photos = data.photos.map((photo) =>
          photo.replace(process.env.AWS_S3PREFIX, "")
        );

        delete data.removePhotos;
      }

      const oldDocument = await MDB.collection("ads").findOne({
        _id: ObjectID(data.id),
      });

      const document = Object.assign({}, oldDocument, data);
      document.id = String(document._id);

      await MDB.collection("ads").replaceOne(
        { _id: ObjectID(data.id) },
        document
      );
      return document;
    } catch (error) {
      console.log("updateAd -> error", error);
      return new ApolloError(error);
    }
  },
  async deleteAd(_, { id }, { headers }) {
    console.log(chalk.yellow("Mutation: deleteAd"));
    try {
      await authUser(headers.authorization);

      await CB.remove(id);

      /**
       * delete advert photos folder
       */

      S3.listObjects(
        { Bucket: process.env.AWS_BUCKET, Prefix: `public/ads/${id}` },
        function (error, data) {
          if (error) return console.log(error);
          if (data.Contents.length == 0) return null;

          let params = { Bucket: process.env.AWS_BUCKET };
          params.Delete = { Objects: [] };

          data.Contents.forEach(function (content) {
            params.Delete.Objects.push({ Key: content.Key });
          });

          S3.deleteObjects(params, function (error, data) {
            if (error) return callback(error);
            else return null;
          });
        }
      );

      return id;
    } catch (error) {
      console.log("updateUser -> error", error);
      // if (error.code === "NotAuthorizedException")
      //   return new AuthenticationError("NotAuthorizedException");
      // else {
      //   const scope = new Sentry.Scope();
      //   scope.setTag("resolver", "Mutation:deleteAd");
      //   scope.setTag("server", true);
      //   scope.setContext("data", { id });
      //   scope.setContext("header", headers);

      //   const code = Sentry.captureException(error, scope);
      //   return new ApolloError("internalServerError", code);
      // }
    }
  },
};
