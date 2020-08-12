import { GET_ALL_AIRCRAFT } from "../../common/redux/action-types";
import Axios from "axios";
import { axiosConfig } from "../../common/helpers/axiosConfig";
import { setAlert } from "../../common/redux/common-actions";
import { isEmpty } from "../../common/helpers/utils";

const getAllAircraft = () => async (dispatch) => {
  const config = {
    ...axiosConfig(),
  };

  try {
    const response = await Axios.get("/api/aircraft/all", config);
    const errors = response.data.errors;

    if (!isEmpty(errors)) {
      errors.forEach((error) => dispatch(setAlert(`${error}`, "error")));
    } else {
      dispatch({
        type: GET_ALL_AIRCRAFT,
        payload: response.data,
      });
    }
  } catch (error) {
    dispatch(setAlert(`${error}`, "error"));
  }
};

export { getAllAircraft };
