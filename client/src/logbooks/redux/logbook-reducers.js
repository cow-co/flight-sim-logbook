import { GET_LOGBOOKS, CREATE_LOGBOOK } from "../../common/redux/action-types";

const INITIAL_STATE = {
  logbooks: [],
  selectedLogbook: null,
};

const logbooksReducer = (currentState = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_LOGBOOKS:
      return {
        ...currentState,
        logbooks: action.payload.logbooks,
      };
    case CREATE_LOGBOOK:
      return {
        ...currentState,
        logbooks: currentState.logbooks.push(action.payload.logbook),
      };
    default:
      return currentState;
  }
};

export default logbooksReducer;
