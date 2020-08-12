import { LOGIN, CHECK_LOGIN_STATUS, REGISTER, LOGOUT } from "../../common/redux/action-types";
import Axios from "axios";
import { axiosConfig } from "../../common/helpers/axiosConfig";
import { setAlert } from "../../common/redux/common-actions";
import { isEmpty } from "../../common/helpers/utils";

const login = (data) => async (dispatch) => {
  const config = {
    ...axiosConfig(),
    headers: {
      "Content-type": "application/json",
    },
  };

  try {
    const response = await Axios.post("/api/users/login", data, config);
    const errors = response.data.errors;

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
    const errors = response.data.errors;

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

  try {
    const response = await Axios.post("/api/users/logout", null, config);
    const errors = response.data.errors;
    const status = response.status;

    if (status === 401) {
      await localLogout();
    } else {
      if (!isEmpty(errors)) {
        errors.forEach((error) => dispatch(setAlert(`${error}`, "error")));
      } else {
        dispatch(setAlert("Successfully Logged Out", "success"));
        dispatch({
          type: LOGOUT,
          payload: response.data,
        });
      }
    }
  } catch (error) {
    dispatch(setAlert(`${error}`, "error"));
  }
};

const localLogout = () => async (dispatch) => {
  dispatch({
    type: LOGOUT,
    payload: null,
  });
};

const checkLoginStatus = () => async (dispatch) => {
  dispatch({
    type: CHECK_LOGIN_STATUS,
    payload: null,
  });
};

export { login, registerUser, logout, localLogout, checkLoginStatus };
