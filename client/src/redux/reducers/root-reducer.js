import usersReducer from "./user-reducers";
import logbooksReducer from "./logbook-reducers";
import { combineReducers } from "redux";
import commonReducers from "./common-reducers";

export default combineReducers({
  common: commonReducers,
  users: usersReducer,
  logbooks: logbooksReducer,
});
