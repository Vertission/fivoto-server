const config = require("../../config/index.json");
const aws = require("aws-sdk");

module.exports = new aws.S3({
  accessKeyId: config.aws.ACCESS_KEY_ID,
  secretAccessKey: config.aws.SECRET_ACCESS_KEY,
  signatureVersion: "v4",
  region: config.aws.REGION,
});
