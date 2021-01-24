const JWT = require("jsonwebtoken");

async function verifyToken(token) {
  const decodedToken = await JWT.decode(token, "mk");
  return decodedToken;
}

module.exports = {
  verifyToken,
};
