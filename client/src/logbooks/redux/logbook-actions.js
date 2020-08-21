import { GET_LOGBOOKS, CREATE_LOGBOOK } from "../../common/redux/action-types";
import Axios from "axios";
import { axiosConfig } from "../../common/helpers/axiosConfig";
import { setAlert } from "../../common/redux/common-actions";
import { isEmpty } from "../../common/helpers/utils";
import { getUsernameFromToken } from "../../common/helpers/utils";
import { localLogout } from "../../users/redux/user-actions";

const getAllLogbooks = () => async (dispatch) => {
  const config = {
    ...axiosConfig(),
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  try {
    const response = await Axios.get(`/api/logbooks/${getUsernameFromToken(localStorage.getItem("token"))}`, config);
    const errors = response.data.errors;
    const status = response.status;

    if (status === 401) {
      await localLogout();
    } else {
      if (!isEmpty(errors)) {
        errors.forEach((error) => dispatch(setAlert(`${error}`, "error")));
      } else {
        dispatch({
          type: GET_LOGBOOKS,
          payload: response.data,
        });
      }
    }
  } catch (error) {
    dispatch(setAlert(`${error}`, "error"));
  }
};

const createLogbook = (data) => async (dispatch) => {
  const config = {
    ...axiosConfig(),
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-type": "application/json",
    },
  };

  try {
    const response = await Axios.post("/api/logbooks/create", data, config);
    const errors = response.data.errors;
    const status = response.status;

    if (status === 401) {
      await localLogout();
    } else {
      if (!isEmpty(errors)) {
        errors.forEach((error) => dispatch(setAlert(`${error}`, "error")));
      } else {
        dispatch({
          type: CREATE_LOGBOOK,
          payload: response.data,
        });
      }
    }
  } catch (error) {
    dispatch(setAlert(`${error}`, "error"));
  }
};

export { getAllLogbooks, createLogbook };
