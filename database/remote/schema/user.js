const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: { type: String, require: true, unique: true },
    name: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("User", userSchema);
