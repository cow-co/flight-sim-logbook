import { REGISTER, LOGIN, CHECK_LOGIN_STATUS, LOGOUT } from "../../common/redux/action-types";
import { isEmpty, getUsernameFromToken } from "../../common/helpers/utils";

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
    case CHECK_LOGIN_STATUS:
      const jwt = localStorage.getItem("token");
      if (isEmpty(jwt)) {
        return {
          ...currentState,
          username: "",
          isLoggedIn: false,
        };
      } else {
        return {
          ...currentState,
          username: getUsernameFromToken(jwt),
          isLoggedIn: true,
        };
      }
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
