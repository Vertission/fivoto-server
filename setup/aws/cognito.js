const config = require("../../config/index.json");
const AWS = require("aws-sdk");

module.exports = new AWS.CognitoIdentityServiceProvider({
  region: config.aws.REGION,
});
