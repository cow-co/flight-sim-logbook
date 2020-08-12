import usersReducer from "../../users/redux/user-reducers";
import logbooksReducer from "../../logbooks/redux/logbook-reducers";
import aircraftReducer from "../../aircraft/redux/aircraft-reducers";
import { combineReducers } from "redux";
import commonReducers from "./common-reducers";

export default combineReducers({
  common: commonReducers,
  users: usersReducer,
  logbooks: logbooksReducer,
  aircraft: aircraftReducer,
});
