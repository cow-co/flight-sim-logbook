const jwt = require("jsonwebtoken");

const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
};

const getUsernameFromToken = (token) => {
  const decoded = jwt.decode(token);
  return decoded.username;
};

const isTokenExpired = (token) => {
  const decoded = jwt.decode(token);
  return Date.now() >= decoded.exp * 1000;
};

export { isEmpty, getUsernameFromToken, isTokenExpired };
