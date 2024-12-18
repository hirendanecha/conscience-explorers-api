const jwt = require("jsonwebtoken");
const env = require("../environments/environment");

// module.exports = function () {
//   this.generateJwtToken = (user) => {
//     const payload = {
//       user: {
//         id: user.profileId,
//         username: user.Username,
//         active: user.IsActive,
//       },
//     };

//     return jwt.sign(payload, env.JWT_SECRET_KEY);
//   };
// };

exports.generateJwtToken = (req) => {
  try {
    const payload = {};
    payload["user"] = req;
    return jwt.sign(payload, env.JWT_SECRET_KEY);
  } catch (error) {
    return error;
  }
};
