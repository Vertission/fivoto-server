const AWS = require("aws-sdk");

function authUser(authorization) {
  return new Promise((resolve, reject) => {
    const cognito = new AWS.CognitoIdentityServiceProvider({
      region: "ap-south-1",
    });
    cognito.getUser(
      {
        AccessToken: authorization,
      },
      function (error, result) {
        if (error) {
          if (error.code === "NotAuthorizedException") resolve(null);
          else reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
}

module.exports = authUser;
