import { GET_ALL_AIRCRAFT } from "../../common/redux/action-types";

const INITIAL_STATE = {
  aircraft: [],
};

const aircraftReducer = (currentState = INITIAL_STATE, action) => {
  console.log(action.payload);
  switch (action.type) {
    case GET_ALL_AIRCRAFT:
      return {
        ...currentState,
        aircraft: action.payload,
      };
    default:
      return currentState;
  }
};

export default aircraftReducer;
