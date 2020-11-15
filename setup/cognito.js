const AWS = require("aws-sdk");

module.exports = new AWS.CognitoIdentityServiceProvider({
  region: "ap-south-1",
});
