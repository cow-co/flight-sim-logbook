import { SET_ALERT, REMOVE_ALERT } from "../actions/action-types";

const INITIAL_STATE = [];

export default (currentState = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_ALERT:
      return [...currentState, payload];
    case REMOVE_ALERT:
      return currentState.filter((alert) => alert.id !== payload);
    default:
      return currentState;
  }
};
