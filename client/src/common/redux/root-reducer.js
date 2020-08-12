import usersReducer from "../../users/redux/user-reducers";
import logbooksReducer from "../../logbooks/redux/logbook-reducers";
import { combineReducers } from "redux";
import commonReducers from "./common-reducers";

export default combineReducers({
  common: commonReducers,
  users: usersReducer,
  logbooks: logbooksReducer,
});
