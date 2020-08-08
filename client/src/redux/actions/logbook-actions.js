import { CREATE_LOGBOOK, GET_LOGBOOKS, GET_LOGBOOK, DELETE_LOGBOOK, ADD_MISSION } from "./action-types";
import Axios from "axios";
import { axiosConfig } from "../../helpers/axiosConfig";
import { setAlert } from "./common-actions";
import { isEmpty } from "../../helpers/utils";
import { getUsernameFromToken } from "../../helpers/utils";
import { localLogout } from "./user-actions";

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

export { getAllLogbooks };
