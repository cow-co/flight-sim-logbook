const jwt = require("jsonwebtoken");

const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
};

const isLoggedIn = () => {
  const isLoggedIn = !isEmpty(localStorage.getItem("token"));
  console.log(isLoggedIn);
  return isLoggedIn;
};

const getUsernameFromToken = (token) => {
  const decoded = jwt.decode(token);
  return decoded.username;
};

export { isEmpty, isLoggedIn, getUsernameFromToken };
