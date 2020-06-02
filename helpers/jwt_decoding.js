const jwt = require("jsonwebtoken");

const getUsernameFromToken = (token) => {
  const decoded = jwt.decode(token);
  return decoded.name;
};

const getTokenFromRequest = (req) => {
  const bearerToken = req.header("Authorization");
  if (bearerToken) {
    const token = bearerToken.split(" ")[1];
    return token;
  } else {
    return null;
  }
};

module.exports = { getUsernameFromToken, getTokenFromRequest };
