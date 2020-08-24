import { GET_LOGBOOKS, CREATE_LOGBOOK, DELETE_LOGBOOK } from "../../common/redux/action-types";

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
    default:
      return currentState;
  }
};

export default logbooksReducer;
