const aws = require("aws-sdk");

module.exports = new aws.S3({
  accessKeyId: "AKIA5RTSM74BPI5WLEUN",
  secretAccessKey: "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",
  signatureVersion: "v4",
  region: "ap-south-1",
});
