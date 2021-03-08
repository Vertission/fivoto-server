const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    name: String,
    profile: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model('User', userSchema);
