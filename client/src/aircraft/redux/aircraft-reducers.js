import { GET_ALL_AIRCRAFT } from "../../common/redux/action-types";

const INITIAL_STATE = {
  aircraftList: [],
};

const aircraftReducer = (currentState = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ALL_AIRCRAFT:
      const newState = {
        ...currentState,
        aircraftList: action.payload.aircraft,
      };
      return newState;
    default:
      return currentState;
  }
};

export default aircraftReducer;
