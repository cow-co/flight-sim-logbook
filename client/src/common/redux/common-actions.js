import { SET_ALERT, REMOVE_ALERT } from "./action-types";
import { v4 as uuidv4 } from "uuid";

const TIMEOUT = 5000;

const setAlert = (msg, alertType) => (dispatch) => {
  const id = uuidv4();

  dispatch({
    type: SET_ALERT,
    payload: {
      msg,
      alertType,
      id,
    },
  });

  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), TIMEOUT);
};

export { setAlert };
