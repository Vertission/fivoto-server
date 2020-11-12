const User = require("../../database/remote/schema/user");

const chalk = require("chalk");

module.exports = {
  async user(parent) {
    console.log(chalk.greenBright("Type: ads.user"));

    if (!parent.user) return null;
    else {
      const user = await User.findById(parent.user, "name");

      user.id = user._id;
      return user;
    }
  },
};
