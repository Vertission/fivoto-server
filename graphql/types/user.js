const MDB = require("../../database/local");

const chalk = require("chalk");

module.exports = {
  async ads(parent) {
    console.log(chalk.greenBright("Type: user.ads"));

    return await MDB.collection("ads")
      .find({
        user: parent._id,
      })
      .toArray();
  },
};
