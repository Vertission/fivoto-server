const { ObjectID } = require("mongodb");
const MDB = require("../../database/local");

module.exports = {
  async ads(parent) {
    return await MDB.collection("ads")
      .find({
        user: parent._id,
      })
      .toArray();
  },
};
