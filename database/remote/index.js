const config = require("../../config/index.json");
const mongoose = require("mongoose");

mongoose.connect(config.mongodb.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
