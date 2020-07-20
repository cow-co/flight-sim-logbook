import { REGISTER, LOGIN, LOGOUT } from "../actions/action-types";

const INITIAL_STATE = {
  username: "",
  isLoggedIn: false,
};

const usersReducer = (currentState = INITIAL_STATE, action) => {
  switch (action.type) {
    case REGISTER:
      return currentState;
    case LOGIN:
      localStorage.setItem("token", action.payload.jwt);
      return {
        ...currentState,
        username: action.payload.username,
        isLoggedIn: true,
      };
    case LOGOUT:
      localStorage.setItem("token", "");
      return {
        ...currentState,
        username: "",
        isLoggedIn: false,
      };
    default:
      return currentState;
  }
};

export default usersReducer;
