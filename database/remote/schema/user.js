const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    cognito: { type: String, require: true, unique: true },
    email: { type: String, require: true, unique: true },
    name: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("User", userSchema);
