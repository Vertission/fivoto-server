const config = require("../../config/index.json");
const aws = require("aws-sdk");

aws.config.update({
  region: config.aws.REGION,
  accessKeyId: config.aws.ACCESS_KEY_ID,
  secretAccessKey: config.aws.SECRET_ACCESS_KEY,
});
