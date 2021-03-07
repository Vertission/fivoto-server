const AWS = require('aws-sdk');

module.exports = new AWS.CognitoIdentityServiceProvider({
  region: process.env.AWS_REGION,
});
