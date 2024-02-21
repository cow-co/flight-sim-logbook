import conf from "./config/properties";
import store from "./redux/store";

/**
 * Grabs the JWT from local memory
 * @returns The JWT, if it exists in memory
 */
const getToken = () => {
  let token = store.getState().users.token;
  if (!token) {
    token = localStorage.getItem("token");
  }
  return token;
};

/**
 * Registers our user
 * @param {string} username Not used by backend if PKI is enabled
 * @param {string} password Not used by backend if PKI is enabled
 * @param {string} confirmPassword Not used by backend if PKI is enabled
 * @returns The JSON from the response
 */
const register = async (username, password, confirmPassword) => {
  let json = null;
  try {
    const response = await fetch(`${conf.apiURL}users/register`, {
      method: "POST",
      headers: new Headers({
        "content-type": "application/json",
      }),
      body: JSON.stringify({
        username,
        password,
        confirmPassword,
      }),
    });
    json = await response.json();
  } catch (err) {
    console.error(err);
    json = {
      errors: ["Error when calling API. Check console for details."],
    };
  }
  return json;
};

/**
 * Logs us in
 * @param {string} username
 * @param {string} password
 * @returns The JSON from the response
 */
const login = async (username, password) => {
  let json = null;
  try {
    const response = await fetch(`${conf.apiURL}users/login`, {
      method: "POST",
      headers: new Headers({
        "content-type": "application/json",
      }),
      body: JSON.stringify({
        username,
        password,
      }),
    });
    json = await response.json();
  } catch (err) {
    console.error(err);
    json = {
      errors: ["Error when calling API. Check console for details."],
    };
  }
  return json; // Because we will want to extract the returned username (which will have been trimmed etc) as well as the errors
};

/**
 * Logs the user out
 * @returns The JSON from the response
 */
const logout = async () => {
  let json = null;
  try {
    const response = await fetch(`${conf.apiURL}users/logout`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    json = await response.json();
  } catch (err) {
    console.error(err);
    json = {
      errors: ["Error when calling API. Check console for details."],
    };
  }
  return json;
};

/**
 * Checks that our JWT is valid
 * @returns The JSON from the response
 */
const checkToken = async () => {
  let json = null;

  try {
    const response = await fetch(`${conf.apiURL}users/whoami`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    json = await response.json();
  } catch (err) {
    console.error(err);
    json = {
      errors: ["Error when calling API. Check console for details."],
    };
  }
  return json;
};

export { register, login, logout, checkToken };
