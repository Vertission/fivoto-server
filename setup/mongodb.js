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
