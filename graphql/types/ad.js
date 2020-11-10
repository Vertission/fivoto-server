const User = require("../../database/remote/schema/user");

module.exports = {
  async user(parent) {
    if (!parent.user) return null;
    else {
      const user = await User.findById(parent.user, "name");

      user.id = user._id;
      return user;
    }
  },
};
