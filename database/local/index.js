// const { ObjectID } = require("mongodb");
// const db = require("../../setup/mongodb");

// async function create(document) {
//   try {
// const { insertedId } = await db.collection("ads").insertOne(document);
// return insertedId;
//   } catch (error) {
//     console.log("create -> error", error);
//   }
// }

// async function update(id, document) {
//   try {
//     delete document.id;

//     const { ops } = await db
//       .collection("ads")
//       .replaceOne({ _id: ObjectID(id) }, document);

//     ops[0].id = id;

//     return ops[0];
//   } catch (error) {
//     console.log("update -> error", error);
//   }
// }

// async function get(id) {
//   try {
//     const document = await db.collection("ads").findOne({ _id: ObjectID(id) });

//     document.id = document._id;
//     return document;
//   } catch (error) {
//     console.log("get -> error", error);
//   }
// }

// async function get(id) {
//   try {
//     const document = await db.collection("ads").findOne({ _id: ObjectID(id) });

//     document.id = document._id;
//     return document;
//   } catch (error) {
//     console.log("get -> error", error);
//   }
// }

// async function auth(id, userId) {
//   try {
//   } catch (error) {
//     console.log("auth -> error", error);
//   }
// }

// module.exports = {
//   create,
//   update,
//   get,
// };

const MongoClient = require("mongodb").MongoClient;

// Connection URL
const url = "mongodb://localhost:27017";

// Database Name
const dbName = "fivoto";

// Create a new MongoClient
const client = new MongoClient(url, { useUnifiedTopology: true });

// Use connect method to connect to the Server
client.connect(function (err) {
  if (err) {
    console.error(err);
    client.close();
  } else {
    console.log("Mongodb:Local Connected successfully");
    client.db(dbName);
  }
});

module.exports = client.db(dbName);
