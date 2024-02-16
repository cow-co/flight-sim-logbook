/**
 * @param {string} username
 * @returns {array[string]} errors
 */
const validateUsername = (username) => {
  let errors = [];
  const MIN_LENGTH = 3;

  if (username.length < MIN_LENGTH) {
    errors.push(`Minimum username length is ${MIN_LENGTH} characters!`);
  }

  return errors;
};

/**
 * @param {string} password
 * @param {string} passwordConfirmation
 * @returns {array[string]} errors
 */
const validatePassword = (password, passwordConfirmation) => {
  let errors = [];
  const MIN_LENGTH = 15;

  if (password.length < MIN_LENGTH) {
    errors.push(`Minimum password length is ${MIN_LENGTH} characters!`);
  }

  if (passwordConfirmation !== password) {
    errors.push("Password and confirmation must match!");
  }

  return errors;
};

module.exports = {
  validateUsername,
  validatePassword,
};
