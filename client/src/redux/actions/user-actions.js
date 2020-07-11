import { CREATE_USER, LOGIN, REGISTER, LOGOUT } from "./action-types";
import Axios from "axios";
import { axiosConfig } from "../../helpers/axiosConfig";
import { setAlert } from "./common-actions";
import { isEmpty } from "../../helpers/utils";

// TODO Retrieve the errorMessages from the responses and use those instead of the default Axios stuff?

const login = (data) => async (dispatch) => {
  const config = {
    ...axiosConfig(),
    headers: {
      "Content-type": "application/json",
    },
  };

  try {
    const response = await Axios.post("/api/users/login", data, config);
    const errors = response.data.errorMessages;

    if (!isEmpty(errors)) {
      errors.forEach((error) => dispatch(setAlert(`${error}`, "error")));
    } else {
      dispatch({
        type: LOGIN,
        payload: response.data,
      });
    }
  } catch (error) {
    dispatch(setAlert(`${error}`, "error"));
  }
};

const registerUser = (data) => async (dispatch) => {
  const config = {
    ...axiosConfig(),
    headers: {
      "Content-type": "application/json",
    },
  };

  try {
    const response = await Axios.post("/api/users/register", data, config);
    const errors = response.data.errorMessages;

    if (!isEmpty(errors)) {
      errors.forEach((error) => dispatch(setAlert(`${error}`, "error")));
    } else {
      dispatch(setAlert("Verification email sent. Be sure to check your spam folder!", "success"));
      dispatch({
        type: REGISTER,
        payload: response.data,
      });
    }
  } catch (error) {
    dispatch(setAlert(`${error}`, "error"));
  }
};

const logout = () => async (dispatch) => {
  const config = {
    ...axiosConfig(),
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  console.log(config);

  try {
    const response = await Axios.post("/api/users/logout", null, config);
    const errors = response.data.errorMessages;

    if (!isEmpty(errors)) {
      errors.forEach((error) => dispatch(setAlert(`${error}`, "error")));
    } else {
      dispatch(setAlert("Successfully Logged Out", "success"));
      dispatch({
        type: LOGOUT,
        payload: response.data,
      });
    }
  } catch (error) {
    dispatch(setAlert(`${error}`, "error"));
  }
};

export { login, registerUser, logout };
