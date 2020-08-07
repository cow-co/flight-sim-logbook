import { CREATE_LOGBOOK, GET_LOGBOOKS, GET_LOGBOOK, DELETE_LOGBOOK, ADD_MISSION } from "../actions/action-types";
import { isEmpty, getUsernameFromToken } from "../../helpers/utils";

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
    default:
      return currentState;
  }
};

export default logbooksReducer;
