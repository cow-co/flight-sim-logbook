import { GET_ALL_AIRCRAFT } from "../../common/redux/action-types";

const INITIAL_STATE = {
  aircraft: [],
};

const aircraftReducer = (currentState = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ALL_AIRCRAFT:
      const newState = {
        ...currentState,
        aircraft: action.payload.aircraft,
      };
      console.log(newState);
      return newState;
    default:
      return currentState;
  }
};

export default aircraftReducer;
