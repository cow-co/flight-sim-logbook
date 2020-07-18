import { REGISTER, LOGIN, LOGOUT } from "../actions/action-types";

const INITIAL_STATE = {
  username: "",
};

const usersReducer = (currentState = INITIAL_STATE, action) => {
  switch (action.type) {
    case REGISTER:
      return currentState;
    case LOGIN:
      localStorage.setItem("token", action.payload.jwt);
      currentState.username = action.payload.username;
      return currentState;
    case LOGOUT:
      localStorage.setItem("token", "");
      currentState.username = "";
      return currentState;
    default:
      return currentState;
  }
};

export default usersReducer;
