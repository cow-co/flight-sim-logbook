import {
  GET_LOGBOOKS,
  CREATE_LOGBOOK,
  DELETE_LOGBOOK,
  SELECT_LOGBOOK,
  LOG_MISSION,
} from "../../common/redux/action-types";

const INITIAL_STATE = {
  logbooks: [],
  selectedLogbook: null,
};

// FIXME Reloading the page resets the "logged in" status on the client side (resets the header bar etc.)
const logbooksReducer = (currentState = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_LOGBOOKS:
      return {
        ...currentState,
        logbooks: action.payload.logbooks,
      };
    case CREATE_LOGBOOK:
      let newLogbooksList = currentState.logbooks;
      newLogbooksList.push(action.payload.logbook);
      return {
        ...currentState,
        logbooks: [...newLogbooksList],
      };
    case DELETE_LOGBOOK:
      let modifiedLogbooksList = currentState.logbooks.filter((logbook) => {
        return logbook.aircraft !== action.payload;
      });
      return {
        ...currentState,
        logbooks: [...modifiedLogbooksList],
      };
    case SELECT_LOGBOOK:
      return {
        ...currentState,
        selectedLogbook: action.payload,
      };
    case LOG_MISSION:
      return {
        ...currentState,
        selectedLogbook: action.payload,
      };
    default:
      return currentState;
  }
};

export default logbooksReducer;
