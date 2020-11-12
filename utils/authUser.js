const cognito = require("../setup/cognito");

function authUser(authorization) {
  return new Promise((resolve, reject) => {
    if (!authorization) resolve(null);

    cognito.getUser(
      {
        AccessToken: authorization,
      },
      function (error, result) {
        if (error) {
          if (
            error.code === "NotAuthorizedException" ||
            error.code === "UserNotFoundException"
          )
            resolve(null);
          else reject(error);
        } else {
          let userObj = {};
          result.UserAttributes.map(
            (attr) => (userObj[attr.Name] = attr.Value)
          );

          userObj.mongodb = userObj["custom:mongodb"];

          resolve(userObj);
        }
      }
    );
  });
}

module.exports = authUser;
